const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const startScreen = document.getElementById('startScreen');
const startButton = document.getElementById('startButton');
const birdImg = document.getElementById('birdImg');

// Configura a força do pulo
const jumpStrength = -8;

// Carrega as imagens dos canos
const canoBottom = new Image();
canoBottom.src = 'canoBottom.png'; // Certifique-se de que o caminho para a imagem esteja correto

const canoTop = new Image();
canoTop.src = 'canoTop.png'; // Certifique-se de que o caminho para a imagem esteja correto

// Objeto bird que representa o pássaro no jogo
const bird = {
    x: 50,
    y: 150,
    width: 40, // Largura 
    height: 40, // Altura
    gravity: 0.6,
    lift: jumpStrength,
    velocity: 0,
    // Atualiza a posição do pássaro baseado na gravidade e velocidade
    update() {
        this.velocity += this.gravity;
        this.y += this.velocity;
        // Verifica se o pássaro toca o chão ou o topo do canvas
        if (this.y + this.height > canvas.height) {
            this.y = canvas.height - this.height;
            this.velocity = 0;
        }
        if (this.y < 0) {
            this.y = 0;
            this.velocity = 0;
        }
    },
    // Faz o pássaro pular
    flap() {
        this.velocity = this.lift;
    }
};

// Define as dimensões do canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    bird.width = canvas.width * 0.05;
    bird.height = canvas.height * 0.05;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Array para armazenar os canos
const pipes = [];
const pipeWidth = 52; // Largura do cano ajustada para o tamanho da imagem
const pipeGap = 150; // Gap entre os canos superior e inferior (aumentado)
let frame = 0;
let gameStarted = false;

// Função para adicionar um novo cano ao jogo
function addPipe() {
    const pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap));
    pipes.push({
        x: canvas.width,
        y: pipeHeight,
        width: pipeWidth,
        height: pipeHeight
    });
}

// Atualiza a posição dos canos
function updatePipes() {
    pipes.forEach(pipe => {
        pipe.x -= 2;
        // Remove o cano do array se ele sair da tela
        if (pipe.x + pipe.width < 0) {
            pipes.shift();
        }
    });
    // Adiciona um novo cano a cada 120 frames (aumentado)
    if (frame % 120 === 0) {
        addPipe();
    }
}

// Desenha os canos no canvas
function drawPipes() {
    pipes.forEach(pipe => {
        // Desenha o cano superior
        context.drawImage(canoTop, pipe.x, pipe.y - canoTop.height, pipe.width, canoTop.height);
        // Desenha o cano inferior
        context.drawImage(canoBottom, pipe.x, pipe.y + pipeGap, pipe.width, canvas.height - pipe.y - pipeGap);
    });
}

// Verifica se o pássaro colide com os canos
function checkCollision() {
    pipes.forEach(pipe => {
        if (bird.x < pipe.x + pipe.width &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.y || bird.y + bird.height > pipe.y + pipeGap)) {
            resetGame();
        }
    });
}

// Reseta o jogo para o estado inicial
function resetGame() {
    bird.y = 150;
    bird.velocity = 0;
    pipes.length = 0;
    frame = 0;
    gameStarted = false;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = "20px Arial";
    context.fillStyle = "#fff";
    context.fillText("Pressione Espaço para Iniciar", canvas.width / 2 - 100, canvas.height / 2);
    startScreen.style.display = 'flex';
    birdImg.style.display = 'none';
}

// Loop principal do jogo
function gameLoop() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (gameStarted) {
        bird.update();
        birdImg.style.left = bird.x + 'px';
        birdImg.style.top = bird.y + 'px';
        updatePipes();
        drawPipes();
        checkCollision();
        frame++;
    } else {
        context.font = "20px Arial";
        context.fillStyle = "#fff";
        context.fillText("Pressione Espaço para Iniciar", canvas.width / 2 - 100, canvas.height / 2);
    }
    requestAnimationFrame(gameLoop);
}

// Evento para iniciar o jogo ao pressionar a tecla Espaço
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        if (!gameStarted) {
            gameStarted = true;
            pipes.length = 0;
            frame = 0;
            bird.y = 150;
            bird.velocity = 0;
            startScreen.style.display = 'none';
            birdImg.style.display = 'block';
        }
        bird.flap();
    }
});

// Evento para iniciar o jogo ao clicar no botão de iniciar
startButton.addEventListener('click', () => {
    if (!gameStarted) {
        gameStarted = true;
        pipes.length = 0;
        frame = 0;
        bird.y = 150;
        bird.velocity = 0;
        startScreen.style.display = 'none';
        birdImg.style.display = 'block';
    }
    bird.flap();
});

// Inicia o loop do jogo
gameLoop();
