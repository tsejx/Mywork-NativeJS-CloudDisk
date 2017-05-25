//-------------------------------------------------------------
// 获取全局公用元素
var wrapFiles = tool.$('#file-container'); //文件内容区

var arrFile = wrapFiles.children; //文件内容区的 子元素集合

var wrapFeature = tool.$('.feature'); //功能按键面板

var wrapSidebar = tool.$('.sidebar-catalog'); //包装目录树的容器

var catalogSidebar = tool.$('.catalog-tree-list', wrapSidebar); //目录树根目录列表


var questionBox = tool.$('.question'); //询问弹窗

var arrBtn = tool.$('span', questionBox); //询问弹窗的确定/取消按钮


var allChecked = tool.$('.all-in'); //全选框

// -------------------------------------------------------------
//获取数据
var data = user_data.files; //数据 根目录

var rootChildren = data[0].children; //根目录下的数据子集

var currentData = rootChildren; //当前页面显示的文件的数据（初始化为根目录）

var currentDataId = 0; //当前数据的Id

var timerNotice, timerShiftFileBox; //消息弹窗的定时器和移动文件夹操作弹窗

// -------------------------------------------------------------
//初始化页面
function initHtml() {
  wrapFiles.innerHTML = createFileHtml(currentData);
  catalogSidebar.innerHTML = createCatalogTree(rootChildren);
  addFileEvent();
  catalogEvent();
}
initHtml();

// -----------------------------------------------------------------------------------------------
//点击文件的相关事件
wrapFiles.addEventListener('click', function(e) {

  var target = e.target,
    targetCls = target.classList;

  //获取点击的文件节点以及他的ID
  var fileGrandparent = target.parentNode.parentNode,
    fileId = fileGrandparent.dataset.id * 1;

  //文件勾选功能------------------------------------------------------
  if (targetCls.contains('file-checkbox')) {

    var dataChecked = getItemDataById(data, fileId),
      onOff = !dataChecked.checked;

    changeCheckedbox(fileGrandparent, target, dataChecked, onOff)

    eventAllChecked();

  }

  //重命名功能--------------------------------------------------------
  if (targetCls.contains('file-rename')) {

    var inputFileName = target.parentNode.parentNode.lastElementChild;

    var textFileName = inputFileName.previousElementSibling;

    // 未重命名的文件名
    var originFileName = inputFileName.value;

    textFileName.style.display = 'none';
    inputFileName.style.display = 'block';
    inputFileName.focus();

    var isRename;

    //键盘确认
    inputFileName.onkeydown = function(e) {
      var e = event || window.event || arguments.callee.caller.arguments[0];

      if (e && e.keyCode == 13) { // enter 键
        isRename = rename(textFileName, this, 'rename-file', originFileName, fileId);
        if (isRename === 'success') initHtml();
      }
    }

    inputFileName.addEventListener('blur', function() {
      if (this.style.display === 'none') {
        return;
      } else {
        isRename = rename(textFileName, this, 'rename-file', originFileName, fileId);
        if (isRename === 'success') initHtml();
      }
    })
  }

  //删除文件功能----------------------------------------------------------
  if (targetCls.contains('file-delete')) {

    question('您要删除这个文件吗？');

    arrBtn.forEach(function(item, i) {
      item.index = i;
      item.onclick = function() {
        if (!this.index) {
          var fileData = getItemDataById(currentData, fileId);

          for (var i = 0; i < currentData.length; i++) {
            if (currentData[i] === fileData) {
              currentData.splice(i, 1);
            }
          }
          notification(`您已成功删除文件`, 'success');
          initHtml();
        }
        questionBox.style.transfrom = '';
      };
    })
  }

  //进入文件夹----------------------------------------------------------
  if (targetCls.contains('file-img')) {

    fileId = target.parentNode.dataset.id * 1;

    clickFile(fileId);
  }

});

// -------------------------------------------------------------------------------------------------------
//功能按键面板的相关事件
wrapFeature.addEventListener('click', function(e) {
  var target = e.target,
    targetCls = target.classList;
  //上传功能---------------------------------------------------------
  if (targetCls.contains('upload')) {
    notification('尚未开启上传功能', 'error');
  }

  //创建文件夹-------------------------------------------------------
  if (targetCls.contains('new-file')) {
    // 创建节点 ==> 放入文件内容区 ==> 重命名流程

    var file = document.createElement('div');
    file.className = 'file';

    var filePanel = document.createElement('div');
    filePanel.className = 'file-panel';

    var fileCheckbox = document.createElement('span');
    fileCheckbox.className = 'file-checkbox';
    filePanel.appendChild(fileCheckbox);

    var fileRename = document.createElement('span');
    fileRename.className = 'file-rename';
    filePanel.appendChild(fileRename);

    var fileDelete = document.createElement('span');
    fileDelete.className = 'file-delete';
    filePanel.appendChild(fileDelete);

    var fileImg = document.createElement('div');
    fileImg.className = 'file-img';

    var fileInfo = document.createElement('div');
    fileInfo.className = 'file-info';

    var fileRenameText = document.createElement('input')
    fileRenameText.className = 'file-rename-text';

    file.appendChild(filePanel);
    file.appendChild(fileImg);
    file.appendChild(fileInfo);
    file.appendChild(fileRenameText);

    wrapFiles.insertBefore(file, arrFile[0]);

    fileInfo.style.display = 'none';
    fileRenameText.style.display = 'block';
    fileRenameText.focus();

    fileRenameText.onkeydown = function(e) {

      if (e.keyCode === 13) {
        setName();
      }
    }

    fileRenameText.addEventListener('blur', function() {
      if (this.style.display === 'none') {
        return;
      } else {
        setName();
      }

    });

    function setName() {
      var isCreate = rename(fileInfo, fileRenameText, 'create-file');

      var newFileData = {
        name: fileRenameText.value,
        id: ++user_data.maxId,
        pId: currentDataId,
        children: [],
      };
      switch (isCreate) {
        case 'cancel':
          wrapFiles.removeChild(wrapFiles.firstElementChild);
          notification('您已取消创建文件夹', 'error');
          break;
        case 'repeat':
          notification('你输入的文件名已经有了！', 'worry');
          break;
        case 'success':
          currentData.unshift(newFileData);
          initHtml();
          notification('您已成功创建文件夹', 'success');
          break;
      }
    }
  }

  //下载文件-----------------------------------------------------------------
  if (targetCls.contains('download')) {
    notification('尚未开启下载功能', 'error');
  }

  //移动文件------------------------------------------------------------------
  if (targetCls.contains('shift-file')) {

    if (!isFileChecked()) {
      notification('您未选中文件！', 'worry');
      return;
    }

    window.cancelAnimationFrame(timerShiftFileBox);

    //移动文件夹弹窗遮罩层//移动文件夹弹窗//移动文件夹弹窗的树状目录
    var alertShiftFile = tool.$('#shift-file-box'),
      catalogShiftFile = tool.$('.catalog-tree-list', alertShiftFile);

    catalogShiftFile.innerHTML = createCatalogTree(rootChildren);

    shadowIn();

    timerShiftFileBox = tool.animate(alertShiftFile, {
      top: 80
    }, 'easeInStrong');

    //取消移动文件夹的操作
    var shiftFileClose = tool.$('.shiftfile-close');
    shiftFileClose.onclick = function() {
      timerShiftFileBox = tool.animate(alertShiftFile, {
        top: 1600
      }, 'easeInStrong', function() {
        tool.css(alertShiftFile, {
          top: -450
        });
        shadowOut();
      });
    }

    catalogShiftFile.addEventListener('click', function(e) {

      var target = e.target,
        targetId = target.dataset.id * 1;

      //获取已选中的文件夹的数据
      var dataFilesChecked = filesChecked(),
        numChecked = dataFilesChecked.length;

      //获取已选中的文件夹的子孙级元素的数据
      var dataFilesChildren = [getItemDataById(data, currentDataId)];

      dataFilesChecked.forEach(function(item) {
        dataFilesChildren = dataFilesChildren.concat(getChildrenById(data, item.id));
      })

      //要移动到的文件夹的所有数据
      var targetData = getItemDataById(data, targetId),
        targetChildrenData = targetData.children;

      // 目标文件夹不能是选中文件夹的父级元素以及子孙级元素
      for (var i = 0; i < dataFilesChildren.length; i++) {
        if (dataFilesChildren[i].id === targetId) {
          notification('不能移到该文件夹中！', 'worry');
          return;
        }
      }

      //目标文件夹中不能有重复名字
      for (var i = 0; i < dataFilesChecked.length; i++) {
        for (var j = 0; j < targetChildrenData.length; j++) {
          if (dataFilesChecked[i].name === targetChildrenData[j].name) {
            notification('您要移动到文档中有重复的文件！', 'worry');
            return;
          }
        }
      }

      //检测无误，询问是否移动
      question(`您确定要移动到 ${targetData.name} 吗？`);

      arrBtn.forEach(function(item, i) {
        item.index = i;
        item.onclick = function() {
          if (!this.index) {
            //给目标文件夹添加
            dataFilesChecked.forEach(function(item) {
              targetChildrenData.push(item);
              item.pId = targetId;
            })

            // 删除当前文件中选中文件夹
            for (var i = 0; i < currentData.length; i++) {
              if (currentData[i].checked) {
                currentData.splice(i, 1);
                i--;
              }
            }
            initHtml();

            timerShiftFileBox = tool.animate(alertShiftFile, {
              top: 1600
            }, 'easeInStrong', function() {
              tool.css(alertShiftFile, {
                top: -450
              });
              shadowOut();
            });
            questionBox.style.transform = '';
            notification(`您已成功移动 ${numChecked} 个文件到 ${targetData.name}`, 'success');
          }
        };
      })
    })
  }


  //删除文件夹------------------------------------------------------------------
  if (targetCls.contains('delete-file')) {
    if (!isFileChecked()) {
      notification('您未选中文件！', 'worry');
      return;
    }

    question('您要删除选中的文件吗？');

    arrBtn.forEach(function(item, i) {
      item.index = i;
      item.onclick = function() {
        if (!this.index) {
          var deleteNum = 0;
          for (var i = 0; i < currentData.length; i++) {
            if (currentData[i].checked) {
              currentData.splice(i, 1);
              i--;
              deleteNum++;
            }
          }
          notification(`您已成功删除${deleteNum}个文件`, 'success');
          initHtml();
        }
        questionBox.style.transform = '';
        console.log(1);
      };
    })
  }

  //分享文件夹----------------------------------------------------------------
  if (targetCls.contains('share')) {
    notification('尚未开启分享功能', 'error');
  }

  //--- 功能按键面板---

  //搜索栏------------------------------------------------------------------
  if (targetCls.contains('search-text')) {
    notification('尚未开启搜索功能', 'error');

    if (target.value === 'Search your files') {
      target.value = '';
    }

    target.addEventListener('blur', function() {
      if (target.value === '') {
        target.value = 'Search your files';
      }
    });
  }

  //排序方式-----------------------------------------------------------------
  if (targetCls.contains('sort-by')) {
    notification('尚未开启文件排序功能', 'error');
    targetCls.toggle('initial-letter');
    targetCls.toggle('time-sort');
  }

  //查看方式-------------------------------------------------------------------
  if (targetCls.contains('to-view')) {
    notification('尚未开启查看方式转换功能', 'error');
    targetCls.toggle('tabular-form');
    targetCls.toggle('preview-form');
  }
});

//全选功能
allChecked.addEventListener('click', function() {

  if (!currentData[0]) {
    notification('当前文档无文件', 'error');
    return;
  }

  var arrCheckedBox = document.querySelectorAll('.file-checkbox');

  //移除选中
  if (isAllChecked()) {
    allChecked.classList.remove('active');
    for (var i = 0; i < arrFile.length; i++) {
      changeCheckedbox(arrFile[i], arrCheckedBox[i], currentData[i], false);
    }
    return;
  }

  //添加全选
  if (!isAllChecked() || isFileChecked()) {

    allChecked.classList.add('active');
    for (var i = 0; i < arrFile.length; i++) {
      changeCheckedbox(arrFile[i], arrCheckedBox[i], currentData[i], true);
    }
  }
})

/////////////////////////////////////////////////////////////

//消息弹窗
function notification(message, type) {
  var notice = tool.$('#notification'); //消息弹框

  clearTimeout(timerNotice);
  notice.className = '';
  notice.classList.add(type);

  notice.firstElementChild.innerHTML = message;

  notice.lastElementChild.addEventListener('click', function() {
    tool.css(notice, 'top', -100);
    notice.classList.remove(type);
    clearTimeout(timerNotice);
  })

  tool.animate(notice, {
    top: 5
  }, 300, 'easeBothStrong', function() {
    timerNotice = setTimeout(function() {
      tool.animate(notice, {
        top: -50
      }, 500, 'easeBothStrong')
    }, 1500)
  });
}

//咨询弹窗
function question(message) {
  var askMessage = tool.$('p', questionBox);
  askMessage.innerHTML = message;
  questionBox.style.transform = 'scale(1)';
}


//判断文件重命名时输入的文件名是否重复
function nameCanUse(nameInput, fileId) {
  var isName = false;
  for (var i = 0; i < currentData.length; i++) {
    if (fileId && currentData[i].id === fileId) {
      continue;
    }
    if (nameInput === currentData[i].name) {
      isName = true;
    }
  }
  return isName; // 如果传入的文件名已经存在，返回true
}

//重命名函数
function rename(nameShow, nameInput, approch, nameOrigin, clickFileId) {
  if (approch === 'create-file') {
    if (!nameInput.value || !nameInput.value.trim()) { //取消新建文件夹
      return 'cancel';
    }
    if (nameCanUse(nameInput.value)) { //命名已存在，继续命名
      nameInput.focus();
      return 'repeat';
    }
  }

  if (approch === 'rename-file') {
    if (!nameInput.value || !nameInput.value.trim()) {
      nameInput.value = nameOrigin;
    }
    if (nameCanUse(nameInput.value, clickFileId)) {
      notification('你输入的文件名已经有了！', 'worry');
      nameInput.focus();
      return;
    }
    getItemDataById(data, clickFileId).name = nameInput.value;
  }

  if (nameInput.value.length >= 12) {
    notification('你输入的文件名太长啦！', 'worry');
    nameInput.focus();
    return;
  }

  nameShow.innerHTML = nameInput.value;
  nameInput.style.display = 'none';
  nameShow.style.display = 'block';

  if (nameOrigin && nameInput.value === nameOrigin) return;
  if (approch === 'rename-file') notification('已成功重命名！', 'success');

  return 'success';
}



////////////////////////////////////////////
/////////////动画效果///////////////////////
////////////////////////////////////////////


//侧边栏的树状目录的动画效果----------------------------

var timerTree;

wrapSidebar.addEventListener('mouseenter', function(e) {

  cancelAnimationFrame(timerTree);
  timerTree = tool.animate(wrapSidebar, {
    left: 0
  }, 300);

})

wrapSidebar.addEventListener('mouseleave', function(e) {
  cancelAnimationFrame(timerTree);
  timerTree = tool.animate(wrapSidebar, {
    left: -239
  }, 300);
})

////////////////////////////////////////////
/////////////方法函数化/////////////////////
////////////////////////////////////////////

//创建文件内容区的HTML结构
function createFileHtml(data) {
  var str = ``,
    i, len = data.length;

  for (var i = 0; i < len; i++) {
    str += `<div class="file" data-id="${data[i].id}">
              <div class="file-panel">
                <span class="file-checkbox"></span>
                <span class="file-delete"></span>
                <span class="file-rename"></span>
              </div>
              <div class="file-img"></div>
              <div class="file-info" title="${data[i].name}">${data[i].name}</div>
              <input class="file-rename-text" type="text" value="${data[i].name}">
            </div>`
  }
  return str;
}

// 遍历所有页面显示的所有文件夹
function addFileEvent() {
  Array.from(arrFile).forEach(function(item) {

    var itemPanel = tool.$('.file-panel', item);

    item.onmouseover = function() {
      itemPanel.style.display = 'block';
    }

    item.onmouseout = function() {
      itemPanel.style.display = '';
    }
  });
}

//进入文件夹(显示当前数据某个子元素的子集)
function clickFile(dataId) {
  dataId = dataId * 1;

  //去除未进入文件夹时的数据选中
  allChecked.classList.remove('active');
  for (var i = 0; i < currentData.length; i++) {
    currentData[i].checked = false;
  }

  var catalog = tool.$('.catalog'); //目录栏

  currentData = getItemDataById(data, dataId).children;

  var str = ``,
    currentParentId; //当前数据的pId

  var arrAncestor = getParentsById(data, dataId);

  currentDataId = arrAncestor[0].id;
  //当前页面显示数据的父级pId
  if (!arrAncestor[1]) {
    currentParentId = 0;
  } else {
    currentParentId = arrAncestor[1].id;
  }
  str = `<a class="to-parent" href="javascript:;" data-id="${currentParentId}">Previous</a> 
           <span>|</span>`;

  //生成目录栏数据
  for (var i = arrAncestor.length - 2; i >= 0; i--) {
    str += `<a class="${arrAncestor[i].name}" href="javascript:;" data-id="${arrAncestor[i].id}">${arrAncestor[i].name}</a>`;

    if (i) str += `<span>></span>`;
  }

  catalog.innerHTML = str;

  initHtml();
}

//生成目录结构
function catalogEvent() {
  var catalog = tool.$('.catalog'); //目录栏
  var arrCatalog = tool.$('a', catalog);
  for (var i = 0; i < arrCatalog.length; i++) {
    arrCatalog[i].index = i;
    arrCatalog[i].onclick = function() {
      clickFile(arrCatalog[this.index].dataset.id);
      var clickFileId = arrCatalog[this.index].dataset.id * 1;
      if (!clickFileId) {
        catalog.innerHTML = 'Root';
      }
    }
  }
}

//生成侧边栏目录树
function createCatalogTree(data) {
  var str = ``;
  Array.from(data).forEach(function(item, i) {
    str += `<li><span data-id="${item.id}">${item.name}</span>`;
    if (item.children) {
      str += '<ul>' + createCatalogTree(item.children) + '</ul>';
    }
    str += `</li>`;
  })
  return str;
}

wrapSidebar.addEventListener('click', function(e) {
  var catalog = tool.$('.catalog'),
    target = e.target,
    targetId = target.dataset.id * 1;


  if (targetId === 0) {
    currentData = getItemDataById(data, 0).children;
    initHtml();
    catalog.innerHTML = 'Root';
  }

  if (target.nodeName === 'SPAN' && targetId) {
    clickFile(targetId);
  }

  // if (target.nodeName === 'SPAN' && target.nextElementSibling.children[0]) {
  //   target.nextElementSibling.classList.add('active');
  // }

})

//判断是否有文件被选中
function isFileChecked() {
  var isChecked = false,
    arr = [];
  Array.from(currentData).forEach(function(item) {
    if (item.checked === true) {
      isChecked = true;
    }
  })
  return isChecked;
}

//获取被选中的文件的数据
function filesChecked() {
  var arr = [];
  Array.from(currentData).forEach(function(item) {
    if (item.checked === true) {
      arr.push(item);
    }
  })
  return arr;
}

//判断当前显示数据是否全选
function isAllChecked() {
  var isChecked = false,
    checkedNum = currentData.length;

  for (var i = 0; i < currentData.length; i++) {
    currentData[i].checked ? checkedNum-- : checkedNum++;
  }

  isChecked = !checkedNum ? true : false;

  return isChecked;
}

//全选转换事件
function eventAllChecked() {
  if (isAllChecked()) {
    allChecked.classList.add('active');
  } else {
    allChecked.classList.remove('active');
  }
}


//为文件添加选中样式以及数据更改
function changeCheckedbox(file, checkedbox, data, onOff) {

  if (onOff) { //添加选中
    file.onmouseout = null;
    file.classList.add('active');
    file.firstElementChild.style.display = 'block';

    checkedbox.classList.add('active');

    data.checked = true;

  } else { //移除选中

    file.classList.remove('active');
    file.firstElementChild.style.display = '';
    file.onmouseout = function() {
      this.firstElementChild.style.display = '';
    }

    checkedbox.classList.remove('active');
    
    data.checked = false;

  }
}

var shadowBox = tool.$('.shadow');

function shadowIn(){
  shadowBox.style.transform = 'scale(1)';
}

function shadowOut(){
  shadowBox.style.transform = '';
}