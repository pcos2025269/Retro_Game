const canvas = document.getElementById("gameCanvas");
document.body.appendChild(canvas);
canvas .width = innerWidth -4 ;
canvas.height = innerHeight -4 ;
const ctx = canvas.getContext("2d");


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
    ctx.fillStyle = "#323232";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    stars(25);
}

const update = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBack();
    requestAnimationFrame(update);
}


update();