
//////////////////-----------  鼠标事件 ----------------///////////////

wrapFiles.addEventListener('contextmenu',contextMenu);

wrapFiles.addEventListener('mousedown',mouseDraw);

var showTimer,hideTimer;

//右键菜单函数
function contextMenu(e) {

  e.preventDefault();

  var menu = tool.$('.menu');

  var x = e.pageX,
    y = e.pageY;

  var disX = window.innerWidth - x,
    disY = window.innerHeight - y;

  menu.style.display = 'block';

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
      
    }

  })

  //右键菜单的移动事件----------------------------------------------------------
  var arrSubMenu = tool.$('.sub-menu');//子菜单数组

  menu.addEventListener('mouseover',function(e){

    if (e.target.classList.contains('parent-menu')) {
      var targetSubMenu = e.target.lastElementChild;
      clearTimeout(hideTimer);

      showTimer = setTimeout(function(){
        
        for (var i = 0; i < arrSubMenu.length; i++) {
          arrSubMenu[i].style.display = 'none';
        }
        
        targetSubMenu.style.display = 'block';

      },500)
    }
    
    if (e.target.classList.contains('sub-menu')) {
      e.target.style.display = 'block';
      clearTimeout(hideTimer);
    }
  
  });
  
  menu.addEventListener('mouseout',function(e){
    
    if (e.target.classList.contains('parent-menu')) {
      clearTimeout(showTimer);
      hideTimer = setTimeout(function() {
        for (var i = 0; i < arrSubMenu.length; i++) {
          arrSubMenu[i].style.display = 'none';
        }
      }, 800)
    }
  });

  menu.addEventListener('mousemove',function(e){
    if (e.target.classList.contains('sub-menu')) {
      e.target.style.display = 'block';
      clearTimeout(hideTimer);
    }
  })

  // -------------------------------------------------------------------------
  

  // for (var i = 0; i < arrSubMenu.length; i++) {
  //   arrSubMenu[i].addEventListener('mouseover', function(){

  //   });
  //   arrSubMenu[i].addEventListener('mouseout', function(){
  //     e.target.style.display = '';
  //   });
  // }

  //隐藏单个右键菜单的子菜单的函数
  // function subMenuHidden(e){
  //   if ( e.target.classList.contains('view-way')) {
  //     e.target.lastElementChild.style.display = '';
  //   }
  //   if ( e.target.classList.contains('sort-way')) {
  //     e.target.lastElementChild.style.display = '';
  //   }
  // }

  //显示单个右键菜单的子菜单函数
  // function subMenuShow(e){
  //   if ( e.target.classList.contains('view-way')) {
  //     e.target.lastElementChild.style.display = 'block';
  //   }
  //   if ( e.target.classList.contains('sort-way')) {
  //     e.target.lastElementChild.style.display = 'block';
  //   }
  // }

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

  document.addEventListener('mouseup', mouseUp);

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