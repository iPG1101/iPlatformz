function Character (pos = new Vector()) {
	this.vehicle=false;
	this.position = pos;
	this.texture = document.querySelector('#character');
	this.w = 64;
	this.h = 96;
	this.lr = 77;
	this.lrr = 3;
	this.energy = 100;
	this.direction = 1;
	this.jump = function(v){
		this.position.velocityY = v;
	};
	this.show = function(c){
		c.strokeRect(1056, 24, 204, 16);
		c.strokeRect(1056, 24, 80,  16);
		c.fillStyle = '#071';
		c.fillRect(1058, 26, this.energy*2,  12);
		// if(!!this.vehicle) return this;
		if(!movingCamera) c.drawImage(this.texture, this.position.x - this.w/2, this.position.y - this.h/2, this.w, this.h);
		if(movingCamera) c.drawImage(this.texture, 640, this.position.y - this.h/2, this.w, this.h);
		this.updateTexture();
		c.lineWidth = 4;
		return this;
	};
	this.update = function(platforms){
		this.direction = this.position.velocityX > 0 ? 1 : this.position.velocityX < 0 ? -1 : this.direction;
		this.xMulti = 1;
		if(shift && this.energy > 0) {
			this.xMulti = 1.7;
			if(this.position.velocityX != 0) this.energy -= 1.5;
		} else if (shift) {
			shift = false;
		}
		this.position.onFloor = false;
		for(var p of platforms) {
			p.check(this.position, this.w, this.h);
		}
		if(this.position.y > 1000) {
			this.position.y = 400;
			this.position.x = 640;
			this.position.velocityX = this.position.velocityY = 0;
		}
		this.energy += 0.420;
		this.position.update(this.xMulti, 1);
		if(this.energy >= 100) this.energy = 100;
	};
	this.updateTexture = function(){
		var body = {
		  'left_arm': [22, 21, 4, 18, '#294', [2.5, 10.5]],
		  'left_leg': [10, 37, 5, 13, '#036', [5, 18.5]],
		  'left_foot': [10, 50, 6.5, 5, '#221', [5, 18.5]],
		  'right_leg': [17, 37, 5, 13, '#036', [8.5, 18.5]],
		  'right_foot': [17, 50, 6.5, 5, '#221', [8.5, 18.5]],
		  'body': [10, 21, 12, 16, '#063'],
		  'right_arm': [7, 21, 4, 18, '#294', [2.5, 10.5]],
		  'head': [4, 4, 24, 17, '#DB6'],
		  'nose': [28, 12.5, 3, 2, '#DB6'],
		  'hat': [4, 4, 24, 5.5, '#F00'],
		  'hat2': [4, 9.5, 27, 0.5, '#F00'],
		}
// 		body = {
// 'left_back_leg': [3, 45, 2, 6, '#666', [4, 45]],
// 'right_back_leg': [8, 45, 2, 6, '#666', [7, 45]],
// 'left_front_leg2': [18, 45, 2, 6, '#666', [13, 45]],
// 'right_front_leg': [23, 45, 2, 6, '#666', [16, 45]],
// 'body': [2, 33, 22, 12, '#565656'],
// 'head': [17, 30, 12, 12, '#777'],
// 'ear': [19, 28, 3, 4, '#777'],
// 'mouth': [25, 35, 12, 4, '#777'],
// 'leftfoot_tail': [1, 28, 2, 10, '#888', [2, 36]]
// }
		var t = this.texture.getContext('2d');
		t.clearRect(0, 0, 320, 640);
		for(var part in body) {
			if(part.includes('leg') || part.includes('foot') || part.includes('arm')) {
				t.fillStyle = body[part][4];
				t.save();
				t.translate(body[part][5][0]*10, body[part][5][1]*10-15);
				if(part.includes('right')) t.rotate(-this.lr/1000);
				if(part.includes('left')) t.rotate(this.lr/1000);
				if(!this.vehicle){
					if(Math.abs(this.lr) > 99) this.lrr = -this.lrr;
					if(this.position.velocityX != 0) {this.lr -= this.lrr * (shift?2:1)}
					else this.lr = 0;
				} else {
					this.lr = -10;
				}
				// if(part.includes('foot')) {
				// 	if(this.direction == 1) {
				// 		t.fillRect(body[part][0]*10-body[part][5][0]*10+3, body[part][1]*10-body[part][5][1]*10, body[part][2]*10, body[part][3]*10);
				// 	} else {
				// 		t.fillRect(body[part][0]*10-body[part][5][0]*10-18, body[part][1]*10-body[part][5][1]*10, body[part][2]*10, body[part][3]*10);
				// 	}
				// } else {
					if(this.direction==1) t.fillRect(body[part][0]*10-body[part][5][0]*10, body[part][1]*10-body[part][5][1]*10, body[part][2]*10, body[part][3]*10);
					else if(this.direction==-1) t.fillRect(this.texture.width - body[part][0]*10-body[part][5][0]*10, body[part][1]*10-body[part][5][1]*10, -body[part][2]*10, body[part][3]*10);
				// }
				t.restore();
			} else {
				t.fillStyle = body[part][4];
				if (this.direction == 1) t.fillRect(body[part][0]*10, body[part][1]*10, body[part][2]*10, body[part][3]*10);
				if (this.direction == -1) t.fillRect(this.texture.width - body[part][0]*10, body[part][1]*10, -body[part][2]*10, body[part][3]*10);
			}
		}
		t.rect(1, 1, 319, 548);
		// t.stroke();
	};
};

function Vehicle(x, y, t){
	this.texture = t || 'vehicle.truck';
	this.ogPos = {x: x, y: y};
	this.position = new Vector(x, y);
	this.w = 320;
	this.h = 110;
	this.direction = 'right';
	this.textures = _import("vehicle_textures.json");
	this.show = function(context){
		var textures = this.textures;
		for(var i in textures[this.texture+'.'+this.direction].parts) {
			var thatthing = textures[this.texture+'.'+this.direction].parts[i];
			context.beginPath()
			context.fillStyle = i;
			context.moveTo(this.position.x + thatthing[0][0]*(this.w/10) - game.char.position.x + 640, this.position.y + thatthing[0][1]*(this.h/10));
			for(var i = 1; i < thatthing.length; i++) {
				context.lineTo(this.position.x + thatthing[i][0]*(this.w/10) - game.char.position.x + 640, this.position.y + thatthing[i][1]*(this.h/10));
			}
			context.fill();
		};
		this.update();
	};
	this.update = function(){
		if(this.position.y > 1000) {
			if(this.playermounted) this.unmountPlayer();
			this.position.velocityX = 0;
			this.position.velocityY = -4;
			this.position.x = this.ogPos.x;
			this.position.y = this.ogPos.y;
		}
		this.position.update();
		this.position.y += this.h/2;
		for(var i of game.platforms) {
			i.check(this.position, this.w, this.h);
		}
		this.position.y -= this.h/2;
		if(this.playermounted == true) {
			game.char.position.x = this.textures[this.texture+'.'+this.direction].mountModifiers[0] * this.w/10 + this.position.x + this.w * (this.direction == 'right' ? 0.6 : 0.2);
			game.char.position.y = this.textures[this.texture+'.'+this.direction].mountModifiers[1] * this.w/10 + this.position.y + this.h*0.4;
			this.position.velocityX = game.char.position.velocityX * 3;
			this.position.velocityY -= 0.12;
			game.char.position.velocityY = 0;
		}
		if(this.position.velocityX < 0) this.direction = 'left';
		if(this.position.velocityX > 0) this.direction = 'right';
	};
	this.mountPlayer = function(){
		this.oldPlayerData = {};
		this.oldPlayerData.update = game.char.position.update;
		game.char.position.update = function(){};
		this.playermounted = true;
		game.char.vehicle = this;
	};
	this.unmountPlayer = function(){
		this.playermounted = false;
		game.char.vehicle = false;
		game.char.position.update = this.oldPlayerData.update;
	};
	this.checkDistance = function(entity){
		var x1 = this.position.x+this.w/2;
		var x2 = entity.position.x;
		var y1 = this.position.y;
		var y2 = entity.position.y;
		var distance = Math.sqrt(parseInt(Math.pow(x2-x1, 2)) + parseInt(Math.pow(y2-y1, 2)));
		console.log(distance);
		if(Math.abs(distance*1.75) < this.w){
			return true;
		};
		return false;
	};
}


var shift = false;
window.onkeydown = function(e){
	if(e.keyCode != 17 && e.keyCode != 82) e.preventDefault();
	if(e.keyCode == 16 && game.char.energy > 40) {
		shift = true;
	}
	if(e.keyCode == 68 || e.keyCode == 39) game.char.position.velocityX = +5;
	if(e.keyCode == 65 || e.keyCode == 37) game.char.position.velocityX = -5;
	if(shift && (e.keyCode == 87||e.keyCode==38) && game.char.position.onFloor && game.char.energy >= 5) {
		game.char.jump(-10)
	}
	else if((e.keyCode == 87||e.keyCode==38) && game.char.position.onFloor) game.char.jump(-8);
	if(e.keyCode == 69 || e.keyCode == 191) {
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
}
window.onkeyup = function(e){
	if(e.keyCode != 17 && e.keyCode != 82) e.preventDefault();
	if(e.keyCode == 16) {
		shift = false;
	}
	if((e.keyCode == 68 || e.keyCode == 39) && game.char.position.velocityX > 0) game.char.position.velocityX = 0;
	if((e.keyCode == 65 || e.keyCode == 37) && game.char.position.velocityX < 0) game.char.position.velocityX = 0;
}