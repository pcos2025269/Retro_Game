const canvas = document.getElementById("space")
const ctx = canvas.getContext("2d")

canvas.width = innerWidth
canvas.height = innerHeight

const stars = []

function generateStars(amount = 120){
    stars.length = 0

    for(let i = 0; i < amount; i++){
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 1,
            alpha: Math.random()
        })
    }
}

function drawStars(){
    stars.forEach(star => {

        ctx.fillStyle = `rgba(210,180,140,${star.alpha})`

        ctx.fillRect(star.x, star.y, star.size, star.size * 2)

        ctx.fillRect(
            star.x - 1,
            star.y + 1,
            star.size * 2,
            star.size
        )
    })
}

const asteroids = []

function generateAsteroids(amount = 12){

    asteroids.length = 0

    for(let i = 0; i < amount; i++){

        asteroids.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,

            radius: Math.random() * 60 + 25,

            speedX: (Math.random() - 0.5) * 0.7,
            speedY: (Math.random() - 0.5) * 0.7,

            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.01,

            vertices: 10,

            offsets: Array.from(
                { length: 10 },
                () => 0.7 + Math.random() * 0.5
            )
        })
    }
}

function drawAsteroid(ast){

    ctx.save()

    ctx.translate(ast.x, ast.y)
    ctx.rotate(ast.rotation)

    ctx.beginPath()

    for(let i = 0; i < ast.vertices; i++){

        const angle = (i / ast.vertices) * Math.PI * 2

        const radius = ast.radius * ast.offsets[i]

        const px = Math.cos(angle) * radius
        const py = Math.sin(angle) * radius

        if(i === 0){
            ctx.moveTo(px, py)
        }else{
            ctx.lineTo(px, py)
        }
    }

    ctx.closePath()

    ctx.shadowColor = "#2d1b12"
    ctx.shadowBlur = 20

    ctx.fillStyle = "rgba(121, 85, 61, 0.45)"
    ctx.fill()

    ctx.strokeStyle = "#8B5E3C"
    ctx.lineWidth = 3
    ctx.stroke()

    ctx.restore()
}

function updateAsteroids(){

    asteroids.forEach(ast => {

        ast.x += ast.speedX
        ast.y += ast.speedY

        ast.rotation += ast.rotationSpeed

        if(ast.x < -100) ast.x = canvas.width + 100
        if(ast.x > canvas.width + 100) ast.x = -100

        if(ast.y < -100) ast.y = canvas.height + 100
        if(ast.y > canvas.height + 100) ast.y = -100

        drawAsteroid(ast)
    })
}

function drawBackground(){

    const gradient = ctx.createLinearGradient(
        0,0,
        canvas.width,
        canvas.height
    )

    gradient.addColorStop(0, "#242323")
    gradient.addColorStop(1, "#020201")

    ctx.fillStyle = gradient
    ctx.fillRect(0,0,canvas.width,canvas.height)

    drawStars()
}

function animate(){

    ctx.clearRect(0,0,canvas.width,canvas.height)

    drawBackground()

    updateAsteroids()

    requestAnimationFrame(animate)
}

generateStars()
generateAsteroids()
animate()

addEventListener("resize", () => {

    canvas.width = innerWidth
    canvas.height = innerHeight

    generateStars()
    generateAsteroids()
})