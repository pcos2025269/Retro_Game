const canvas = document.getElementById("gameCanvas");
document.body.appendChild(canvas);
canvas .width = innerWidth -4 ;
canvas.height = innerHeight -4 ;
const ctx = canvas.getContext("2d");

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
        this.friction = 0.80;
        
        this.image = new Image();
        this.image.src = "SRC/IMG/ship.png";
        this.image.onload = this.draw;
        this.angle = 0;
    }

    Borders() {
        //bordes derecha e izquierda
        if (this.position.x < 0) {
            this.position.x = canvas.width-this.w
        } else if (this.position.x  > canvas.width-this.w) {
            this.position.x = 0
            
        }
        //bordes de arriba y abajo
        if (this.position.y < 0) {
            this.position.y = canvas.height-this.h
        } else if (this.position.y  > canvas.height-this.h) {
            this.position.y = 0
        }
    }

    move() {
        if (KEYS["ArrowLeft"]) {
            this.angle -= 0.08
        }

        if (KEYS["ArrowRight"]) {
            this.angle += 0.08
        }

        // acelerar hacia delante
        if (KEYS["ArrowUp"]) {

            this.velocity.x += Math.cos(this.angle - Math.PI / 2) * 0.4

            this.velocity.y += Math.sin(this.angle - Math.PI / 2) * 0.4
        }

        // retroceder
        if (KEYS["ArrowDown"]) {

            this.velocity.x -= Math.cos(this.angle - Math.PI / 2) * 0.2

            this.velocity.y -= Math.sin(this.angle - Math.PI / 2) * 0.2
        }

        // mover
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        // fricción
        this.velocity.x *= this.friction
        this.velocity.y *= this.friction

        this.Borders()
    }

    update() {
        this.draw()
        this.move()
    }

    draw() {
        if (!this.image.complete) return

        if (!this.image.complete) return

        ctx.save()

        // centro de la nave
        ctx.translate(
            this.position.x + this.w / 2,
            this.position.y + this.h / 2
        )

        // rotar
        ctx.rotate(this.angle)

        // dibujar centrado
        ctx.drawImage(
            this.image,
            -this.w / 2,
            -this.h / 2,
            this.w,
            this.h
        )

        ctx.restore()
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
};

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