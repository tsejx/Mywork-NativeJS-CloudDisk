//1选择相关函数
//2弹窗相关函数
//3文件操作相关函数

// ---------------------------------------
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
  var arr = new Array();
  Array.from(currentData).forEach(function(item) {
    if (item.checked === true) {
      arr.push(item);
    }
  })
  return arr;
}

//获取被选中的文件的节点
function fileCheckedElement() {
  var arr = new Array();
  Array.from(arrFile).forEach(function(item) {
    if (item.classList.contains('active')) {
      arr.push(item);
    }
  })
  return arr;
}

//移除当前文档的选中状态
function removeFileChecked() {
  allChecked.classList.remove('active');
  for (var i = 0; i < currentData.length; i++) {
    currentData[i].checked = false;
  }
}

//为文件添加选中样式以及数据更改
function changeCheckedbox(file, checkedbox, data, onOff) {

  if (onOff) { //添加选中
    file.onmouseout = null;
    file.classList.add('active');
    file.firstElementChild.style.opacity = '1';

    checkedbox.classList.add('active');

    data.checked = true;

  } else { //移除选中

    file.classList.remove('active');
    file.firstElementChild.style.opacity = '';
    file.onmouseout = function() {
      this.firstElementChild.style.opacity = '';
    }
    checkedbox.classList.remove('active');
    data.checked = false;
  }
}

//弹窗相关函数----------------------------------------
//消息弹窗
var timerNotice; //消息弹窗的定时器和移动文件夹操作弹窗

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
function question(message, onOff) {
  var questionBox = tool.$('.question'),
    askMessage = tool.$('p', questionBox),
    shadowQuestion = tool.$('.question-shadow'),
    main = tool.$('.main');

  if (onOff) { //弹出弹窗
    main.classList.add('blur');
    header.classList.add('blur');
    askMessage.innerHTML = message;
    shadowQuestion.style.transform = 'scale(1)';
    tool.animate(questionBox, {
      top: 120
    }, 'easeBoth');
  } else { //去除弹窗

    tool.animate(questionBox, {
      top: 1000
    }, 'easeBoth', function() {
      shadowQuestion.style.transform = '';
      tool.css(questionBox, {
        top: -200
      });
      main.classList.remove('blur');
      header.classList.remove('blur');
    });
  }
}

function feedback(fn) {
  var arrBtn = tool.$('.question span'); //询问弹窗的确定/取消按钮
  arrBtn.forEach(function(item, i) {
    item.index = i;
    item.onclick = function() {
      if (!this.index) {
        fn();
        initHtml();
      }
      question('', false);
    };
  })
}

//遮罩层函数
function shadow(onOff) {
  var shadowBox = tool.$('.shadow'),
    main = tool.$('.main');
  if (onOff) {
    main.classList.add('blur');
    header.classList.add('blur');
    shadowBox.style.transform = 'scale(1)';
  } else {
    main.classList.remove('blur');
    header.classList.remove('blur');
    shadowBox.style.transform = '';
  }
}

function fileImage(fileId) {

  shadow(true);

  var dataImage = getItemDataById(currentData, fileId),
    wrapImage = tool.$('.img-box');
  wrapImage.src = dataImage.src;
  tool.css(wrapImage, {
    width: dataImage.width,
    height: dataImage.height
  });

  wrapImage.style.left = window.innerWidth / 2 - dataImage.width / 2 + 'px';
  wrapImage.style.top = window.innerHeight / 2 - dataImage.height / 2 + 'px';

  tool.animate(wrapImage, {
    scale: 1
  }, 100);

  wrapImage.addEventListener('click', function() {
    shadow(false);
    tool.animate(wrapImage, {
      scale: 0
    }, 50);
  })

}

// 文件操作相关函数---------------------------------------------
// 重命名功能函数---------------------------------------------
function fileRename(fileId, target) {
  if (isFileChecked()) {
    var arrCheckedBox = tool.$('.file-checkbox');
    for (var i = 0; i < arrFile.length; i++) {
      changeCheckedbox(arrFile[i], arrCheckedBox[i], currentData[i], false);
      allChecked.classList.remove('active');
    }
  }

  var inputFileName = target.lastElementChild.previousElementSibling;

  var textFileName = inputFileName.previousElementSibling;

  // 未重命名的文件名
  var originFileName = inputFileName.value;

  textFileName.style.display = 'none';
  inputFileName.style.display = 'inline-block';

  inputFileName.select();

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

//判断是否在重命名
function isRename() {
  var arrFileInfo = tool.$('.file-info');
  for (var i = 0; i < arrFileInfo.length; i++) {
    if (arrFileInfo[i].style.display === 'none') {
      return true;
    }
  }
  return false;
}

//重命名函数
function rename(nameShow, nameInput, approch, nameOrigin, fileClickId) {
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
    if (nameCanUse(nameInput.value, fileClickId)) {
      notification('你输入的文件名已经有了！', 'worry');
      nameInput.focus();
      return;
    }
    getItemDataById(data, fileClickId).name = nameInput.value;
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

//新建文件夹功能函数----------------------------------------------------------
function fileCreate() {

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
  fileImg.className = 'file-img file-type-folder';

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
  notification('请为新建文件夹命名', 'tip');

  fileRenameText.onkeydown = function(e) {
    if (e.keyCode === 13) {
      setName();
    }
  }

  fileRenameText.addEventListener('blur', isSetName);

  function isSetName(e) {
    if (e.target.style.display === 'none') {
      return;
    } else {
      setName();
      fileRenameText.removeEventListener('blur', isSetName);
    }
  }

  function setName() {
    var isCreate = rename(fileInfo, fileRenameText, 'create-file');

    var newFileData = {
      name: fileRenameText.value,
      id: ++user_data.maxId,
      pId: currentDataId,
      type: 'folder',
      time: getNowTime(),
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

//删除文件相关函数--------------------------------------------------------------
//删除单个未选中文件功能函数
function fileDeleteUnchecked(fileId) {
  question('您要删除这个文件吗？', true);

  feedback(executeDelete);

  function executeDelete() {
    var fileData = getItemDataById(currentData, fileId);

    for (var i = 0; i < currentData.length; i++) {
      if (currentData[i] === fileData) {
        currentData.splice(i, 1);
      }
    }
    notification(`您已成功删除文件`, 'success');
  }
}

//删除多个选中文件功能函数
function fileDeleteChecked() {
  var deleteNum = 0;
  for (var i = 0; i < currentData.length; i++) {
    if (currentData[i].checked) {
      currentData.splice(i, 1);
      i--;
      deleteNum++;
    }
  }
  notification(`您已成功删除${deleteNum}个文件`, 'success');
}

//移动文件夹功能函数-------------------------------------------------------------------------
function fileShift() {
  if (!isFileChecked()) {
    notification('您未选中文件！', 'worry');
    return;
  }

  shadow(true);

  //移动文件夹弹窗遮罩层//移动文件夹弹窗//移动文件夹弹窗的树状目录
  var alertShiftFile = tool.$('#shift-file-box'),
    catalogShiftFile = tool.$('.catalog-tree-list', alertShiftFile);

  catalogShiftFile.innerHTML = createCatalogTree(data);

  tool.animate(alertShiftFile, {
    top: 80
  }, 'easeBoth', notification('请您选择要移动到的文档', 'tip'));

  alertShiftFile.addEventListener('click', function(e) {
    var target = e.target,
      targetCls = target.classList;
    if (targetCls.contains('shiftfile-close')) {
      //取消移动文件夹的操作
      tool.animate(alertShiftFile, {
        top: 1600
      }, 'easeBoth', function() {
        tool.css(alertShiftFile, {
          top: -450
        });
        shadow(false);
      });

      return;
    }

    if (target.nodeName === 'SPAN') {
      if (targetCls.toggle('open')) {
        target.parentNode.lastElementChild.style.display = '';
      }
      if (targetCls.toggle('close')) {
        target.parentNode.lastElementChild.style.display = 'none';
      }
    }

    if (target.nodeName === 'A') {

      if (target.dataset.type !== 'folder') {
        notification('无法移动到非文件夹类型', 'error');
        return;
      }
      var targetId = target.dataset.id * 1;

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

      // 目标文件夹不能是选中文件夹的父级和子孙级
      for (var i = 0; i < dataFilesChildren.length; i++) {
        if (dataFilesChildren[i].id === targetId) {
          notification('不能移到该文件夹中！', 'worry');
          return;
        }
      }

      //目标文件夹中不能有重复名字的文档
      for (var i = 0; i < dataFilesChecked.length; i++) {
        for (var j = 0; j < targetChildrenData.length; j++) {
          if (dataFilesChecked[i].name === targetChildrenData[j].name) {
            notification('您要移动到文档中有重复的文件！', 'worry');
            return;
          }
        }
      }

      //检测无误，询问是否移动
      question(`您确定要移动到 ${targetData.name} 吗？`, true);

      feedback(executeShift);

      function executeShift() {
        //给目标文件夹添加
        dataFilesChecked.forEach(function(item) {
          targetChildrenData.push(item);
          item.pId = targetId;
        })

        // 删除当前文件中选中文件夹
        for (var i = 0; i < currentData.length; i++) {
          if (currentData[i].checked) {
            currentData[i].checked = false;
            currentData.splice(i, 1);
            i--;
          }
        }

        tool.animate(alertShiftFile, {
          top: 1600
        }, 'easeBoth', function() {
          tool.css(alertShiftFile, {
            top: -450
          });
          shadow(false);
        });

        notification(`您已成功移动 ${numChecked} 个文件到 ${targetData.name}`, 'success');
      }

    }
  })
}

//分享文件功能函数------------------------------------------------------------------------------------------
function fileShare() {
  shadow(true);

  var wrapShare = tool.$('.share-box'),
    listSocial = wrapShare.lastElementChild;

  tool.animate(wrapShare, {
    top: 120
  }, 'easeBoth');

  wrapShare.addEventListener('click', function(e) {
    if (e.target.classList.contains('share-box-close')) {
      tool.animate(wrapShare, {
        top: 800
      }, 500, 'easeBoth', function() {
        tool.css(wrapShare, {
          top: -200
        });
        shadow(false);
      });
    }
  })

  listSocial.addEventListener('click', function(e) {
    tool.animate(wrapShare, {
      top: 800
    }, 500, 'easeBoth', function() {
      tool.css(wrapShare, {
        top: -200
      });
      shadow(false);
    })
    notification(`您已成功分享文件到 ${e.target.dataset.name}`, 'success');
  })
}


//文档显示方式功能函数------------------------------------------------------------------------------------------
function eventView(btnViewCls, onOff) {
  if (onOff) { //缩略图形态

    btnViewCls.add('preview-form');
    wrapFiles.classList.add('layout-list');

    btnViewCls.remove('tabular-form');
    wrapFiles.classList.remove('layout-preview');

  } else { //列表形态
    btnViewCls.add('tabular-form');
    wrapFiles.classList.add('layout-preview');

    btnViewCls.remove('preview-form');
    wrapFiles.classList.remove('layout-list');
  }
}

//进入文件夹功能更函数(显示当前数据某个子元素的子集)------------------------------------------------------------------------------------------
function fileClick(dataId) {
  dataId = dataId * 1;

  //去除未进入文件夹时的数据选中
  removeFileChecked();

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

//文件复制功能---------------------------------------------------------------------------------------------------------------------------------------
var isCopyOrCut = true; //剪贴面板的数据是复制还是剪贴的//复制是true//剪贴是false

//文件复制操作的功能函数
function fileCopy(dataUncheackedCopy) {
  var objNew;

  clipBoard = new Array();

  if (isFileChecked()) {
    var arrFilesChecked = filesChecked();
    for (var i = 0; i < arrFilesChecked.length; i++) {
      objNew = JSON.parse(JSON.stringify(arrFilesChecked[i]));
      clipBoard.push(objNew);
    }
  } else {
    objNew = JSON.parse(JSON.stringify(dataUncheackedCopy));
    clipBoard.push(objNew);
  }
  isCopyOrCut = true;
  notification('鼠标右击空白可粘贴', 'tip');
}

//复制后的剪贴面板的数据
function dataCopy(data, parentId) {
  data.forEach(function(item, i) {
    item.checked = false;
    item.id = ++user_data.maxId;
    item.pId = parentId;
    item.time = getNowTime();
    if (item.children) {
      item.children = dataCopy(item.children, item.id);
    }
  })
  return data;
}

//剪切功能------------------------------------------------------------------------------------------
function fileCut(dataUncheackedCut) {
  clipBoard = new Array();

  if (isFileChecked()) {
    //拷贝当前显示的
    clipBoard = filesChecked();
    //删除当前显示的
    for (var i = 0; i < currentData.length; i++) {
      if (currentData[i].checked) {
        currentData.splice(i, 1);
        i--;
      }
    }
  } else {
    clipBoard.push(dataUncheackedCut);
    for (var i = 0; i < currentData.length; i++) {
      if (currentData[i].id === dataUncheackedCut.id) {
        currentData.splice(i, 1);
        i--;
      }
    }
  }
  isCopyOrCut = false;
  initHtml();
  notification('鼠标右击空白可粘贴', 'tip');
}

//剪切后剪贴面板的数据
function dataCut(data) {
  data.forEach(function(item, i) {
    item.checked = false;
    item.pId = currentDataId;
    item.time = getNowTime();
  })
  return data;
}

//删除数组特定位置的方法
function spliceOne(arr, index) {
  for (var i = index; i < arr.length; i++) {
    arr[i] = arr[i + 1];
  }
  arr.pop();
}

//文件粘贴功能------------------------------------------------------------------------------------------
function filePaste() {

  clipBoard = isCopyOrCut ? dataCopy(clipBoard, currentDataId) : dataCut(clipBoard);

  if (isCanPaste()) { //有重复名字cover?cancel

    question('文档中已有重复文件，是否全部覆盖?', true);

    feedback(executeCover);

    function executeCover() {
      for (var i = 0; i < currentData.length; i++) {
        if (!clipBoard.length) break;
        for (var j = 0; j < clipBoard.length; j++) {
          if (currentData[i].name === clipBoard[j].name) {
            currentData[i] = clipBoard[j];
            spliceOne(clipBoard, j);
            if (!clipBoard.length) break;
            j--;
          }
        }
      }
      if (clipBoard.length) {
        for (var i = 0; i < clipBoard.length; i++) {
          currentData.push(clipBoard[i]);
        }
      }
    }


  } else if (isCopyOrCut) { //复制//无重复名字
    paste();
    notification('已成功拷贝文件', 'success');
  } else { //剪切
    cut();
    notification('已成功剪切文件', 'success');
  }

  function paste() {
    for (var i = 0; i < clipBoard.length; i++) {
      currentData.push(clipBoard[i]);
    }
    clipBoard = new Array();
    initHtml();
  }

  function cut() {
    for (var i = 0; i < clipBoard.length; i++) {
      currentData.push(clipBoard[i]);
    }
    clipBoard = new Array();
    initHtml();
  }

}

//判断能否粘贴（有重复名字的时候会提示是否覆盖）
function isCanPaste() {
  for (var i = 0; i < currentData.length; i++) {
    for (var j = 0; j < clipBoard.length; j++) {
      if (currentData[i].name === clipBoard[j].name) return true;
    }
  }
  return false;
}

//获取即时日期//以xxx-xx-xx形式输出
function getNowTime() {
  var time = new Date(),
    year = time.getFullYear(),
    month = add0(time.getMonth() + 1),
    date = time.getDate();

  //补零函数
  function add0(num) {
    return num < 10 ? '0' + num : '' + num;
  }
  return year + '-' + month + '-' + date;
}

//---------------------------------------------------------
//排序函數
function eventSort(btnSortCls,onOff){

  if (onOff) {
    sortName();
    btnSortCls.remove('time-sort');
    btnSortCls.add('initial-letter');
  }else{
    sortTime();
    btnSortCls.remove('initial-letter');
    btnSortCls.add('time-sort');
  }
}

//时间排序
function sortTime() {
  currentData.sort(function(a,b){
    return parseInt(a.time.replace(/-/g,'')) - parseInt(b.time.replace(/-/g,''));
  })
  initHtml();

}

//名称排序
function sortName(){
  currentData.sort(function(a,b){
    return a.name > b.name;
  });
  initHtml();
}


//----------------------------------------------------------
//文件搜索
function search() {
  var inputSearch = tool.$('.search-text'),
    catalog = tool.$('.catalog'),
    arrSearchResult = new Array(),
    regSearchValue = new RegExp(inputSearch.value, 'gi'),
    allData = getChildrenById(data, 0);

  if (inputSearch.value === '') {
    notification('请输入内容再搜索','error');
    return;
  }
  
  for (var i = 1; i < allData.length; i++) {

    if (regSearchValue.test(allData[i].name)) {
      arrSearchResult.push(allData[i]);
    }
  }

  wrapFiles.innerHTML = createFileHtml(arrSearchResult);
  catalog.innerHTML = `Search : ${inputSearch.value}`;

}

//文件类型匹配
function fileTypeSelect(targetItem) {

  changeFileTypeItem();

  var fileType = targetItem.dataset.type;

  if (fileType === 'all') {
    fileClick(0);
    return;
  }

  var catalog = tool.$('.catalog'),
    arrSameTypeFile = new Array(),
    regSameTypeFile = new RegExp(fileType),
    allData = getChildrenById(data, 0);

  for (var i = 0; i < allData.length; i++) {
    if (regSameTypeFile.test(allData[i].type)) {
      arrSameTypeFile.push(allData[i]);
    }
  }

  wrapFiles.innerHTML = createFileHtml(arrSameTypeFile);

  catalog.innerHTML = `File Type : ${fileType.toUpperCase()}`;

  function changeFileTypeItem() {
    var fileTypeItems = tool.$('.file-type').children;
    for (var i = 0; i < fileTypeItems.length; i++) {
      fileTypeItems[i].classList.remove('active');
    }
    targetItem.classList.add('active');
  }

}