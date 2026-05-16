const canvas = document.getElementById("gameCanvas");
document.body.appendChild(canvas);
canvas .width = innerWidth -4 ;
canvas.height = innerHeight -4 ;
const ctx = canvas.getContext("2d");

let score = 0;
let gameOver = false;
let lives = 3;

const KEYS = {};

class Ship {
    constructor() {

        this.position = {
            x: canvas.width / 2,
            y: canvas.height / 2,
        }
        this.w = 45;
        this.h = 35;
        this.velocity = {
            x: 0,
            y: 0,
        }
        this.friction = 0.95;
        
        this.image = new Image();
        this.image.src = "SRC/IMG/ship.png";
        this.image.onload = this.draw;
        this.angle = 0;

        this.shootCooldown = 0;
        this.shootDelay = 15;

        this.invincible = false;
        this.invincibilityTimer= 0;
        this.duration = 120;
    }

    getcx() {
        return this.position.x + this.w / 2
    }   
    getcy() {    
        return this.position.y + this.h / 2
    }
    getRadius() {
        return this.w * 0.38;   
    }

    Borders() {
        
        if (this.position.x < 0) {
            this.position.x = canvas.width-this.w
        } else if (this.position.x  > canvas.width-this.w) {
            this.position.x = 0
            
        }
        
        if (this.position.y < 0) {
            this.position.y = canvas.height-this.h
        } else if (this.position.y  > canvas.height-this.h) {
            this.position.y = 0
        }
    }

    move() {
        if (KEYS["ArrowLeft"]) {
            this.angle -= 0.05
        }
        if (KEYS["ArrowRight"]) {
            this.angle += 0.05
        }
        
        if (KEYS["ArrowUp"]) {
            this.velocity.x += Math.cos(this.angle - Math.PI / 2) * 0.4
            this.velocity.y += Math.sin(this.angle - Math.PI / 2) * 0.4
        }
        
        if (KEYS["ArrowDown"]) {
            this.velocity.x -= Math.cos(this.angle - Math.PI / 2) * 0.2
            this.velocity.y -= Math.sin(this.angle - Math.PI / 2) * 0.2
        }
        
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    
        this.velocity.x *= this.friction
        this.velocity.y *= this.friction
        this.Borders()
    }
    shoot()  {
        if (this.shootCooldown > 0) {
            this.shootCooldown--;
            return;
        }

        if (KEYS[" "]) {                        
            
            const tipX = this.cx + Math.cos(this.angle - Math.PI / 2) * (this.h / 2);
            const tipY = this.cy + Math.sin(this.angle - Math.PI / 2) * (this.h / 2);

            bullets.push(new Bullet(tipX, tipY, this.angle));
            this.shootCooldown = this.shootDelay;   
        }
    }

    makeInvincible() {
        this.invincible = true;
        this.invincibilityTimer = this.duration;
    }

    updateInvincibility() {
        if (this.invincible) {
            this.invincibilityTimer--;
            if (this.invincibleTimer <= 0) this.invincible = false;
        }
    }

    update() {
        this.draw();
        this.move();
        this.shoot();
        this.updateInvincibility();
    }

    draw() {
        if (!this.image.complete) return;

        
        if (this.invincible && Math.floor(this.invincibleTimer / 6) % 2 === 0) return;

        ctx.save();
        ctx.translate(this.position.x + this.w / 2, this.position.y + this.h / 2);
        ctx.rotate(this.angle);
        ctx.drawImage(this.image, -this.w / 2, -this.h / 2, this.w, this.h);
        ctx.restore();
    }
}

class Bullet{
    constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        this.angle = angle;

        this.speed = 9;
        this.vx = Math.cos(angle - Math.PI / 2) * this.speed;
        this.vy = Math.sin(angle - Math.PI / 2) * this.speed;
        this.radius = 3;
        this.alive = true;
    }

    update() {
        this.y += this.vy;
        this.x += this.vx;

        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.alive = false;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#ffa600";   
        ctx.shadowColor = "#585858";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fill();
        ctx.shadowBlur = 0;
    }
    
}

class Asteroid {
    constructor(x, y, size = "large") {
        this.x = x;
        this.y = y;
        this.size = size;

        
        const radii = { large: 70, medium: 40, small: 20 };
        this.radius = radii[size];


        const speedMultiplier = { large: 1, medium: 1.5, small: 2.2 };
        const baseSpeed = (Math.random() * 1.2 + 0.5) * speedMultiplier[size];
        const dir = Math.random() * Math.PI * 2;
        this.vx = Math.cos(dir) * baseSpeed;
        this.vy = Math.sin(dir) * baseSpeed;

        this.rotation = 0;
        this.rotationSpeed = (Math.random() - 0.5) * 0.03;

        
        this.vertices = 10;
        this.offsets = Array.from({ length: this.vertices }, () =>
            0.7 + Math.random() * 0.6    
        );

        this.alive = true;
    }

    borders() {
        if (this.x < -this.radius) this.x = canvas.width + this.radius;
        if (this.x > canvas.width + this.radius) this.x = -this.radius;
        if (this.y < -this.radius) this.y = canvas.height + this.radius;
        if (this.y > canvas.height + this.radius) this.y = -this.radius;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;
        this.borders();
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        ctx.beginPath();
        for (let i = 0; i < this.vertices; i++) {
            const angle = (i / this.vertices) * Math.PI * 2;
            const r = this.radius * this.offsets[i];
            const px = Math.cos(angle) * r;
            const py = Math.sin(angle) * r;
            i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath();

        ctx.strokeStyle = "#AAAAFF";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = "rgba(80, 80, 120, 0.3)";
        ctx.fill();
        ctx.restore();
    }
}

function circlesCollide(ax, ay, ar, bx, by, br) {
    const dx = ax - bx;
    const dy = ay - by;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return dist < ar + br;
}

const POINTS = { large: 20, medium: 50, small: 100 };

function spawnAsteroids(count = 5) {
    for (let i = 0; i < count; i++) {

        let x, y;
        const side = Math.floor(Math.random() * 4);
        if (side === 0) { x = Math.random() * canvas.width; y = -80; }
        else if (side === 1) { x = canvas.width + 80; y = Math.random() * canvas.height; }
        else if (side === 2) { x = Math.random() * canvas.width; y = canvas.height + 80; }
        else { x = -80; y = Math.random() * canvas.height; }

        asteroids.push(new Asteroid(x, y, "large"));
    }
}

const bullets = [];
const ship = new Ship();
const asteroids = [];
spawnAsteroids(5);

function drawHUD() {
    ctx.fillStyle = "white";
    ctx.font = "bold 22px 'Courier New', monospace";
    ctx.textAlign = "left";
    ctx.fillText(`SCORE: ${score}`, 20, 35);
 
    ctx.fillStyle = "white";
    ctx.font = "bold 22px 'Courier New', monospace";
    ctx.fillText("LIVES:", canvas.width - 200, 35);
 
    for (let i = 0; i < lives; i++) {
        const lx = canvas.width - 110 + i * 32;
        const ly = 20;
 
        ctx.save();
        ctx.translate(lx, ly);
        ctx.strokeStyle = "#88AAFF";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -10);
        ctx.lineTo(8, 10);
        ctx.lineTo(0, 6);
        ctx.lineTo(-8, 10);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }
}

function drawGameOver() {
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
 
    ctx.fillStyle = "white";
    ctx.font = "bold 64px 'Courier New', monospace";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 30);
 
    ctx.font = "28px 'Courier New', monospace";
    ctx.fillText(`FINAL SCORE: ${score}`, canvas.width / 2, canvas.height / 2 + 30);
 
    ctx.font = "20px 'Courier New', monospace";
    ctx.fillStyle = "#AAAAFF";
    ctx.fillText("Presiona R para reiniciar", canvas.width / 2, canvas.height / 2 + 80);
}

function resetGame() {
    score = 0;
    lives = 3;
    gameOver = false;
 
    bullets.length = 0;
    asteroids.length = 0;
 
    ship.position = { x: canvas.width / 2, y: canvas.height / 2 };
    ship.velocity = { x: 0, y: 0 };
    ship.angle = 0;
    ship.invincible = false;
    ship.invincibleTimer = 0;
 
    spawnAsteroids(5);
}

const stars = (number = 100) => {
    for (let i = 0; i < number; i++) {
        let x = Math.floor(Math.random() * canvas.width)
        let y = Math.floor(Math.random() * canvas.height)
        ctx.fillStyle = "white"
        ctx.fillRect(x, y, 2, 4)
        ctx.fillRect(--x, ++y, 4, 2)
    }
}


const drawBack = () => {
    ctx.fillStyle = "#000000"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    stars(25)
}

const update = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBack();
 
    if (gameOver) {
        drawGameOver();
        requestAnimationFrame(update);
        return;
    }
 
    // — Actualizar y dibujar bullets —
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].update();
        bullets[i].draw();
 
        // Eliminar proyectiles muertos
        if (!bullets[i].alive) {
            bullets.splice(i, 1);
        }
    }
 
    // — Actualizar y dibujar asteroides —
    for (let i = asteroids.length - 1; i >= 0; i--) {
        asteroids[i].update();
        asteroids[i].draw();
 
        // ── COLISIÓN: proyectil ↔ asteroide ──────────────────
        // Recorremos bullets de atrás hacia adelante para poder
        // hacer splice sin saltarnos índices.
        for (let j = bullets.length - 1; j >= 0; j--) {
            const b = bullets[j];
            const a = asteroids[i];
 
            if (circlesCollide(b.x, b.y, b.radius, a.x, a.y, a.radius)) {
                // Sumar puntos
                score += POINTS[a.size];
 
                // Dividir: large → 2 medium, medium → 2 small, small → nada
                if (a.size === "large") {
                    asteroids.push(new Asteroid(a.x, a.y, "medium"));
                    asteroids.push(new Asteroid(a.x, a.y, "medium"));
                } else if (a.size === "medium") {
                    asteroids.push(new Asteroid(a.x, a.y, "small"));
                    asteroids.push(new Asteroid(a.x, a.y, "small"));
                }
 
                // Eliminar asteroide y proyectil
                asteroids.splice(i, 1);
                bullets.splice(j, 1);
                break;   // salir del loop de bullets para este asteroide
            }
        }
    }
 
    // ── COLISIÓN: nave ↔ asteroide ────────────────────────────
    // Solo verificamos si la nave NO está en período de invencibilidad
    if (!ship.invincible) {
        for (let i = asteroids.length - 1; i >= 0; i--) {
            const a = asteroids[i];
            if (circlesCollide(ship.cx, ship.cy, ship.radius, a.x, a.y, a.radius)) {
                lives--;
 
                if (lives <= 0) {
                    gameOver = true;
                } else {
                    // Reposicionar nave en el centro y hacerla invencible
                    ship.position = { x: canvas.width / 2, y: canvas.height / 2 };
                    ship.velocity = { x: 0, y: 0 };
                    ship.makeInvincible();
                }
                break;
            }
        }
    }
 
    // — Nueva oleada si no quedan asteroides —
    if (asteroids.length === 0) {
        spawnAsteroids(5);
    }
 
    // — Nave —
    ship.update();
 
    // — HUD encima de todo —
    drawHUD();
 
    requestAnimationFrame(update);
};

addEventListener("keydown", e => {
    console.log(e.key)
    KEYS[e.key] = true
});

addEventListener("keyup", e => {
    console.log(e.key)
    KEYS[e.key] = false
}); 


update()