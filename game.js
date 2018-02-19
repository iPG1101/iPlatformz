var movingCamera = true;
(function init () {
	function Game(){
		this.entities = [];
		this.platforms = [];
		this.signs = [];
		this.levels = new Array(6);
		this.char = new Character();
		for(var i = 0; i < this.levels.length; i++) {
			try{
				this.levels[i] = _import('levels/level'+i+'.json');
			}catch(e){
				//Who cares right?
			}
			//I know this is bad practice, will fix soon
			//TODO: FIX SOON
		}
		this.canvas = document.createElement('canvas');
		this.context = this.canvas.getContext('2d');
		this.canvas.width = 1280;
		this.canvas.height = 800;
		this.canvas.style.width = '100%';
		this.canvas.style.height = '100%';
		this.canvas.style.position = 'absolute';
		this.canvas.style.left = this.canvas.style.right = 0;
		document.body.style.overflow = 'hidden';
		this.log = function(message){
			console.log(`[${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}] ${message}`);
		};
		this.loadLevel = function(id){
			function plat(inf){
				this.x = inf[0];
				this.y = inf[1];
				this.w = inf[2];
				this.h = inf[3];
				this.c = inf[4];
				this.check = function(pos, w, h){
					if(this.x + this.w - w/2 > pos.x && this.x - w*0.75 < pos.x) {
						if(this.y < pos.y + pos.velocityY + h/2) {
							pos.onFloor = true;
							pos.velocityY = 0;
						}
						else pos.onFloor = false;
					}
				};
				this.show = function(context){
					context.fillStyle = this.c;
					if(!movingCamera) context.fillRect(this.x,this.y,this.w,this.h);
					if(movingCamera) context.fillRect(this.x-game.char.position.x+640,this.y,this.w,this.h);
				};
			};
			function sign(inf){
				this.x = inf.position[0];
				this.y = inf.position[1];
				this.w = inf.size[0];
				this.h = inf.size[1];
				this.c = inf.colour[0];
				this.tc = inf.colour[1];
				this.fs = inf['font-size'];
				this.text = inf.text;
				this.stands = 'stands' in inf ? inf.stands : [];
				this.check = function(pos, w, h){
					if(this.x + this.w - w*0.75 > pos.x && this.x - w*0.75 < pos.x) {
						if(this.y < pos.y + pos.velocityY + h/2) {
							pos.onFloor = true;
							pos.velocityY = 0;
						}
						else pos.onFloor = false;
					}
				};
				this.show = function(context){
					context.fillStyle = this.c;
					if(!movingCamera) context.fillRect(this.x,this.y,this.w,this.h);
					if(movingCamera) context.fillRect(this.x-game.char.position.x+640,this.y,this.w,this.h);
					context.fillStyle = this.tc;
					context.font = this.fs + " Ariel"
					context.fillText(this.text.split('\n')[0], this.x-game.char.position.x+640+20, this.y+32);
					for(var i = 1; i < this.text.split('\n').length; i++) 
						context.fillText(this.text.split('\n')[i], this.x-game.char.position.x+640+20, this.y+40+32*i);
					for(var s of this.stands) {
						context.fillStyle=s[4];
						context.fillRect(s[0]-game.char.position.x+640, s[1], s[2], s[3]);
					};
				};
			}
			for(var i in this.levels[id].platforms) {
				this.platforms.push(new plat(this.levels[id].platforms[i]))
			}
			for(var i in this.levels[id].signs) {
				this.signs.push(new sign(this.levels[id].signs[i]))
			}
		};
		this.frame = function(){
			var bg = document.querySelector('#background');
			if(bg.width != this.canvas.width || bg.height != this.canvas.height) {
				this.log('Scaling background image to 1280x800 is required, this may help cause lag later on in the game');
			}
			this.context.drawImage(bg, 0, 0, 1280, 800);
			for(var plat of this.platforms) {
				plat.show(this.context);
			};
			for(var sign of this.signs) {
				sign.show(this.context);
			};
			this.char.show(this.context).update(this.platforms);
		};
		this.start = function GameStarter(){
			this.log('Appending \`canvas\` tag to \`body\`');
			document.body.appendChild(this.canvas);
			setInterval(this.frame.bind(this), 30);
			this.loadLevel(0);
		};
	};
	window.game = new Game;
	startInitialization();
})()

function startInitialization(){
	game.start();
};
