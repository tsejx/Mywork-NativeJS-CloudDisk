//文件夹根目录
var wrapFile = document.getElementById('file-container');
//文件夹根目录下的 子元素集合
var arrFile = wrapFile.children;

//新建文件夹(按钮)
var createFile = tool.$('.new-file');
//删除文件夹（按钮）
var deleteFile = tool.$('.delete-file');

//文件全选框
// var allIn = tool.$('.all-in');

//根目录
var data = user_data.files;

var rootChildren = getItemDataById(data, 0).children;

//当前数据
var currentData = rootChildren;
//当前数据的Id//子数据的pId
var currentDataId = 0;
var subDataId;

var newFileNum = 2;

//目录栏
var catalog = tool.$('.catalog');

var clickFileId = 0;

//初始化页面
function init() {
  wrapFile.innerHTML = createFileHtml(currentData);
  addFileEvent();
  catalogEvent();
}
init();


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

/**
 * [catalogEvent 目录事件]
 * @return {[type]} [description]
 */
function catalogEvent() {
  var arrCatalog = tool.$('a', catalog);
  for (var i = 0; i < arrCatalog.length; i++) {
    arrCatalog[i].index = i;
    arrCatalog[i].onclick = function() {
      clickToFile(arrCatalog[this.index].dataset.id);
      clickFileId = arrCatalog[this.index].dataset.id * 1;
      if (!clickFileId) {
        catalog.innerHTML = 'Root';
      }
    }
  }
}

//点击文件夹的选中框
wrapFile.onclick = function(e) {
  //文件勾选
  if (e.target.classList.contains('file-checkbox')) {
    var fileNode = e.target.parentNode.parentNode;
    e.target.classList.toggle('active');
    var id = e.target.dataset.id * 1;
    currentData[id].checked = fileNode.classList.toggle('active');
    if (currentData[id].checked) { //取消移出
      fileNode.onmouseout = null;
    } else { //增加移出
      fileNode.onmouseout = function() {
        var itemPanel = tool.$('.file-panel', this);
        itemPanel.style.display = '';
      }
    }
  }

  //重命名
  if (e.target.classList.contains('file-rename')) {


    var fileRenameText = e.target.parentNode.parentNode.lastElementChild;

    var fileName = fileRenameText.previousElementSibling;

    // 未重命名的文件名
    var originFileName = fileRenameText.value;

    fileName.style.display = 'none';
    fileRenameText.style.display = 'block';
    fileRenameText.focus();

    var clickRenameFileId = e.target.parentNode.parentNode.dataset.id * 1;

    var isRename;

    //键盘确认
    fileRenameText.onkeydown = function(e) {

      var e = event || window.event || arguments.callee.caller.arguments[0];

      if (e && e.keyCode == 13) { // enter 键
        isRename = rename(fileName, this, 'rename-file', originFileName, clickRenameFileId);
        if (isRename === 'success') init();
      }
    }

    fileRenameText.addEventListener('blur', function() {
      if (this.style.display === 'none') {
        return;
      } else {
        isRename = rename(fileName, this, 'rename-file', originFileName, clickRenameFileId);
        if (isRename === 'success') init();
      }
    })
  }

  //进入文件夹
  if (e.target.classList.contains('file-img')) {

    clickFileId = e.target.parentNode.dataset.id * 1;

    clickToFile(clickFileId);

  }
}

/**
 * [clickToFile 进入文件夹]
 * @param  {[string]} dataId [当前点击的，即将进入的文件夹的id]
 * @return {[type]}        [description]
 */
function clickToFile(dataId) {
  dataId = dataId * 1;
  currentData = getItemDataById(data, dataId).children;

  var str = ``;

  var arrAncestor = getAllParentById(data, dataId);

  subDataId = arrAncestor[0].id;
  //当前页面显示数据的父级pId
  if (!arrAncestor[1]) {
    currentDataId = 0;
  } else {
    currentDataId = arrAncestor[1].id;
  }
  console.log(currentDataId);
  str = `<a class="to-parent" href="javascript:;" data-id="${currentDataId}">Previous</a> 
           <span>|</span>`;

  //生成目录栏
  for (var i = arrAncestor.length - 2; i >= 0; i--) {
    str += `<a class="${arrAncestor[i].name}" href="javascript:;" data-id="${arrAncestor[i].id}">${arrAncestor[i].name}</a>`;

    if (i) str += `<span>></span>`;
  }

  catalog.innerHTML = str;

  init();
}



/*
 * 功能区：功能按钮栏
 */



/*
 * 功能栏：创建文件夹
 */
createFile.addEventListener('click', function() {

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

  fileRenameText.addEventListener('blur', setName);
  fileRenameText.onkeydown = function(e) {
    if (e.keyCode === 13) {
      console.log(1);
      setName();
    }
  }



  function setName() {
    var isCreate = rename(fileInfo, fileRenameText, 'create-file');

    var newFileData = {
      name: fileRenameText.value,
      id: ++user_data.maxId,
      pId: subDataId,
      children: [],
    };
    switch (isCreate) {
      case 'cancel':
        wrapFile.removeChild(wrapFile.firstElementChild);
        break;
      case 'repeat':
        console.log('repeat')
        break;
      case 'success':
        currentData.unshift(newFileData);
        init();
        break;
    }
  }
})



/*
 * 功能栏：删除文件夹
 */
// deleteFile.addEventListener('click',function() {
//   for (var i = 0; i < currentData.length; i++) {
//     if (currentData[i].checked) {
//       currentData.splice(i, 1);
//       i--;
//     }
//   }
//   wrapFile.innerHTML = createFileHtml(currentData);
//   addFileEvent();
// })



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
 * [notificationShow 消息窗弹出]
 * @param  {[string]} message [弹窗显示的内容]
 * @return {[undefined]}         [undefined]
 */
var timerNotice;

function notificationShow(message) {
  clearTimeout(timerNotice);

  var notice = tool.$('.notification');

  notice.firstElementChild.innerHTML = message;

  notice.lastElementChild.addEventListener('click', function() {
    tool.css(notice, 'top', -100);
    clearTimeout(timerNotice);
  })

  tool.animate(notice, {
    top: 20,
  }, 300, 'easeBothStrong', function() {
    timerNotice = setTimeout(function() {
      tool.css(notice, 'top', -100);
    }, 2800)
  });
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

      notificationShow('你输入的文件名已经有了！');

      nameInput.focus();
      return 'repeat';
    }


  }

  if (approch === 'rename-file') {
    if (!nameInput.value || !nameInput.value.trim()) {
      nameInput.value = nameOrigin;
    }
    if (nameCanUse(nameInput.value, clickFileId)) {
      notificationShow('你输入的文件名已经有了！');
      nameInput.focus();
      return;
    }
    getItemDataById(data, clickFileId).name = nameInput.value;
  }

  if (nameInput.value.length >= 12) {
    notificationShow('你输入的文件名太长啦！');
    nameInput.focus();
    return;
  }

  nameShow.innerHTML = nameInput.value;
  nameInput.style.display = 'none';
  nameShow.style.display = 'block';

  if (nameOrigin && nameInput.value === nameOrigin) return;
  if (approch === 'rename-file') notificationShow('已成功重命名！');

  return 'success';
}