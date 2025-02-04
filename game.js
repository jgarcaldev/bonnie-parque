// Obtén el canvas y el contexto para dibujar
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Tamaño del jugador y objetos
const playerWidth = 100; // Ajusta el tamaño del perro salchicha
const playerHeight = 40; // Ajusta el tamaño del perro salchicha
const objectWidth = 50;  // Ajusta el tamaño de la salchicha
const objectHeight = 20; // Ajusta el tamaño de la salchicha

// Variables del juego
let playerX = canvas.width / 2 - playerWidth / 2;
let playerY = canvas.height - playerHeight - 10;
let playerSpeed = 5;

let objects = [];
let score = 0;
let gameOver = false;

// Movimiento del jugador
let moveLeft = false;
let moveRight = false;

// Cargar las imágenes del perro salchicha (mirando a la derecha y a la izquierda)
const dogImageRight = new Image();
dogImageRight.src = 'bonnie_right.png'; // Imagen del perro mirando a la derecha

const dogImageLeft = new Image();
dogImageLeft.src = 'bonnie_left.png'; // Imagen del perro mirando a la izquierda

let currentDogImage = dogImageRight; // Inicialmente mirando a la derecha

// Cargar la imagen de la salchicha
const sausageImage = new Image();
sausageImage.src = 'sausage.png'; // Imagen de la salchicha que caerá

// Función para mover al jugador
function movePlayer() {
    if (moveLeft && playerX > 0) {
        playerX -= playerSpeed;
        currentDogImage = dogImageLeft; // Cambiar la imagen a la izquierda
    }
    if (moveRight && playerX < canvas.width - playerWidth) {
        playerX += playerSpeed;
        currentDogImage = dogImageRight; // Cambiar la imagen a la derecha
    }
}

// Generar objetos que caen (salchichas)
function generateObject() {
    const x = Math.random() * (canvas.width - objectWidth);
    objects.push({
        x: x,
        y: 0,
        speed: 3 + Math.random() * 2 // Velocidad aleatoria
    });
}

// Dibujar el jugador (usando la imagen del perro salchicha)
function drawPlayer() {
    ctx.drawImage(currentDogImage, playerX, playerY, playerWidth, playerHeight);
}

// Dibujar los objetos (salchichas)
function drawObjects() {
    objects.forEach((obj, index) => {
        // Dibujar la salchicha
        ctx.drawImage(sausageImage, obj.x, obj.y, objectWidth, objectHeight);
        obj.y += obj.speed;

        // Detectar colisiones
        if (
            obj.y + objectHeight > playerY &&
            obj.y < playerY + playerHeight &&
            obj.x + objectWidth > playerX &&
            obj.x < playerX + playerWidth
        ) {
            // Se ha recogido la salchicha
            objects.splice(index, 1);
            score += 10;
        }

        // La salchicha se ha caído sin ser recogida
        if (obj.y > canvas.height) {
            objects.splice(index, 1);
            score -= 5; // Penalización
        }
    });
}

// Dibujar el puntaje
function drawScore() {
    ctx.fillStyle = '#000';
    ctx.font = '20px Arial';
    ctx.fillText('Puntaje: ' + score, 10, 30);
}

// Función de actualización del juego
function update() {
    if (gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#000';
        ctx.font = '30px Arial';
        ctx.fillText('Juego Terminado', canvas.width / 2 - 120, canvas.height / 2);
        ctx.fillText('Puntaje final: ' + score, canvas.width / 2 - 120, canvas.height / 2 + 40);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    movePlayer();
    drawPlayer();
    drawObjects();
    drawScore();

    // Generar salchichas aleatorias
    if (Math.random() < 0.02) {
        generateObject();
    }

    requestAnimationFrame(update);
}

// Detectar las teclas presionadas
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') moveLeft = true;
    if (e.key === 'ArrowRight') moveRight = true;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') moveLeft = false;
    if (e.key === 'ArrowRight') moveRight = false;
});

// Iniciar el juego cuando las imágenes estén cargadas
dogImageRight.onload = () => {
    dogImageLeft.onload = () => {
        sausageImage.onload = () => {
            update();
        };
    };
};
