function Character (pos = new Vector()) {
	this.position = pos;
	this.texture = document.querySelector('#character');
	this.w = 64;
	this.h = 96;
	this.lr = 77;
	this.lrr = 3;
	this.energy = 100;
	this.direction = 1;
	this.show = function(c){
		if(!movingCamera) c.drawImage(this.texture, this.position.x - this.w/2, this.position.y - this.h/2, this.w, this.h);
		if(movingCamera) c.drawImage(this.texture, 640, this.position.y - this.h/2, this.w, this.h);
		this.updateTexture();
		c.lineWidth = 4;
		c.strokeRect(1056, 24, 204, 16);
		c.strokeRect(1056, 24, 80,  16);
		c.fillStyle = '#071';
		c.fillRect(1058, 26, this.energy*2,  12);
		return this;
	};
	this.update = function(platforms){
		this.direction = this.position.velocityX > 0 ? 1 : this.position.velocityX < 0 ? -1 : this.direction;
		if(shift && this.energy > 0) {
			this.position.updateX();
			if(this.position.velocityX != 0) this.energy -= 1.5;
		} else if (shift) {
			shift = false;
		}
		for(var p of platforms) {
			p.check(this.position, this.w, this.h);
		}
		this.position.update();
		this.energy += 0.33;
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
				if(Math.abs(this.lr) > 99) this.lrr = -this.lrr;
				if(this.position.velocityX != 0) {this.lr -= this.lrr * (shift?2:1)}
				else this.lr = 0;
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


var shift = false;
window.onkeydown = function(e){
	var key = String.fromCharCode(e.keyCode);
	if(e.keyCode == 16 && game.char.energy > 40) {
		shift = true;
	}
	if(key.toLowerCase() == 'd') game.char.position.velocityX = +5;
	if(key.toLowerCase() == 'a') game.char.position.velocityX = -5;
	if(shift && key.toLowerCase() == 'w' && game.char.position.onFloor && game.char.energy >= 5) {
		game.char.position.velocityY = -9;
		game.char.energy -= 5;
	}
	else if(key.toLowerCase() == 'w' && game.char.position.onFloor) game.char.position.velocityY = -8;
	console.log(key)
}
window.onkeyup = function(e){
	var key = String.fromCharCode(e.keyCode);
	if(e.keyCode == 16) {
		shift = false;
	}
	if(key.toLowerCase() == 'd' && game.char.position.velocityX > 0) game.char.position.velocityX = 0;
	if(key.toLowerCase() == 'a' && game.char.position.velocityX < 0) game.char.position.velocityX = 0;
	console.log(key)
}