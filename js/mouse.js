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



//鼠标画框
wrapFile.onmousedown = function (e){
  e.preventDefault();
  
  // 按下的时候的横纵坐标
  var startX = e.pageX, startY = e.pageY;
  
  // 创建一个画框的div
  var div = document.createElement('div');
  div.style.position = 'absolute';
  div.style.left = '-9999px';
  div.style.top = '-9999px';
  div.style.width = div.style.height = 0;
  div.style.border = '1px dashed rgba(47, 117, 245, 1.0)';
  div.style.backgroundColor = 'rgba(47, 117, 245, .3)';
  
  wrapFile.appendChild(div);
  


  document.onmousemove = function (e){
    var currentX = e.pageX, currentY = e.pageY;
    
    div.style.width = Math.abs(currentX - startX) + 'px';
    div.style.height = Math.abs(currentY - startY) + 'px';
    div.style.left = Math.min(currentX, startX) + 'px'; 
    div.style.top = Math.min(currentY, startY) + 'px';

    //如果超出文件容器，位置值要保持不变，画框不超出容器

    // console.log(currentY,wrapFile.offsetTop);
    if (currentX <= wrapFile.offsetLeft) { 
      div.style.left = wrapFile.offsetLeft + 'px';
      div.style.width = Math.abs( wrapFile.offsetLeft - startX) + 'px';
    };

    if (currentY <= wrapFile.offsetTop) { 
      div.style.top = wrapFile.offsetTop + 'px';
      div.style.height = Math.abs( wrapFile.offsetTop - startY) + 'px';
    };
    
    var arrData = Array.from(currentData);

    //div与文件 绝对位置 为文件添加active样式 
    //对应文件数据也要添加(onmouseup)
    //1文件样式 2勾选框选中 3文件移出事件取消
    for (var i = 0; i < arrFile.length; i++) {
      if (isCollide(div,arrFile[i])) {
        arrFile[i].classList.add('active');
        arrFile[i].onmouseleave = null;
        arrData[i].checked = true;
      }else{
        arrFile[i].classList.remove('active');
        arrFile[i].onmouseleave = function() {
            var itemPanel = tool.$('.file-panel', this);
            itemPanel.style.display = '';
        }
        console.log(arrData);
        arrData[i].checked = false;
      }
    }
  };

  document.onmouseup = function (){
    document.onmouseup = document.onmousemove = null;
    wrapFile.removeChild(div);
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



