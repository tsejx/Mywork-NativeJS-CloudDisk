
// -------------------------- 页眉相关事件 --------------------------
header.addEventListener('click', function(e) {
  var target = e.target,
    targetCls = target.classList;
  if (targetCls.contains('logo')) {
    location.reload();
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
    changeCheckedbox(fileGrandparent, target, dataChecked, onOff)
    eventAllChecked();
  }

  //重命名功能--------------------------------------------------------
  if (targetCls.contains('file-rename')) {
    fileRename(target, fileId);
  }

  //删除文件功能----------------------------------------------------------
  if (targetCls.contains('file-delete')) {
    fileDeleteSingle(fileId);
  }

  //进入文件夹----------------------------------------------------------
  if (targetCls.contains('file-img')) {
    fileId = target.parentNode.dataset.id * 1;
    fileClick(fileId);
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
    fileCreate();
  }

  //下载文件-----------------------------------------------------------------
  if (targetCls.contains('download')) {
    notification('尚未开启下载功能', 'error');
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
        question('', false);
      };
    })

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
    // targetCls.toggle('initial-letter');
    // targetCls.toggle('time-sort');
  }

  //查看方式-------------------------------------------------------------------
  if (targetCls.contains('btn-view')) {
    // notification('尚未开启查看方式转换功能', 'error');
    targetCls.contains('tabular-form')?eventView(targetCls, true):eventView(targetCls, false);
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
wrapSidebar.addEventListener('click', function(e) {
  var catalog = tool.$('.catalog'),
    target = e.target,
    targetId = target.dataset.id * 1;

  if (targetId === 0) {
    currentData = getItemDataById(data, 0).children;
    eventFileExist();
    catalog.innerHTML = 'Root';
  }

  if (target.nodeName === 'A' && targetId) {
    fileClick(targetId);
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


