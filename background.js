var a = document.querySelector('#background');
a.width = 1280;
a.height = 800;
var b = a.getContext('2d');
function c(){
	this.x = Math.random()*a.width*2;
	this.y = Math.random()*600;
	this.velX = Math.random()/10;
	this.show = function(a){
		b.fillStyle = 'white';
		b.fillRect(this.x - 32 - a/7.5, this.y - 24, 64, 48);
		this.x += this.velX;
		if(this.x < -66) {
			this.x = 1340;
		}
		if(this.x > 1340) {
			this.x = -66
		}
	};
};
var d = [];
for(var i = 0; i < 29; i++) {
	d.push(new c);
};
function e(){
	b.fillStyle = '#3BF';
	b.fillRect(0, 0, 1280, 800);
	b.fillStyle = '#EC0';
	b.fillRect(0, 0, 128, 112)
	b.save();
	b.translate(64, 56);
	b.rotate(Math.PI/4);
	b.fillRect(-80, -72, 140, 128);
	b.restore();
	for(var i of d) i.show(game.char.position.x/5);
};
var f = setInterval(e, 5);