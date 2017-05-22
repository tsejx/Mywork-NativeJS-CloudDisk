/*
 * 页面文件内容框右键菜单
 */ 

//云盘内容区
var container = tool.$('.container');

// 文件夹根目录
var wrapFile = document.getElementById('file-container');

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

window.addEventListener('click',function(){
  menu.style.display = 'none';
})



// 二级列表
var menuExtend = tool.$('.menu_extend');






