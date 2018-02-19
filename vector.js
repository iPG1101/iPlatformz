function Vector (x = 640, y = 400, velocityX = 0, velocityY = 0) {
	this.x = x;
	this.y = y;
	this.velocityX = velocityX;
	this.velocityY = velocityY;
};
Vector.prototype.update = function(){
	this.x += this.velocityX;
	this.y += this.velocityY;
	this.velocityY += 0.3;
	this.onFloor = false;
};
Vector.prototype.updateX = function(multiplier = 0.5){
	this.x += this.velocityX * multiplier;
	//This is for when `shift` is held, deprecated, and useless
};
