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
 
        // Parpadeo: saltamos el draw en frames pares mientras es invencible
        if (this.invincible && Math.floor(this.invincibleTimer / 6) % 2 === 0) return;
 
        ctx.save();
        ctx.translate(this.position.x + this.w / 2, this.position.y + this.h / 2);
        ctx.rotate(this.angle);
        ctx.drawImage(this.image, -this.w / 2, -this.h / 2, this.w, this.h);
        ctx.restore();
    }
}

const ship = new Ship();

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
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawBack()
    
    ship.update()
    requestAnimationFrame(update)
}

addEventListener("keydown", e => {
    console.log(e.key)
    KEYS[e.key] = true
});

addEventListener("keyup", e => {
    console.log(e.key)
    KEYS[e.key] = false
}); 


update()