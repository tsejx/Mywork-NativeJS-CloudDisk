// -------------------------------------------------------------
// 获取全局公用元素
var wrapFile = tool.$('#file-container'); //文件内容区

var arrFile = wrapFile.children; //文件内容区的 子元素集合

var wrapFeature = tool.$('.feature-panel'); //功能按键面板

var sidebarCatalog = tool.$('.sidebar-catalog'); //包装目录树的容器

var sidebarCatalogTree = tool.$('.catalog-tree-list', sidebarCatalog); //目录树根目录列表

var catalog = tool.$('.catalog'); //目录栏

var notice = tool.$('#notification'); //消息弹框

var shadowQuestion = tool.$('.shadow-question'); //询问弹窗遮罩层

var questionBox = tool.$('.question'); //询问弹窗

var arrBtn = tool.$('span', questionBox); //询问弹窗的确定/取消按钮

var shadowShiftFile = tool.$('.shadow-shift-file'); //移动文件夹弹窗遮罩层

var shiftfileCatalog = tool.$('#shift-file-box'); //移动文件夹弹窗

var shiftfileCatalogTree = tool.$('.catalog-tree-list', shiftfileCatalog); //移动文件夹弹窗的树状目录


// -------------------------------------------------------------
//获取数据
var data = user_data.files; //数据 根目录

var rootChildren = data[0].children; //根目录下的数据子集

var currentData = getItemDataById(data, 0).children; //当前页面显示的文件的数据（初始化为根目录）

var currentParentId = 0; //当前数据的pId

var currentDataId = 0; //当前数据的Id

var clickFileId = 0; //当前点击的文件的id

var timerNotice; //消息弹窗的定时器

var timerShiftFileBox;//移动文件夹操作弹窗

// -------------------------------------------------------------
//初始化页面
function initHtml() {
  wrapFile.innerHTML = createFileHtml(currentData);
  sidebarCatalogTree.innerHTML = createCatalogTree(rootChildren);
  shiftfileCatalogTree.innerHTML = createCatalogTree(rootChildren);
  addFileEvent();
  catalogEvent();
}
initHtml();

// -------------------------------------------------------------
//点击文件的相关事件
wrapFile.onclick = function(e) {

  var target = e.target;

  var fileGrandparent = target.parentNode.parentNode; //文件功能面板的功能按键的祖父级

  var fileId = fileGrandparent.dataset.id * 1; //当前点击文件的id

  //文件勾选功能
  if (target.classList.contains('file-checkbox')) {

    target.classList.toggle('active');

    // 给选中的文件数据添上checked
    var dataChecked = getItemDataById(data, fileId);

    dataChecked.checked = fileGrandparent.classList.toggle('active');

    if (dataChecked.checked) { //取消移出事件

      fileGrandparent.onmouseleave = null;

    } else { //添加移出事件
      fileGrandparent.onmouseleave = function() {
        var itemPanel = tool.$('.file-panel', this);
        itemPanel.style.display = '';
      }
    }
  }

  //重命名功能
  if (target.classList.contains('file-rename')) {

    var fileRenameText = target.parentNode.parentNode.lastElementChild;

    var fileName = fileRenameText.previousElementSibling;

    // 未重命名的文件名
    var originFileName = fileRenameText.value;

    fileName.style.display = 'none';
    fileRenameText.style.display = 'block';
    fileRenameText.focus();

    var isRename;

    //键盘确认
    fileRenameText.onkeydown = function(e) {
      var e = event || window.event || arguments.callee.caller.arguments[0];

      if (e && e.keyCode == 13) { // enter 键
        isRename = rename(fileName, this, 'rename-file', originFileName, fileId);
        if (isRename === 'success') initHtml();
      }
    }

    fileRenameText.addEventListener('blur', function() {
      if (this.style.display === 'none') {
        return;
      } else {
        isRename = rename(fileName, this, 'rename-file', originFileName, fileId);
        if (isRename === 'success') initHtml();
      }
    })
  }

  //删除文件功能
  if (target.classList.contains('file-delete')) {

    question('您要删除选中的文件吗？');

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
          notification(`您已成功删除文件`, 'green');
          initHtml();
        }
        shadowQuestion.style.transform = '';
      };
    })
  }

  //进入文件夹
  if (target.classList.contains('file-img')) {

    fileId = target.parentNode.dataset.id * 1;

    clickFile(fileId);
  }

}

// -------------------------------------------------------------
//功能按键面板的相关事件
wrapFeature.addEventListener('click', function(e) {
    /*
     * 功能栏：上传文件
     */
    if (e.target.classList.contains('upload')) {
      notification('尚未开启上传功能', 'yellow');
    }

    /*
     * 功能栏：创建文件夹
     */
    if (e.target.classList.contains('new-file')) {
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

      wrapFile.insertBefore(file, arrFile[0]);

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
            wrapFile.removeChild(wrapFile.firstElementChild);
            notification('您已取消创建文件夹', 'yellow');
            break;
          case 'repeat':
            notification('你输入的文件名已经有了！', 'red');
            break;
          case 'success':
            currentData.unshift(newFileData);
            initHtml();
            notification('您已成功创建文件夹', 'green');
            break;
        }
      }
    }

    /*
     *  功能栏：下载文件
     */
    if (e.target.classList.contains('download')) {
      notification('尚未开启下载功能', 'yellow');
    }

    /*
     * 功能栏：移动文件
     */

    if (e.target.classList.contains('shift-file')) {

      if (isFileChecked()) {
        notification('您未选中文件！', 'red');
        return;
      }
      
      window.cancelAnimationFrame(timerShiftFileBox);

      // shadowShiftFile.style.transform = 'scale(1)';
      shadowShiftFile.style.display = 'block';

      timerShiftFileBox = tool.animate(shiftfileCatalog,{top:80},'easeInStrong');

      
      

      //取消移动文件夹的操作
      var shiftFileClose = tool.$('.shiftfile-close');
      shiftFileClose.onclick = function() {
        timerShiftFileBox = tool.animate(shiftfileCatalog,{top:1600},'easeInStrong',function(){
          tool.css(shiftfileCatalog,{top:-450});
          shadowShiftFile.style.display = '';
        });
      }

      shiftfileCatalogTree.addEventListener('click', function(e) {



        var target = e.target,
          targetId = target.dataset.id * 1;

        //当前文件夹以及子集的数据 currentData currentParentId currentDataId

        //获取已选中的文件夹的数据
        var filesCheckedData = filesChecked();

        //获取已选中的文件夹的子孙级元素的数据
        var filesCheckedChildrenData = [getItemDataById(data, currentDataId)];

        filesCheckedData.forEach(function(item) {
          filesCheckedChildrenData = filesCheckedChildrenData.concat(getChildrenById(data, item.id));
        })

        //要移动到的文件夹的所有数据
        var targetData = getItemDataById(data, targetId),
          targetChildrenData = targetData.children;

        // 目标文件夹不能是选中文件夹的父级元素以及子孙级元素
        for (var i = 0; i < filesCheckedChildrenData.length; i++) {
          if (filesCheckedChildrenData[i].id === targetId) {
            notification('不能移到该文件夹中！', 'red');
            return;
          }
        }

        //目标文件夹中与选中文件夹有重复名字
        for (var i = 0; i < filesCheckedData.length; i++) {
          for (var j = 0; j < targetChildrenData.length; j++) {
            if (filesCheckedData[i].name === targetChildrenData[j].name) {
              notification('您要移动到文档中有重复的文件！', 'red');
              return;
            }
          }
        }

        //成功移到xx文件夹内！
        question(`您确定要移动到 ${targetData.name} 吗？`);

        arrBtn.forEach(function(item, i) {
          item.index = i;
          item.onclick = function() {
            if (!this.index) {
              filesCheckedData.forEach(function(item) {
                targetChildrenData.push(item);
              })

              // 删除当前文件中选中文件夹
              for (var i = 0; i < currentData.length; i++) {
                if (currentData[i].checked) {
                  currentData.splice(i, 1);
                  i--;
                }
              }
              initHtml();
              
              timerShiftFileBox = tool.animate(shiftfileCatalog,{top:1600},'easeInStrong',function(){
                tool.css(shiftfileCatalog,{top:-450});
                shadowShiftFile.style.display = '';
              });
            }
            shadowQuestion.style.transform = '';
          };
        })
      })
    }


    /*
     * 功能栏：删除文件夹
     */
    if (e.target.classList.contains('delete-file')) {
      if (isFileChecked()) {
        notification('您未选中文件！', 'red');
        return;
      }

      question('您要删除选中的文件吗？');
      // questionBox.style.transform = 'scale(1)';

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
            notification(`您已成功删除${deleteNum}个文件`, 'green');
            initHtml();
          }
          shadowQuestion.style.transform = '';
        };
      })
    }

    /*
     * 功能栏：分享文件
     */

    if (e.target.classList.contains('share')) {
      notification('尚未开启分享功能', 'yellow');
    }

  })
  //--- 功能按键面板---

/*
 * 功能区：搜索栏
 */
var searchText = tool.$('.search-text');

searchText.addEventListener('click', function() {
  if (this.value === 'Search your files') {
    this.value = '';
  }
});

searchText.addEventListener('blur', function() {
  if (this.value === '') {
    this.value = 'Search your files';
  }
});

/*
 * 功能区：排序方式与查看方式
 */
var btnSort = tool.$('.sort-by'),
  btnView = tool.$('.to-view');

btnSort.addEventListener('click', function() {
  this.classList.toggle('initial-letter');
  this.classList.toggle('time-sort');
})

btnView.addEventListener('click', function() {
  this.classList.toggle('tabular-form');
  this.classList.toggle('preview-form');
})

/**
 * [notification 消息窗弹出]
 * @param  {[string]} message [弹窗显示的内容]
 * @return {[undefined]}         [undefined]
 */

function notification(message, type) {
  clearTimeout(timerNotice);
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
      }, 500, 'easeBothStrong', function() {
        notice.classList.remove(type);
      })
    }, 1500)
  });
}

//咨询弹框
function question(message) {
  var askMessage = tool.$('p', questionBox);
  askMessage.innerHTML = message;
  shadowQuestion.style.transform = 'scale(1)';
}

/**
 * [nameCanUse 判断文件重命名时输入的文件名是否重复]
 * @param  {[string]} name [输入的文件名]
 * @return {[type]}      [description]
 */
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
  // 如果传入的文件名已经存在，返回true
  return isName;
}

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
      notification('你输入的文件名已经有了！', 'red');
      nameInput.focus();
      return;
    }
    getItemDataById(data, clickFileId).name = nameInput.value;
  }

  if (nameInput.value.length >= 12) {
    notification('你输入的文件名太长啦！', 'red');
    nameInput.focus();
    return;
  }

  nameShow.innerHTML = nameInput.value;
  nameInput.style.display = 'none';
  nameShow.style.display = 'block';

  if (nameOrigin && nameInput.value === nameOrigin) return;
  if (approch === 'rename-file') notification('已成功重命名！', 'green');

  return 'success';
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

sidebarCatalog.addEventListener('click', function(e) {
  var target = e.target,
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

//侧边栏的树状目录的动画效果----------------------------
var timerTree;

sidebarCatalog.addEventListener('mouseenter', function(e) {

  cancelAnimationFrame(timerTree);
  timerTree = tool.animate(sidebarCatalog, {
    left: 0
  }, 300);

})

sidebarCatalog.addEventListener('mouseleave', function(e) {
  cancelAnimationFrame(timerTree);
  timerTree = tool.animate(sidebarCatalog, {
    left: -238
  }, 300);
})

// -------------------------------------------------------------
// 方法函数化
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

  currentData = getItemDataById(data, dataId).children;

  var str = ``;

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
  var arrCatalog = tool.$('a', catalog);
  for (var i = 0; i < arrCatalog.length; i++) {
    arrCatalog[i].index = i;
    arrCatalog[i].onclick = function() {
      clickFile(arrCatalog[this.index].dataset.id);
      clickFileId = arrCatalog[this.index].dataset.id * 1;
      if (!clickFileId) {
        catalog.innerHTML = 'Root';
      }
    }
  }
}

//判断是否有文件被选中
function isFileChecked() {
  var fileChecked = true,
    arr = [];
  Array.from(currentData).forEach(function(item) {
    if (item.checked === true) {
      fileChecked = false;
    }
  })
  return fileChecked;
}

//获取被选中的文件
function filesChecked() {
  var arr = [];
  Array.from(currentData).forEach(function(item) {
    if (item.checked === true) {
      arr.push(item);
    }
  })
  return arr;
}