function Vector (x = 640, y = 400, velocityX = 0, velocityY = 0) {
	this.x = x;
	this.y = y;
	this.velocityX = velocityX;
	this.velocityY = velocityY;
};
Vector.prototype.update = function(xMult = 1, yMult = 1){
	this.x += this.velocityX * xMult;
	this.y += this.velocityY * yMult;
	this.velocityY += 0.3;
};