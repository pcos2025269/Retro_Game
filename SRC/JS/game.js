const canvas = document.getElementById("gameCanvas");
document.body.appendChild(canvas);
canvas .width = innerWidth -4 ;
canvas.height = innerHeight -4 ;
const ctx = canvas.getContext("2d");

const drawBack = () => {
    ctx.fillStyle = "#323232";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

const update = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBack();
    requestAnimationFrame(update);
}


update();