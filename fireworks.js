window.oncontextmenu = function () { return false; } 

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d'); 				
var frameRate = 60.0;							
var frameDelay = 1000.0/frameRate;			

var clientWidth = innerWidth ;					
var clientHeight = innerHeight;					
var timer = 0;									
var x = 0;									
var y = 0;										

canvas.width = clientWidth ;						
canvas.height = clientHeight;					

var TimedFirework = 100;					
var LimiterTicker = 0;							
var fireworks = [];								
var particles = [];								
var typecount = 1;								
var sparks = [];								
var num = 2;									
var colorchanger = 0;							

function distance(px1, py1, px2, py2) {
    xdis = px1 - px2;
    ydis = py1 - py2;
    return Math.sqrt((xdis*xdis) + (ydis*ydis));
}

function getAngle(posx1, posy1, posx2, posy2) {
    if (posx1 == posx2) { if (posy1 > posy2) { return 90; } else { return 270; } }
    if (posy1 == posy2) { if (posy1 > posy2) { return 0; } else { return 180; } }

    var xDist = posx1 - posx2;
    var yDist = posy1 - posy2;

    if (xDist == yDist) { if (posx1 < posx2) { return 225; } else { return 45; } }
    if (-xDist == yDist) { if (posx1 < posx2) { return 135; } else { return 315; } }

    if (posx1 < posx2) {
        return Math.atan2(posy2-posy1, posx2-posx1)*(180/Math.PI) + 180;
    } else {
        return Math.atan2(posy2-posy1, posx2-posx1)*(180/Math.PI) + 180;
    }
}

function random(min, max, round) {
    if (round == 'round') {
        return Math.round(Math.random() * (max - min) + min);
    } else {
        return Math.random() * (max - min) + min;
    }
}

function colors() {
    if (timer > colorchanger) { num = random(0, 7, 'round'); colorchanger = timer + (500); }
    switch(num) {
        case 1: return '#ff0000'; break;
        case 2: return '#ff6a00'; break;
        case 3: return '#008900'; break;
        case 4: return '#00a2ff'; break;
        case 5: return '#0000ff'; break;
        case 6: return '#bf00ff'; break;
        case 7: return '#ff002b'; break;
    }
}

createFirework = function() {
    firework = new Firework();

    firework.x = firework.sx = clientWidth/2;
    firework.y = firework.sy = clientHeight;

    firework.color = colors();

    if (x != 0 && y != 0) {
        firework.tx = x;
        firework.ty = y;
        x = y = 0;
    } else {
        firework.tx = random(400, clientWidth-400);
        firework.ty = random(0, clientHeight / 2);
    }

    var angle = getAngle(firework.sx, firework.sy, firework.tx, firework.ty);

    firework.vx = Math.cos(angle * Math.PI/180.0);
    firework.vy = Math.sin(angle * Math.PI/180.0);

    fireworks.push(firework);
}

Firework = function() {

    this.x = 0;
    this.y = 0;
    this.sx = 0;
    this.sy = 0;
    this.tx = 0;
    this.ty = 0;
    this.vx = 0;
    this.vy = 0;
    this.color = 'rgb(255,255,255)';
    this.dis = distance(this.sx, this.sy, this.tx, this.ty);
    this.speed = random(700, 1100);
    this.gravity = 1.5;
    this.ms = 0;
    this.s = 0;
    this.del = false;

    this.update = function(ms) {
        this.ms = ms / 1000;

        if (this.s > 2000/ms) {
            createParticles(typecount, 30, this.x, this.y, this.color);
            this.del = true;
        } else {
            this.speed *= 0.98;
            this.x -= this.vx * this.speed * this.ms;
            this.y -= this.vy * this.speed * this.ms - this.gravity;
        }

        this.s++;
    }

    this.draw = function() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, 1, 0, 2*Math.PI);
        ctx.fill();
    }
}

createParticles = function(type, count, pox, poy, color) {
    for (var i = 0; i < count; i++) {
        par = new Particles();
        par.type = type;

        par.color = color;
        par.x = pox;
        par.y = poy;

        var angle = random(0, 360);
        par.vx = Math.cos(angle * Math.PI/180.0);
        par.vy = Math.sin(angle * Math.PI/180.0);

        particles.push(par);
    };
}

Particles = function() {

    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.speed = random(200, 500);
    this.gravity = 1;
    this.wind = 0;
    this.type = 1;
    this.opacity = 1;
    this.s = 0;
    this.scale = 1;
    this.color = '#fff';
    this.del = false;

    this.update = function(ms) {
        this.ms = ms / 1000;

        if (this.s > 900/ms) { if (this.opacity - 0.05 < 0) { this.opacity = 0; } else { this.opacity -= 0.05; } }

        if (this.type == 1) {
            this.speed *= 0.96;
            this.x -= this.vx * this.speed * this.ms + this.wind;
            this.y -= this.vy * this.speed * this.ms - this.gravity;
        } else if (this.type == 2) {
            if (this.s < 800/ms) { this.scale += 0.1; } else { this.scale -= 0.2; }
            this.speed *= 0.96;
            this.x -= this.vx * this.speed * this.ms + this.wind;
            this.y -= this.vy * this.speed * this.ms - this.gravity;
        } else if (this.type == 3) {
            this.speed *= 0.95;
            this.x -= this.vx * this.speed * this.ms + this.wind;
            this.y -= this.vy * this.speed * this.ms;
        } else if (this.type == 4) {
            this.speed *= 0.96;
            this.x -= this.vx * this.speed * this.ms + this.wind;
            this.y -= this.vy * this.speed * this.ms - this.gravity;

            spark = new Sparkler();
            spark.x = this.x;
            spark.y = this.y;
            spark.vx = Math.cos(random(0, 360, 'round') * (Math.PI/180))*1.05;
            spark.vy = Math.sin(random(0, 360, 'round') * (Math.PI/180))*1.05;
            spark.tx = this.x;
            spark.ty = this.y;
            spark.color = this.color;
            spark.limit = random(4, 10, 'round');
            sparks.push(spark);
        } else {

        }

        this.s++;
    }

    this.draw = function() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;

        if (this.type == 1) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 1.5, 0, 2*Math.PI);
            ctx.fill();
        } else if (this.type == 2) {
            ctx.translate(this.x, this.y);
            ctx.scale(this.scale, this.scale);
            ctx.beginPath();
            ctx.fillRect(0, 0, 1, 1);
        } else if (this.type == 3) {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x - this.vx * 10, this.y - this.vy * 10);
            ctx.stroke();
        } else if (this.type == 4) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 1.5, 0, 2*Math.PI);
            ctx.fill();
        } else {
            ctx.arc(this.x, this.y, 1, 0, 2*Math.PI);
            ctx.fill();
        }

        ctx.closePath();
        ctx.restore();
    }
}

Sparkler = function() {

    this.x = 0;
    this.y = 0;
    this.tx = 0;
    this.ty = 0;
    this.limit = 0;
    this.color = 'red';

    this.update = function() {
        this.tx += this.vx;
        this.ty += this.vy;

        this.limit--;
    }

    this.draw = function() {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.tx, this.ty);
        ctx.lineWidth = 1;
        ctx.strokeStyle = this.color;
        ctx.stroke();
        ctx.closePath();
    }
}



canvas.addEventListener('mousedown', function(evt) {
    evt = evt || window.event;
    var button = evt.which || evt.button;
    if (button == 1) {
        x = evt.clientX; y = evt.clientY; createFirework();
    } else { 
        if (typecount == 4) { typecount = 1; } else { typecount++; }
    }
});

update = function(frame) {

  

    ctx.globalAlpha = 1;
    ctx.fillStyle = '#ffd7d7';
    ctx.fillRect(0, 0, clientWidth, clientHeight);


    if (timer > LimiterTicker) {
        createFirework();

        LimiterTicker = timer + (TimedFirework / frame);
    }

    var i = fireworks.length;
    while(i--) {
        if (fireworks[i].del == true) { fireworks.splice(i, 1); } else {
            fireworks[i].update(frame);
            fireworks[i].draw();
        }
    }

    var i = particles.length;
    while(i--) {
        if (particles[i].opacity == 0) { particles.splice(i, 1); } else {
            particles[i].update(frame);
            particles[i].draw();
        }
    }

    var i = sparks.length;
    while(i--) {
        if (sparks[i].limit < 0) { sparks.splice(i, 1); } else {
            sparks[i].update(frame);
            sparks[i].draw();
        }
    }

    timer++;
}

var main = setInterval(function() { update(frameDelay); }, frameDelay);
