/*
 * 页面文件内容框右键菜单
 */

//云盘内容区
var container = tool.$('.container');

// 文件夹根目录
var wrapFiles = document.getElementById('file-container');

//右键菜单
var menu = tool.$('.menu');

container.oncontextmenu = function(e) {
  e.preventDefault();

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
}

window.addEventListener('click', function() {
  menu.style.display = 'none';
})



// 二级列表
var menuExtend = tool.$('.menu_extend');

//鼠标画框
wrapFiles.onmousedown = function(e) {
  // e.preventDefault();

  // 按下的时候的横纵坐标
  var startX = e.pageX,
    startY = e.pageY;

  for (var i = 0; i < arrFile.length; i++) {
    if (isMouseIn(startX, startY, arrFile[i])) {
      return;
    };
  }

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

      eventAllChecked();
    }

  };

  document.addEventListener('mouseup', mouseUp);

  function mouseUp() {

    document.removeEventListener('mouseup', mouseUp);

    document.removeEventListener('mousemove', mouseMove);

    wrapFiles.removeChild(div);
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

//检测鼠标按下时的起点是否在某元素内
function isMouseIn(mouseX, mouseY, ele) {
  var eleRect = ele.getBoundingClientRect();

  var eleTop = eleRect.top,
    eleRight = eleRect.right,
    eleBottom = eleRect.bottom,
    eleLeft = eleRect.left;


  return mouseX >= eleLeft && mouseX <= eleRight && mouseY >= eleTop && mouseY <= eleBottom;
}