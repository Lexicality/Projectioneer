
function sub(a, b) {
	return {
		x: a.x - b.x,
		y: a.y - b.y
	};
}

var ply = {
	x: 50,
	y: 50
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
	draw: function(offset) {
		var a = this.a, b = this.b;
		
		if (offset) {
			a = sub(a, offset);
			b = sub(b, offset);
		}

		ctx.beginPath();
		ctx.strokeStyle = 'yellow';
		ctx.lineWidth = 2;
		ctx.moveTo(a.x, a.y);
		ctx.lineTo(b.x, b.y);
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

function drawPly() {
	var x = ply.x, y = ply.y;
	ctx.fillStyle = 'blue';
	ctx.fillRect(x-1, y - 1, 2, 2);
}


function loop(dtime) {
	ctx.save()
	viewport(5, 5, 100, 100);
	// Draw Wall
	wall.draw(null);
	// Draw ply
	drawPly();
	// End viewport #1
	ctx.restore();
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
