// -------------------------- 页眉相关事件 --------------------------
header.addEventListener('click', function(e) {
  var target = e.target,
    targetCls = target.classList;
  if (targetCls.contains('logo')) {
    location.reload();
  }

  if (targetCls.contains('write-off')) {
    question('你确定要退出云盘吗？', true)
    feedback(function(){window.location.href = 'index.html';});
  }
})

header.addEventListener('mouseover',function(e){
  var userPage = tool.$('.user-page');
  if (e.target.classList.contains('user')) {
    tool.css(userPage,{display:'block',opacity:1});
  }
})

header.addEventListener('mouseout',function(e){
  var userPage = tool.$('.user-page');
  if (e.target.classList.contains('user')) {
    tool.css(userPage,{display:'none',opacity:0});
  }
})

// -----------------------------------------------------------------------------------------------
//侧边栏的相关事件
wrapSideBar.addEventListener('click',function(e){
  if (e.target.nodeName === 'LI') {
    fileTypeSelect(e.target);
  }
})

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
    changeCheckedbox(fileGrandparent, target, dataChecked, onOff);
    eventAllChecked();
  }

  //重命名功能--------------------------------------------------------
  if (targetCls.contains('file-rename')) {
    fileRename(fileId,fileGrandparent);
  }

  //删除文件功能----------------------------------------------------------
  if (targetCls.contains('file-delete')) {
    fileDeleteUnchecked(fileId);
  }

  //进入文件夹----------------------------------------------------------
  if (targetCls.contains('file-img')) {
    fileId = target.parentNode.dataset.id * 1;
    var fileType = getItemDataById(currentData,fileId).type;
    if ( fileType === 'folder') {
      fileClick(fileId);
    }
    if (fileType === 'image') {
      fileImage(fileId);
    }
  }

  //点击文件名重命名------------------------------------------------------
  if (targetCls.contains('file-info')) {
    var timerRename = setTimeout(function(){
      fileRename(target.parentNode.dataset.id*1,target.parentNode);
    },400);
  }
});

// -------------------------------------------------------------------------------------------------------
//功能按键面板的相关事件
wrapFeature.addEventListener('click', function(e) {
  var target = e.target,
    targetCls = target.classList;
  //上传功能---------------------------------------------------------
  if (targetCls.contains('upload')) {
    notification('上传功能正在紧张开发中', 'error');
  }

  //创建文件夹-------------------------------------------------------
  if (targetCls.contains('new-file')) {
    // 创建节点 ==> 放入文件内容区 ==> 重命名流程
    fileCreate();
  }

  //下载文件-----------------------------------------------------------------
  if (targetCls.contains('download')) {
    notification('下载功能正在紧张开发中', 'error');
  }

  //移动文件------------------------------------------------------------------
  if (targetCls.contains('shift-file')) {
    fileShift();
  }

  //删除文件夹------------------------------------------------------------------
  if (targetCls.contains('delete-file')) {

    if (!isFileChecked()) {
      notification('您未选中文件！', 'worry');
      return;
    }
    question('您要删除选中的文件吗？', true);

    feedback(fileDeleteChecked);
  }

  //分享文件夹----------------------------------------------------------------
  if (targetCls.contains('share')) {
    if (!isFileChecked()) {
      notification('您未选中文件！', 'worry');
      return;
    }
    fileShare();
  }

  //--- 功能按键面板---
  //搜索栏------------------------------------------------------------------
  if (targetCls.contains('search-click')) {
    search();
  }

  //排序方式-----------------------------------------------------------------
  if (targetCls.contains('btn-sort')) {
    targetCls.contains('time-sort') ? eventSort(targetCls,true):eventSort(targetCls,false);
  }

  //查看方式-------------------------------------------------------------------
  if (targetCls.contains('btn-view')) {
    targetCls.contains('tabular-form') ? eventView(targetCls, true) : eventView(targetCls, false);
  }
});

//全选功能
allChecked.addEventListener('click', function() {

  if (!currentData.length) {
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

//目录树的相关事件-------------------------------------------
wrapActiveWindow.addEventListener('click', function(e) {
  var catalog = tool.$('.catalog'),
    target = e.target,
    targetId = target.dataset.id * 1,
    targetType = target.dataset.type;

  if (targetId === 0) {
    currentData = getItemDataById(data, 0).children;
    eventFileExist();
    catalog.innerHTML = 'Root';
  }

  if (target.nodeName === 'A' && targetId >= 0) {
    if (targetType === 'folder') {
      fileClick(targetId);
      }else{
        notification('非文件夹类型无法打开','error');
      }
  }

  if (target.nodeName === 'SPAN') {
    if (target.parentNode.lastElementChild.children[0]) {
      if (target.classList.toggle('close')) {
        target.parentNode.lastElementChild.style.display = 'none';
      } else {
        target.parentNode.lastElementChild.style.display = '';
      }
    } else {
      target.style.background = 'none';
    }
  }
})

//侧边栏的树状目录的动画效果----------------------------

var timerTree;

wrapActiveWindow.addEventListener('mouseenter', function(e) {

  cancelAnimationFrame(timerTree);
  timerTree = tool.animate(wrapActiveWindow, {
    left: 0
  }, 300);

})

wrapActiveWindow.addEventListener('mouseleave', function(e) {
  cancelAnimationFrame(timerTree);
  timerTree = tool.animate(wrapActiveWindow, {
    left: -239
  }, 300);
})


