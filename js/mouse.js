//////////////////-----------  鼠标事件 ----------------///////////////

wrapFiles.addEventListener('contextmenu', contextMenu);

wrapFiles.addEventListener('mousedown', mouseDraw);

var timerShowSubMenu, timerHideSubMenu;

//右键菜单函数
function contextMenu(e) {

  e.preventDefault();

  var menu = tool.$('.menu'),
  dataId;

  dataId = isFileChecked() || isMouseInFile(e.pageX, e.pageY) ? 1:0;

  createContextMenu(e, dataId);

  //右键菜单选项的相关事件------------------------
  !!dataId ? eventFileMenu(menu):eventWrapMenu(menu);
  
  //点击window隐藏右键菜单
  window.addEventListener('mousedown', function(e) {
    if (isMouseInEle(e.pageX, e.pageY, menu)) return;
    var arrSubMenu = tool.$('.sub-menu',menu);
    for (var i = 0; i < arrSubMenu.length; i++) {
      if (isMouseInEle(e.pageX,e.pageY,arrSubMenu[i])) return;
    }
    hiddenContextMenu(menu);
  })
}

//鼠标画框函数
function mouseDraw(e) {
  // e.preventDefault();
  if (isRename()) return;
  
  // 按下的时候的横纵坐标
  var startX = e.pageX,
    startY = e.pageY;

  if (isMouseInFile(startX, startY)) return;

  // 创建一个画框的div
  var div = document.createElement('div');
  div.style.position = 'absolute';
  div.style.left = '-9999px';
  div.style.top = '-9999px';
  div.style.width = div.style.height = 0;
  div.style.border = '1px dashed rgba(47, 117, 245, 1.0)';
  div.style.backgroundColor = 'rgba(47, 117, 245, .3)';
  div.style.cursor = 'default';

  wrapFiles.appendChild(div);

  document.addEventListener('mousemove', mouseMove);

  document.addEventListener('mouseup', mouseUp);

  function mouseMove(e) {
    div.addEventListener('mousemove', function(e) {
      e.preventDefault();
      // e.stopPropagation();
    })

    var currentX = e.pageX,
      currentY = e.pageY;

    div.style.width = Math.abs(currentX - startX) + 'px';
    div.style.height = Math.abs(currentY - startY) + 'px';
    div.style.left = Math.min(currentX, startX) + 'px';
    div.style.top = Math.min(currentY, startY) + 'px';

    //如果超出文件容器，位置值要保持不变，画框不超出容器
    if (currentX <= wrapFiles.offsetLeft) {
      div.style.left = wrapFiles.offsetLeft + 'px';
      div.style.width = Math.abs(wrapFiles.offsetLeft - startX) + 'px';
    };

    if (currentY <= wrapFiles.offsetTop) {
      div.style.top = wrapFiles.offsetTop + 'px';
      div.style.height = Math.abs(wrapFiles.offsetTop - startY) + 'px';
    };

    var arrCheckedBox = document.querySelectorAll('.file-checkbox');

    for (var i = 0; i < arrFile.length - 1; i++) {

      changeCheckedbox(arrFile[i], arrCheckedBox[i], currentData[i], isCollide(div, arrFile[i]));
    }
    eventAllChecked();
  };

  function mouseUp() {
    document.removeEventListener('mouseup', mouseUp);
    document.removeEventListener('mousemove', mouseMove);

    wrapFiles.addEventListener('click', cancelChecked);
    
    wrapFiles.removeChild(div);
    
    
    function cancelChecked(e) {
      if (isMouseInFile(e.pageX, e.pageY)) return;
      if (!isFileChecked()) return;
      if (isRename()) return;

      var arrCheckedBox = tool.$('.file-checkbox');
      for (var i = 0; i < arrFile.length; i++) {
        changeCheckedbox(arrFile[i], arrCheckedBox[i], currentData[i], false);
      }
      eventAllChecked();
      window.removeEventListener('click', cancelChecked);
    }
  };
};

//检测两个元素是否碰撞
function isCollide(current, target) {
  var currentRect = current.getBoundingClientRect(),
    targetRect = target.getBoundingClientRect();

  // 拿到当前拖拽元素四个边距离文档左侧和上侧的绝对距离
  var currentL = currentRect.left,
    currentT = currentRect.top,
    currentR = currentRect.right,
    currentB = currentRect.bottom;

  var targetL = targetRect.left,
    targetT = targetRect.top,
    targetR = targetRect.right,
    targetB = targetRect.bottom;

  return currentR >= targetL && currentB >= targetT && currentL <= targetR && currentT <= targetB;
}

//检测鼠标按下时的起点是否在文件范围内
function isMouseInFile(mouseX, mouseY) {
  var eleTop, eleRight, eleBottom, eleLeft;
  for (var i = 0; i < arrFile.length; i++) {
    eleTop = arrFile[i].getBoundingClientRect().top,
      eleRight = arrFile[i].getBoundingClientRect().right,
      eleBottom = arrFile[i].getBoundingClientRect().bottom,
      eleLeft = arrFile[i].getBoundingClientRect().left;

    if (mouseX >= eleLeft && mouseX <= eleRight && mouseY >= eleTop && mouseY <= eleBottom) {
      return true;
    };
  }
  return false;
}

//检测鼠标是否在元素上
function isMouseInEle(mouseX, mouseY, ele) {
  var eleRect = ele.getBoundingClientRect();

  var eleTop = eleRect.top,
    eleRight = eleRect.right,
    eleBottom = eleRect.bottom,
    eleLeft = eleRect.left;

  return mouseX >= eleLeft && mouseX <= eleRight && mouseY >= eleTop && mouseY <= eleBottom;
}

//生成右键菜单
function createContextMenu(e, dataId) {

  var menu = tool.$('.menu');

  menu.innerHTML = createContextMenuHtml(dataContextMenu[dataId].data);

  var x = e.pageX,
    y = e.pageY;

  var disX = window.innerWidth - x,
    disY = window.innerHeight - y;

  menu.style.display = 'block';

  //主菜单位置
  if (disX > menu.offsetWidth) {
    tool.css(menu, 'left', x);
  } else {
    tool.css(menu, 'left', window.innerWidth - menu.offsetWidth);
  }

  if (disY > menu.offsetHeight) {
    tool.css(menu, 'top', y);
  } else {
    tool.css(menu, 'top', window.innerHeight - menu.offsetHeight);
  }
}


function setSubMenuPosition(parentMenu, parentMenuItem, subMenu) {
  var parentRight = window.innerWidth - parentMenu.offsetLeft - parentMenu.offsetWidth,
    parentBottom = window.innerHeight - parentMenu.offsetTop - parentMenu.offsetHeight,
    subWidth = subMenu.offsetWidth,
    subHeight = subMenu.offsetHeight;

  //右边放得下子菜单的情况
  if (parentRight > subWidth) {
    tool.css(subMenu, {
      left: 132
    });
  }

  //右边放不下子菜单的情况
  if (parentRight <= subWidth) {
    tool.css(subMenu, {
      left: -152
    });
  }

  //下边放得下子菜单的情况
  if (parentBottom > subHeight) {
    tool.css(subMenu, {
      top: -14
    });
  }

  //下边放不下子菜单的情况
  if (parentBottom <= subHeight) {
    tool.css(subMenu, {
      top: -subHeight - 14
    });
  }
}

function createContextMenuHtml(data) {
  var str = '';
  for (var i = 0; i < data.length; i++) {
    str += `<li class="${data[i].classname}"><a href="javascript:;">${data[i].name}</a>`;
    if (data[i].children) {
      str += `<ul class="sub-menu ${data[i].childname}">
            ` + createContextMenuHtml(data[i].children) + `
          </ul>`;
    }
    str += `</li>`
  }
  return str;
}


//右键菜单（文档内容区相关操作）
function eventWrapMenu(menu,arrSubMenu) {
  //右键菜单选项的点击事件-----------------------------------------------------
  menu.addEventListener('click', function(e) {
    if (!e.target.parentNode || !e.target.parentNode.parentNode) return;
    var targetCls = e.target.classList,
      targetParentCls = e.target.parentNode.classList;

    if (targetCls.contains('reload') || targetParentCls.contains('reload')) {
      location.reload();
      return;
    };

    if (targetCls.contains('file-create') || targetParentCls.contains('file-create')) {
      hiddenContextMenu(menu);
      fileCreate(); 
      return;
    }

    var btnViewCls = tool.$('.btn-view').classList;

    if (targetCls.contains('preview-way') || targetParentCls.contains('preview-way')) {
      eventView(btnViewCls, false);
      hiddenContextMenu(menu);
      return;
    }

    if (targetCls.contains('list-way') || targetParentCls.contains('list-way')) {
      eventView(btnViewCls, true);
      hiddenContextMenu(menu);
      return;
    }
    
    if (targetCls.contains('sort-way') ) {
      notification('相关功能仍在紧张开发中，敬请期待','error');
    }

    if (targetCls.contains('file-paste') || targetParentCls.contains('file-paste')) {
      if (!clipBoard[0]) {
        notification('未复制文件','error');
        hiddenContextMenu(menu);
        return;
      }
      filePaste();
      hiddenContextMenu(menu);
    }

  })

  //右键菜单的移动事件----------------------------------------------------------
  menu.addEventListener('mouseover', function(e) {
    var target = e.target,
      targetCls = target.classList;
    if (targetCls.contains('parent-menu')) {
      setSubMenuPosition(menu, target, target.lastElementChild);
      showSubMenu(target.lastElementChild);
    }
    if (targetCls.contains('sub-menu')) {
      clearTimeout(timerHideSubMenu);
    }
    if (target.nodeName === 'A') {
      if (target.parentNode.classList.contains('parent-menu')) {
        showSubMenu(target.parentNode.lastElementChild);
      }
      if (target.parentNode.classList.contains('sub-menu')) {
        clearTimeout(timerHideSubMenu);
      }
    }
  });

  (function eventSubMenu() {
    var arrParentMenu = tool.$('.parent-menu',menu),
    arrSubMenu = tool.$('.sub-menu',menu);
    for (var i = 0; i < arrParentMenu.length; i++) {
      arrParentMenu[i].addEventListener('mouseleave', function(e) {
        hiddenSubMenu(e.target.lastElementChild);
      });
      arrSubMenu[i].addEventListener('mouseleave', function(e) {
        hiddenSubMenu(e.target);
      });
    }
  })();
}

// 右键菜单（文件相关操作）
function eventFileMenu(menu){
  menu.addEventListener('mousedown',function(e){
    var target = e.target,targetCls = target.classList;
    if (!target.parentNode) return;
    if (targetCls.contains('file-open') || target.parentNode.classList.contains('file-open')) {
      fileClick(arrChecked[0].id);
      hiddenContextMenu(menu);
      return;
    }

    if (targetCls.contains('file-move') || target.parentNode.classList.contains('file-move')) {
      fileShift();
      hiddenContextMenu(menu);
      return;
    }

    if (targetCls.contains('file-copy') || target.parentNode.classList.contains('file-copy')) {
      fileCopy();
      hiddenContextMenu(menu);
      return;
    }

    if (targetCls.contains('file-cut') || target.parentNode.classList.contains('file-cut')) {
      fileCut();
      hiddenContextMenu(menu);
      return;
    }

  })
}




//显示右键菜单子菜单
function showSubMenu(submenu) {
  clearTimeout(timerHideSubMenu);
  timerShowSubMenu = setTimeout(function() {
    submenu.style.opacity = '1';
  }, 400)
}

// 隐藏右键菜单子菜单
function hiddenSubMenu(submenu) {
  clearTimeout(timerShowSubMenu);
  timerHideSubMenu = setTimeout(function() {
    submenu.style.opacity = '';
  }, 600)
  tool.css(submenu, {
    left: 9999,
    top: 9999
  });
}

//隐藏右键菜单
function hiddenContextMenu(menu) {
  menu.innerHTML = '';
  tool.css(menu, {
    top: 9999,
    left: 9999
  });
}