var wrapLogin = tool.$('.wrap-login');

var login = tool.$('.sign-in');


wrapLogin.addEventListener('mousedown',wrapLoginMouseDown);



function wrapLoginMouseDown(e) {
if (e.target.classList.contains('input') || e.target.classList.contains('sign-in') || e.target.classList.contains('sign-up') ) return;


	// e.preventDefault();

	var x = e.pageX,
		y = e.pageY;

	var disX = x - this.offsetLeft,
		disY = y - this.offsetTop;


	document.addEventListener('mousemove', wrapLoginMouseMove);

	document.addEventListener('mouseup', wrapLoginMouseUp);

	function wrapLoginMouseMove(e) {

		var x = e.pageX,
			y = e.pageY;

		var L = x - disX,
			T = y - disY;

		if (L <= 0) L = 0;
		if (T <= 0) T = 0;

		if (L >= window.innerWidth - wrapLogin.offsetWidth)
			L = window.innerWidth - wrapLogin.offsetWidth;

		if (T >= window.innerHeight - wrapLogin.offsetHeight)
			T = window.innerHeight - wrapLogin.offsetHeight;

		wrapLogin.style.left = L + 'px';
		wrapLogin.style.top = T + 'px';
	}

	function wrapLoginMouseUp(e) {
		document.removeEventListener('mousemove', wrapLoginMouseMove);

		document.removeEventListener('mouseup', wrapLoginMouseUp);
	}

}

login.addEventListener('mousedown',enterCloudDisk);

function enterCloudDisk(){
	var loadBar = tool.$('.load-bar'),inner = tool.$('.load-bar-inner'),fly = tool.$('.fly');
	
  tool.animate(wrapLogin,{opacity:0},200,function(){
  	wrapLogin.style.display = 'none';
  	loadBar.style.display = 'block';
  	fly.style.display = 'block';
  	tool.animate(fly,{opacity:1},400);
  	tool.animate(loadBar,{opacity:1},400,function(){
			tool.animate(inner,{width:350},5000,function(){
				tool.animate(loadBar,{opacity:0},1000);
				fly.classList.remove('float');
				fly.classList.add('popup');
				setTimeout(function(){
					window.location.href = 'home.html';
				},2000);
			});
  	})
  });

}