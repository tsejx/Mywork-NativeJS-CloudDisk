//文件夹根目录
var wrapFile = document.getElementById('file-container');
//文件夹根目录下的 子元素集合
var arrFile = wrapFile.children;

//新建文件夹(按钮)
var createFile = xjx.$('.new-file');
//删除文件夹（按钮）
var deleteFile = xjx.$('.delete-file');

//文件全选框
// var allIn = xjx.$('.all-in');

//根目录
var data = user_data.files;

var rootChildren = getItemDataById(data, 0).children;

//当前数据
var currentData = rootChildren;
//当前数据的Id
var currentDataId = 0;

var newFileNum = 2;

//目录栏
var catalog = xjx.$('.catalog');

var clickFileId = 0;

//初始化页面
wrapFile.innerHTML = createFileHtml(currentData);
addFileEvent();

//创建文件夹列表的HTML结构
function createFileHtml(data) {
  var str = ``,
    i, len = data.length;

  for (var i = 0; i < len; i++) {
    str += `<div class="file" data-id="${data[i].id}">
              <div class="file-panel">
                <span class="file-checkbox" data-id="${i}"></span>
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

    var itemPanel = xjx.$('.file-panel', item);
    item.onmouseover = function() {
      itemPanel.style.display = 'block';
    }

    item.onmouseout = function() {
      itemPanel.style.display = '';
    }
  });
}


//点击文件夹的选中框
wrapFile.onclick = function(e) {

  /*
   * 文件勾选
   */
  if (e.target.classList.contains('file-checkbox')) {
    var fileNode = e.target.parentNode.parentNode;
    e.target.classList.toggle('active');
    var id = e.target.dataset.id * 1;
    currentData[id].checked = fileNode.classList.toggle('active');
    if (currentData[id].checked) { //取消移出
      fileNode.onmouseout = null;
    } else { //增加移出
      fileNode.onmouseout = function() {
        var itemPanel = xjx.$('.file-panel', this);
        itemPanel.style.display = '';
      }
    }
  }

  /*
   * 重命名
   */
  if (e.target.classList.contains('file-rename')) {
    

    var fileRenameText = e.target.parentNode.parentNode.lastElementChild;

    var fileName = fileRenameText.previousElementSibling;

    fileName.style.display = 'none';
    fileRenameText.style.display = 'block';
    fileRenameText.focus();

    var clickRenameFileId = e.target.parentNode.parentNode.dataset.id * 1;
    
    
    //键盘确认
    fileRenameText.onkeydown = function() {

        var e = event || window.event || arguments.callee.caller.arguments[0];

        if (e && e.keyCode == 13) { // enter 键
          if (!this.value || !this.value.trim()) {
            alert('请输入内容');
            this.focus();
            return;
          }
          if (this.value.length > 12) {
            alert('你输入的文件名太长啦！');
            this.focus();
            return;
          }
          getItemDataById(data,clickRenameFileId).name = this.value;
          fileName.innerHTML = this.value;
          fileName.style.display = 'block';
          this.style.display = 'none';
        }
      }

  }

  /*
   * 进入文件夹
   */
  if (e.target.classList.contains('file-img') || e.target.classList.contains('file-info')) {

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

  //当前页面显示数据的父级pId
  if (!arrAncestor[1]) {
    currentDataId = 0;
  } else {
    currentDataId = arrAncestor[1].id;
  }

  str = `<a class="to-parent" href="javascript:;" data-id="${currentDataId}">Previous</a> 
           <span>|</span>`;

  //生成目录栏
  for (var i = arrAncestor.length - 2; i >= 0; i--) {
    str += `<a class="${arrAncestor[i].name}" href="javascript:;" data-id="${arrAncestor[i].id}">${arrAncestor[i].name}</a>`;

    if (i === 0) break;
    str += `<span>></span>`
  }

  catalog.innerHTML = str;

  wrapFile.innerHTML = createFileHtml(currentData);
  addFileEvent();
  catalogEvent();
}

/**
 * [catalogEvent 目录事件]
 * @return {[type]} [description]
 */
function catalogEvent() {
  var arrCatalog = xjx.$('a', catalog);
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

/*
 * 功能区：功能按钮栏
 */
var arrBtnFeature = xjx.$('.feature-panel span');

arrBtnFeature.forEach(function(item,i){
  item.index = i;
  item.onclick = function(){
    notificationShow(this.index);
  }
})

var timer;

/**
 * [notificationShow 消息窗弹出]
 * @return {[type]} [description]
 */
function notificationShow(message) {
  clearTimeout(timer);

  var notice = xjx.$('.notification');

  var noticeInfo = '';

  switch (message) {
    case 0:
      noticeInfo = '尚未开启上传功能';
      break;
    case 1:
      noticeInfo = '成功新建文件夹';
      break;
    case 2:
      noticeInfo = '尚未开启下载功能';
      break;
    case 3:
      noticeInfo = '尚未开启移动功能';
      break;
    case 4:
      noticeInfo = '成功删除文件';
      break;
    case 5:
      noticeInfo = '尚未开启分享功能';
      break;
  }


  notice.firstElementChild.innerHTML = noticeInfo;

  notice.lastElementChild.addEventListener('click', function() {
    xjx.css(notice, 'top', -100);
    clearTimeout(timer);
  })

  xjx.animate(notice, {
    top: 20,
  }, 300, 'easeBothStrong', function() {
    timer = setTimeout(function() {
      xjx.css(notice, 'top', -100);
    }, 2800)
  });
}

/*
 * 功能栏：创建文件夹
 */
createFile.addEventListener('click',function() {
  var newFileData = {
    name: 'New File(' + (newFileNum++) + ')',
    id: currentDataId * 10 + (newFileNum - 1),
    pId: clickFileId,
    children: [],
  };
  currentData.unshift(newFileData);
  wrapFile.innerHTML = createFileHtml(currentData);
  addFileEvent();
})

/*
 * 功能栏：删除文件夹
 */
deleteFile.addEventListener('click',function() {
  for (var i = 0; i < currentData.length; i++) {
    if (currentData[i].checked) {
      currentData.splice(i, 1);
      i--;
    }
  }
  wrapFile.innerHTML = createFileHtml(currentData);
  addFileEvent();
})

/*
 * 功能区：搜索栏
 */
var searchText = xjx.$('.search-text');

searchText.addEventListener('click',function(){
  if ( this.value === 'Search your files') {
    this.value = '';
  }
});

searchText.addEventListener('blur',function(){
  if (this.value === '') {
    this.value = 'Search your files';
  }
});

/*
 * 功能区：排序方式与查看方式
 */
var btnSort = xjx.$('.sort-by'),btnView = xjx.$('.to-view');

btnSort.addEventListener('click',function(){
  this.classList.toggle('initial-letter');
  this.classList.toggle('time-sort');
})

btnView.addEventListener('click',function(){
  this.classList.toggle('tabular-form');
  this.classList.toggle('preview-form');
})