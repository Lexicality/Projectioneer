function sub(a, b) {
	return {
		x: a.x - b.x,
		y: a.y - b.y
	};
}
function add(a, b) {
	return {
		x: a.x + b.x,
		y: a.y + b.y
	};
}

function mul(a, b) {
	return {
		x: a.x * b,
		y: a.y * b
	};
}

function clamp(a, b) {
	return {
		x: a.x > b.x ? b.x : (a.x < 0 ? 0 : a.x ),
		y: a.y > b.y ? b.y : (a.y < 0 ? 0 : a.y )
	}
}

function rotate(a, b) {
	var s = Math.sin(b), c = Math.cos(b);
	return {
		x: c * a.x - s * a.y,
		y: s * a.x + c * a.y
	};
}

var ply = {
	pos: {
		x: 50,
		y: 50
	},
	dirn: 0,
	dir: { x: 1, y: 0 },
	draw: function(ctx, isOffset) {
		var x, y, dir;
		if (isOffset) {
			x = 0, y = 0, dir = {x: 0, y: 1};
		} else {
			x = this.pos.x, y = this.pos.y, dir = this.dir;
		}
		// Direction line
		dir = mul(dir, 10);
		ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x + dir.x, y + dir.y);
		ctx.stroke();
		// Lil guy
		ctx.fillStyle = 'blue';
		ctx.fillRect(x-1, y - 1, 2, 2);
	}
};

var wall = {
	a: {
		x: 70,
		y: 70
	},
	b: {
		x: 70,
		y: 20
	},
	draw: function(ctx, offset, offsetAng) {
		var a = this.a, b = this.b;

		if (offset) {
			a = sub(a, offset);
			b = sub(b, offset);
			a = rotate(a, offsetAng);
			b = rotate(b, offsetAng);
		}

		ctx.beginPath();
		ctx.strokeStyle = 'yellow';
		ctx.lineWidth = 2;
		ctx.moveTo(a.x, a.y);
		ctx.lineTo(b.x, b.y);
		ctx.stroke();
	},
	// I have no clue what this is doing!
	drawBork: function(ctx, offset, offsetAng) {
		var a = sub(this.a, offset), b = sub(this.b, offset);
		var s = Math.sin(offsetAng), c = Math.cos(offsetAng);
		
		var ax, ay, az, bx, by, bz;

		ax = a.x, ay = a.y, bx = b.x, by = b.y;

		// "Rotation"
// 		az = ax * c + ay * s,
// 		bz = bx * c + by * s,
// 		ax = ax * s - ay * c,
// 		bx = bx * s - by * c;
		ar = rotate(a, -offsetAng)
		br = rotate(b, -offsetAng)
		az = ar.y,
		bz = br.y,
		ax = ar.x,
		bx = br.x;

		// "Perspective transform"
		var axp, bxp, ayp1, byp1, ayp2, byp2;

		var height = 50;

		axp = -ax * 16 / az,
		ayp1 = -height / az,
		ayp2 = height / az,
		bxp = -bx * 16 / bz,
		byp1 = -height / bz,
		byp2 = height / bz;

		ctx.beginPath();
		ctx.strokeStyle = 'yellow';
		ctx.lineWidth = 2;

		// Top
		ctx.moveTo(axp,  ayp1);
		ctx.lineTo(bxp,  byp1);
		// Bottom
		ctx.moveTo( axp,  ayp2);
		ctx.lineTo( bxp,  byp2);
		// Left
		ctx.moveTo( axp,  ayp1);
		ctx.lineTo( axp,  ayp2);
		// Right
		ctx.moveTo( bxp,  byp1);
		ctx.lineTo( bxp,  byp2);

		ctx.stroke();
	}
};

var ctx;

function setup() {
	var canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');
	ctx.scale(2, 2);
}

function viewport(x, y, width, height) {
	ctx.translate(x, y);
	ctx.strokeStyle = 'red';
	ctx.fillStyle = '#eee';
	ctx.lineWidth = 1;
	ctx.fillRect(0, 0, width, height);
	ctx.strokeRect(0, 0, width, height);
}

function plyInput(dtime) {
	// Naive implemetnation
	if (keys.up) {
		ply.pos = add(ply.pos, ply.dir);
	} else if (keys.down) {
		ply.pos = sub(ply.pos, ply.dir);
	}

	var val = dtime / 200;
	if (keys.left) {
		ply.dirn -= val;
	} else if (keys.right) {
		ply.dirn += val;
	}
	ply.dir = {
		x: Math.sin(ply.dirn),
		y: Math.cos(ply.dirn)
	};

	ply.pos = clamp(ply.pos, { x: 100, y: 100 });
}

function drawRaw(ctx) {
	ctx.save()
	viewport(5, 5, 100, 100);
	// Draw Wall
	wall.draw(ctx, null);
	// Draw ply
	ply.draw(ctx);
	// End viewport #1
	ctx.restore();
}

function drawOffset(ctx) {
	ctx.save()
	viewport(110, 5, 100, 100);
	ctx.translate(50, 50);
	ctx.rotate(Math.PI);
	// Draw Wall
	wall.draw(ctx, ply.pos, ply.dirn);
	// Draw ply
	ply.draw(ctx, true);
	// End viewport #2
	ctx.restore();
}

function drawBork(ctx) {
	ctx.save()
	viewport(220, 5, 100, 100);
	ctx.translate(50, 50);
	ctx.rotate(Math.PI);
	// Draw Wall
	wall.drawBork(ctx, ply.pos, ply.dirn);
	// End viewport #2
	ctx.restore();
}

function loop(dtime) {
	plyInput(dtime);

	drawBork(ctx);
	drawRaw(ctx);
	drawOffset(ctx);
}

var last = 0;
window.requestAnimationFrame(function rawLoop(now) {
	window.requestAnimationFrame(rawLoop);
	// Skip the first frame
	if ( ! last ) {
		last = now;
		return;
	}
	var dtime = last - now;
	last = now;
	loop(dtime);
});

setup();
