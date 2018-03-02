var mobileUserAgents = new RegExp("(iPhone|iPod|iPad|HomePod|Android|Mobile|Touch)", "g");
var isMobile = (navigator.userAgent.match(mobileUserAgents));
if(isMobile) {
	var button_right = document.createElement('div');
	button_right.innerText = "D";
	button_right.style.left = '13%';
	button_right.style.width = '3%';
	button_right.style.height = '6%';
	button_right.style.bottom = '8%';
	button_right.style.padding = '2%';
	button_right.style.position = 'absolute';
	button_right.style.background = 'rgba(255,255,255,0.255)';
	button_right.style.borderRadius = '16px';
	document.body.appendChild(button_right);

	var button_left = document.createElement('div');
	button_left.innerText = "A";
	button_left.style.left = '2%';
	button_left.style.width = '3%';
	button_left.style.height = '6%';
	button_left.style.bottom = '8%';
	button_left.style.padding = '2%';
	button_left.style.position = 'absolute';
	button_left.style.background = 'rgba(255,255,255,0.255)';
	button_left.style.borderRadius = '16px';
	document.body.appendChild(button_left);

	var button_mount = document.createElement('div');
	button_mount.innerText = "Mount";
	button_mount.style.left = '2%';
	button_mount.style.width = '14%';
	button_mount.style.height = '4%';
	button_mount.style.bottom = '26%';
	button_mount.style.padding = '2%';
	button_mount.style.position = 'absolute';
	button_mount.style.background = 'rgba(255,255,255,0.255)';
	button_mount.style.borderRadius = '16px';
	document.body.appendChild(button_mount);

	var button_sprint = document.createElement('div');
	button_sprint.innerText = "Sprint";
	button_sprint.style.right = '4%';
	button_sprint.style.width = '14%';
	button_sprint.style.height = '4%';
	button_sprint.style.bottom = '26%';
	button_sprint.style.padding = '2%';
	button_sprint.style.position = 'absolute';
	button_sprint.style.background = 'rgba(255,255,255,0.255)';
	button_sprint.style.borderRadius = '16px';
	document.body.appendChild(button_sprint);

	var button_jump = document.createElement('div');
	button_jump.innerText = "Jump";
	button_jump.style.right = '4%';
	button_jump.style.width = '14%';
	button_jump.style.height = '4%';
	button_jump.style.bottom = '8%';
	button_jump.style.padding = '2%';
	button_jump.style.position = 'absolute';
	button_jump.style.background = 'rgba(255,255,255,0.255)';
	button_jump.style.borderRadius = '16px';
	document.body.appendChild(button_jump);


	button_sprint.ontouchstart = button_sprint.onmousedown = function(e){
		e.preventDefault();
		if(shift) shift=false;
		else if(game != undefined && !!game && 'char' in game && game.char.energy > 40) {
			shift = true;
		};
		function loop(){
			this.innerHTML = shift ? "Sprinting" : "Sprint";
		}//.bind(this);
		setInterval(loop.bind(this), 10);
	};
	button_mount.ontouchstart = button_mount.onmousedown = function(e){
		e.preventDefault();
		if(game != undefined && !!game && 'char' in game) {
			if(game.char.vehicle != false) {
				return game.char.vehicle.unmountPlayer();
			}
			for(var i of game.vehicles) {
				if(i.checkDistance(game.char)){
					i.mountPlayer();
					return;
				}
			}
		}
	};
	button_jump.ontouchstart = button_jump.onmousedown = function(e){
		e.preventDefault();
		if(game != undefined && !!game && 'char' in game && game.char.position.onFloor) {
			game.char.jump(shift?-12:-8);
		}
	};
	button_left.ontouchstart = button_left.onmousedown = function(e){
		e.preventDefault();
		if(game != undefined && !!game && 'char' in game) {
			game.char.position.velocityX = -5;
		}
	};
	button_right.ontouchstart = button_right.onmousedown = function(e){
		e.preventDefault();
		if(game != undefined && !!game && 'char' in game) {
			game.char.position.velocityX = +5;
		}
	};
	button_left.ontouchend = button_left.onmouseup = function(e){
		e.preventDefault();
		if(game != undefined && !!game && 'char' in game) {
			if(game.char.position.velocityX < 0) game.char.position.velocityX = 0;
		}
	};
	button_right.ontouchend = button_right.onmouseup = function(e){
		e.preventDefault();
		if(game != undefined && !!game && 'char' in game) {
			if(game.char.position.velocityX > 0) game.char.position.velocityX = 0;
		}
	};
} else {
	console.log("User is using a non-phone - Not initializing mobile controls");
};