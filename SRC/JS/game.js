const canvas = document.getElementById("gameCanvas");
document.body.appendChild(canvas);
canvas .width = innerWidth -4 ;
canvas.height = innerHeight -4 ;
const ctx = canvas.getContext("2d");


class Ship {
    constructor() {

        this.position = {
            x: canvas.width / 2,
            y: canvas.height / 2,
        }
        this.w = 45;
        this.h = 35;

        
        this.image = new Image();
        this.image.src = "SRC/IMG/ship.png";
        this.image.onload = this.draw;
        this.angle = 0;
    }

    draw() {

        if (!this.image) return;

        ctx.drawImage(this.image, this.position.x, this.position.y, this.w, this.h);
    }

}

const ship = new Ship();

const stars = (number = 100) => {
    for (let i = 0; i < number; i++) {
        let x = Math.floor(Math.random() * canvas.width);
        let y = Math.floor(Math.random() * canvas.height);
        ctx.fillStyle = "white";
        ctx.fillRect(x, y, 2, 4);
        ctx.fillRect(--x, ++y, 4, 2);
    }
};

const drawBack = () => {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    stars(25);
}

const update = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBack();
    ship.draw();
    requestAnimationFrame(update);
}




update();