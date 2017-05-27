////////////////////////////////////////////
/////////////动画效果///////////////////////
////////////////////////////////////////////


//侧边栏的树状目录的动画效果----------------------------

var timerTree;

wrapSidebar.addEventListener('mouseenter', function(e) {

  cancelAnimationFrame(timerTree);
  timerTree = tool.animate(wrapSidebar, {
    left: 0
  }, 300);

})

wrapSidebar.addEventListener('mouseleave', function(e) {
  cancelAnimationFrame(timerTree);
  timerTree = tool.animate(wrapSidebar, {
    left: -239
  }, 300);
})