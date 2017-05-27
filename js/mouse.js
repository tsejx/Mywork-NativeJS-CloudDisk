
//////////////////-----------  鼠标事件 ----------------///////////////

wrapFiles.addEventListener('contextmenu',contextMenu);

wrapFiles.addEventListener('mousedown',mouseDraw);

var showTimer,hideTimer;

//右键菜单函数
function contextMenu(e) {

  e.preventDefault();

  var menu = tool.$('.menu');

  createContextMenu(e);

  //点击window隐藏右键菜单
  window.addEventListener('click', function() {
    menu.style.display = 'none';
  })

  //右键菜单选项的相关事件------------------------
  
  //右键菜单选项的点击事件-----------------------------------------------------
  menu.addEventListener('click',function(e){
    var target = e.target,
    targetCls = target.classList;

    if (targetCls.contains('reload')) {
      location.reload();
    };

    if (targetCls.contains('new-file')) {
      fileCreate();
    }
  })

  //右键菜单的移动事件----------------------------------------------------------
  var arrSubMenu = tool.$('.sub-menu');//子菜单数组
  var arrParentMenu = tool.$('.parent-menu');

  menu.addEventListener('mouseover',function(e){
    var target = e.target,targetCls = target.classList;
    if (targetCls.contains('parent-menu')) {
      setSubMenuPosition(menu,target,target.lastElementChild);
      showSubMenu(target.lastElementChild);
    }
    if (targetCls.contains('sub-menu')) {
      clearTimeout(hideTimer);
    }
    if (target.nodeName === 'A') {
      if (target.parentNode.classList.contains('parent-menu')) {
        showSubMenu(target.parentNode.lastElementChild);
      }
      if (target.parentNode.classList.contains('sub-menu')) {
        clearTimeout(hideTimer);
      }
    }
  });
  
  for (var i = 0; i < arrParentMenu.length; i++) {
    arrParentMenu[i].addEventListener('mouseleave',function(e){
      hiddenSubMenu(e.target.lastElementChild);
    });
    arrSubMenu[i].addEventListener('mouseleave',function(e){
      hiddenSubMenu(e.target);
    });
  }
   
  function showSubMenu(submenu) {
    clearTimeout(hideTimer);
    showTimer = setTimeout(function() {
      for (var i = 0; i < arrSubMenu.length; i++) {
        arrSubMenu[i].style.opacity = '';
      }
      submenu.style.opacity = '1';
    }, 400)
  }

  function hiddenSubMenu(submenu) {
    clearTimeout(showTimer);
    hideTimer = setTimeout(function() {
      submenu.style.opacity = '';
    }, 600)
    tool.css(submenu,{left:9999,top:9999,bottom:9999});
  }
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

    wrapFiles.removeChild(div);
    wrapFiles.addEventListener('click',cancelChecked);

    function cancelChecked(e){
      if (isMouseInFile(e.pageX, e.pageY)) return;
      if (!isFileChecked) return;
      var arrCheckedBox = tool.$('.file-checkbox')
      for (var i = 0; i < arrFile.length; i++) {
        changeCheckedbox(arrFile[i], arrCheckedBox[i], currentData[i], false);
      }
      eventAllChecked();
      window.removeEventListener('click',cancelChecked);
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
  var eleTop,eleRight,eleBottom,eleLeft;
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
function isMouseInEle(mouseX,mouseY,ele) {
  var eleRect = ele.getBoundingClientRect();

  var eleTop = eleRect.top,
    eleRight = eleRect.right,
    eleBottom = eleRect.bottom,
    eleLeft = eleRect.left;

    return mouseX >= eleLeft && mouseX <= eleRight && mouseY >= eleTop && mouseY <= eleBottom;
}

//生成右键菜单
function createContextMenu(e){
  
  var menu = tool.$('.menu');

  menu.innerHTML = createContextMenuHtml(dataContextMenu[0].data);

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


function setSubMenuPosition(parentMenu,parentMenuItem,subMenu){
  var parentRight = window.innerWidth - parentMenu.offsetLeft - parentMenu.offsetWidth,
  parentBottom = window.innerHeight - parentMenu.offsetTop - parentMenu.offsetHeight,
  subWidth = subMenu.offsetWidth,
  subHeight = subMenu.offsetHeight;

  //右边放得下子菜单的情况
  if (parentRight > subWidth) {
    tool.css(subMenu,{left:132});
  }

  //右边放不下子菜单的情况
  if (parentRight <= subWidth) {
    tool.css(subMenu,{left:-152});
  }

  //下边放得下子菜单的情况
  if (parentBottom > subHeight) {
    tool.css(subMenu,{top:-14});
  }

  //下边放不下子菜单的情况
  if (parentBottom <= subHeight) {
    tool.css(subMenu,{top:-subHeight-14});
  }
}

function createContextMenuHtml(data){
  var str = '';
  for (var i = 0; i < data.length; i++) {
    str += `<li class="${data[i].classname}"><a href="javascript:;">${data[i].name}</a>`;
    if (data[i].children) {
      str += `<ul class="sub-menu ${data[i].childname}">
            ` + createContextMenuHtml(data[i].children) +`
          </ul>`;
    }
    str += `</li>`
  }
  return str;
}

var dataContextMenu = [{
  menuname: 'document',
  data: [{
    name: '查看',
    id: 0,
    classname: 'parent-menu view-way',
    childname: 'view-menu',
    children: [{
      name: '缩略图布局',
      classname: 'preview-way'
    }, {
      name: '列表布局',
      classname: 'list-way'
    }]
  }, {
    name: '排序',
    id: 1,
    classname: 'parent-menu sort-way',
    childname: 'sort-menu',
    children: [{
      name: 　 '名称排序',
      classname: 'letter-way'
    }, {
      name: '大小排序',
      classname: 'size-way'
    }, {
      name: '时间排序',
      classname: 'time-way'
    }]
  }, {
    name: '新建文件夹',
    id : 2,
    classname: 'file-create'
  }, {
    name: '重新加载页面',
    id : 3,
    classname: 'reload'
  }]
}, {
  menuname: 'file',
  data: [{
    name: '打开',
    classname: 'file-open',
  }, {
    name: '复制',
    classname: 'file-copy',
  }, {
    name: '剪切',
    classname: 'file-cut',
  }, {
    name: '粘贴',
    classname: 'file-paste',
  }, {
    name: '移动到',
    classname: 'file-move',
  }, {
    name: '重命名',
    classname: 'file-rename',
  }]
}];