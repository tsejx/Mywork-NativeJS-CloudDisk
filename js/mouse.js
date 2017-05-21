/*
 * 页面文件内容框右键菜单
 */ 

//云盘内容区
var container = xjx.$('.container');

// 文件夹根目录
var wrapFile = document.getElementById('file-container');

//右键菜单
var menu = xjx.$('.menu');

container.oncontextmenu = function(e) {
  e.preventDefault();

  var x = e.pageX,
    y = e.pageY;

  var disX = window.innerWidth - x,
    disY = window.innerHeight - y;

  menu.style.display = 'block';

  if (disX > menu.offsetWidth) {
    xjx.css(menu, 'left', x);
  } else {
    xjx.css(menu, 'left', window.innerWidth - menu.offsetWidth);
  }

  if (disY > menu.offsetHeight) {
    xjx.css(menu, 'top', y);
  } else {
    xjx.css(menu, 'top', window.innerHeight - menu.offsetHeight);
  }
}

window.addEventListener('click',function(){
  menu.style.display = 'none';
})



// 二级列表
var menuExtend = xjx.$('.menu_extend');






