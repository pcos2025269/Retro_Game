const canvas = document.getElementById("gameCanvas");
document.body.appendChild(canvas);
canvas.width = innerWidth - 4;
canvas.height = innerHeight - 4;
const ctx = canvas.getContext("2d");
 
let score = 0;
let lives = 3;
let gameOver = false;
 
const KEYS = {};
 
class Ship {
    constructor() {
        this.position = { x: canvas.width / 2, y: canvas.height / 2 }
        this.w = 45;
        this.h = 35;
        this.velocity = { x: 0, y: 0 }
        this.friction = 0.95;
 
        this.image = new Image();
        this.image.src = "SRC/IMG/ship.png";
        this.image.onload = this.draw;
        this.angle = 0;
 
        this.shootCooldown = 0;
        this.shootDelay = 15;
        this.invincible = false;
        this.invincibleTimer = 0;
        this.duration = 120;
    }
 
    get cx() { return this.position.x + this.w / 2 }
    get cy() { return this.position.y + this.h / 2 }
    get radius() { return this.w * 0.38 }
 
    Borders() {
        if (this.position.x < 0) this.position.x = canvas.width - this.w
        else if (this.position.x > canvas.width - this.w) this.position.x = 0
 
        if (this.position.y < 0) this.position.y = canvas.height - this.h
        else if (this.position.y > canvas.height - this.h) this.position.y = 0
    }
 
    move() {
        if (KEYS["ArrowLeft"]) this.angle -= 0.05
        if (KEYS["ArrowRight"]) this.angle += 0.05
 
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
 
    shoot() {
        if (this.shootCooldown > 0) { this.shootCooldown--; return }
        if (KEYS[" "]) {
            const tx = this.cx + Math.cos(this.angle - Math.PI / 2) * (this.h / 2)
            const ty = this.cy + Math.sin(this.angle - Math.PI / 2) * (this.h / 2)
            bullets.push(new Bullet(tx, ty, this.angle))
            this.shootCooldown = this.shootDelay
        }
    }
 
    makeInvincible() {
        this.invincible = true
        this.invincibleTimer = this.duration
    }
 
    updateInvincibility() {
        if (!this.invincible) return
        this.invincibleTimer--
        if (this.invincibleTimer <= 0) this.invincible = false
    }
 
    update() {
        this.draw()
        this.move()
        this.shoot()
        this.updateInvincibility()
    }
 
    draw() {
        if (!this.image.complete) return
        if (this.invincible && Math.floor(this.invincibleTimer / 6) % 2 === 0) return
 
        ctx.save()
        ctx.translate(this.position.x + this.w / 2, this.position.y + this.h / 2)
        ctx.rotate(this.angle)
        ctx.drawImage(this.image, -this.w / 2, -this.h / 2, this.w, this.h)
        ctx.restore()
    }
}
 
class Bullet {
    constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        this.vx = Math.cos(angle - Math.PI / 2) * 9
        this.vy = Math.sin(angle - Math.PI / 2) * 9
        this.radius = 5;
        this.alive = true;
    }
 
    update() {
        this.x += this.vx
        this.y += this.vy
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height)
            this.alive = false
    }
 
    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = "#ffa600"
        ctx.shadowColor = "#585858"
        ctx.shadowBlur = 8
        ctx.fill()
        ctx.shadowBlur = 0
    }
}
 
class Asteroid {
    constructor(x, y, size = "large") {
        this.x = x;
        this.y = y;
        this.size = size;
 
        const radii = { large: 70, medium: 40, small: 20 }
        this.radius = radii[size]
 
        const speeds = { large: 1, medium: 1.5, small: 2.2 }
        const spd = (Math.random() * 1.2 + 0.5) * speeds[size]
        const dir = Math.random() * Math.PI * 2
        this.vx = Math.cos(dir) * spd
        this.vy = Math.sin(dir) * spd
 
        this.rotation = 0;
        this.rotationSpeed = (Math.random() - 0.5) * 0.03
 
        this.vertices = 10;
        this.offsets = Array.from({ length: 10 }, () => 0.7 + Math.random() * 0.6)
        this.alive = true;
    }
 
    borders() {
        if (this.x < -this.radius) { 
            this.x = canvas.width + this.radius 
        }
        if (this.x > canvas.width + this.radius) { 
            this.x = -this.radius 
        }
        if (this.y < -this.radius) { 
            this.y = canvas.height + this.radius 
        }
        if (this.y > canvas.height + this.radius) { 
            this.y = -this.radius 
        }
    }
 
    update() {
        this.x += this.vx
        this.y += this.vy
        this.rotation += this.rotationSpeed
        this.borders()
    }
 
    draw() {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.rotation)
        ctx.beginPath()
        for (let i = 0; i < this.vertices; i++) {
            const a = (i / this.vertices) * Math.PI * 2
            const r = this.radius * this.offsets[i]
            i === 0 ? ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r)
                    : ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r)
        }
        ctx.closePath()
        ctx.strokeStyle = "#AAAAFF"
        ctx.lineWidth = 2
        ctx.stroke()
        ctx.fillStyle = "rgba(80, 80, 120, 0.3)"
        ctx.fill()
        ctx.restore()
    }
}
 
const POINTS = { large: 20, medium: 50, small: 100 }
 
function hits(ax, ay, ar, bx, by, br) {
    const dx = ax - bx, dy = ay - by
    return Math.sqrt(dx * dx + dy * dy) < ar + br
}
 
function spawnAsteroids(n = 5) {
    for (let i = 0; i < n; i++) {
        let x, y
        const side = Math.floor(Math.random() * 4)
        if (side === 0) { x = Math.random() * canvas.width; y = -80 }
        else if (side === 1) { x = canvas.width + 80; y = Math.random() * canvas.height }
        else if (side === 2) { x = Math.random() * canvas.width; y = canvas.height + 80 }
        else { x = -80; y = Math.random() * canvas.height }
        asteroids.push(new Asteroid(x, y, "large"))
    }
}
 
const bullets = []
const asteroids = []
const ship = new Ship()
spawnAsteroids()
 
function drawHUD() {
    ctx.fillStyle = "white"
    ctx.font = "bold 22px 'VT323', monospace"
    ctx.textAlign = "left"
    ctx.fillText(`SCORE: ${score}`, 20, 35)
    ctx.fillText("LIVES:", canvas.width - 200, 35)
 
    for (let i = 0; i < lives; i++) {
        ctx.save()
        ctx.translate(canvas.width - 110 + i * 32, 20)
        ctx.strokeStyle = "#88AAFF"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(0, -10)
        ctx.lineTo(8, 10)
        ctx.lineTo(0, 6)
        ctx.lineTo(-8, 10)
        ctx.closePath()
        ctx.stroke()
        ctx.restore()
    }
}
 
function drawGameOver() {
    ctx.fillStyle = "rgba(0,0,0,0.6)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "white"
    ctx.font = "bold 64px 'Press Start 2P'"
    ctx.textAlign = "center"
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 30)
    ctx.font = "28px 'Press Start 2P'"
    ctx.fillText(`FINAL SCORE: ${score}`, canvas.width / 2, canvas.height / 2 + 30)
    ctx.font = "20px 'Press Start 2P'"
    ctx.fillStyle = "#AAAAFF"
    ctx.fillText("Presiona R para reiniciar", canvas.width / 2, canvas.height / 2 + 80)
    ctx.font = "20px 'Press Start 2P'"
}
 
function resetGame() {
    score = 0; lives = 3; gameOver = false
    bullets.length = 0; asteroids.length = 0
    ship.position = { x: canvas.width / 2, y: canvas.height / 2 }
    ship.velocity = { x: 0, y: 0 }
    ship.angle = 0
    ship.invincible = false
    ship.invincibleTimer = 0
    spawnAsteroids()
}
 
const stars = (n = 25) => {
    for (let i = 0; i < n; i++) {
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
    stars()
}
 
const update = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawBack()
 
    if (gameOver) { drawGameOver(); requestAnimationFrame(update); return }
 
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].update()
        bullets[i].draw()
        if (!bullets[i].alive) bullets.splice(i, 1)
    }
 
    for (let i = asteroids.length - 1; i >= 0; i--) {
        asteroids[i].update()
        asteroids[i].draw()
 
        for (let j = bullets.length - 1; j >= 0; j--) {
            if (!hits(bullets[j].x, bullets[j].y, bullets[j].radius, asteroids[i].x, asteroids[i].y, asteroids[i].radius)) continue
            score += POINTS[asteroids[i].size]
            if (asteroids[i].size === "large") {
                asteroids.push(new Asteroid(asteroids[i].x, asteroids[i].y, "medium"))
                asteroids.push(new Asteroid(asteroids[i].x, asteroids[i].y, "medium"))
            } else if (asteroids[i].size === "medium") {
                asteroids.push(new Asteroid(asteroids[i].x, asteroids[i].y, "small"))
                asteroids.push(new Asteroid(asteroids[i].x, asteroids[i].y, "small"))
            }
            asteroids.splice(i, 1)
            bullets.splice(j, 1)
            break
        }
    }
 
    if (!ship.invincible) {
        for (let i = 0; i < asteroids.length; i++) {
            if (!hits(ship.cx, ship.cy, ship.radius, asteroids[i].x, asteroids[i].y, asteroids[i].radius)) continue
            lives--
            if (lives <= 0) gameOver = true
            else { ship.position = { x: canvas.width / 2, y: canvas.height / 2 }; ship.velocity = { x: 0, y: 0 }; ship.makeInvincible() }
            break
        }
    }
 
    if (asteroids.length === 0) spawnAsteroids()
 
    ship.update()
    drawHUD()
    requestAnimationFrame(update)
}
 
addEventListener("keydown", e => {
    KEYS[e.key] = true
    if ((e.key === "r" || e.key === "R") && gameOver) resetGame()
})
 
addEventListener("keyup", e => { KEYS[e.key] = false })
 
update()