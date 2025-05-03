const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreText = document.getElementById("score");
const bgMusic = document.getElementById("bgMusic");
const flapSound = document.getElementById("flapSound");
const hitSound = document.getElementById("hitSound");

const fishImage = new Image();
fishImage.src = "image/fish.png";

let fish = { x: 80, y: 200, radius: 20, velocity: 0 };
let gravity = 0.6;
let pipes = [];
let score = 0;
let gameRunning = false;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  fish.radius = canvas.height * 0.04; // 4% of screen height
}

function drawFish() {
  ctx.drawImage(fishImage, fish.x - fish.radius, fish.y - fish.radius, fish.radius * 2, fish.radius * 2);
}

function drawPipes() {
  ctx.fillStyle = "green";
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, canvas.width * 0.12, pipe.top);
    ctx.fillRect(pipe.x, pipe.top + 150, canvas.width * 0.12, canvas.height - pipe.top - 150);
  });
}

function detectCollision(pipe) {
  const inPipeX = fish.x + fish.radius > pipe.x && fish.x - fish.radius < pipe.x + canvas.width * 0.12;
  const hitPipe = fish.y - fish.radius < pipe.top || fish.y + fish.radius > pipe.top + 150;
  return inPipeX && hitPipe;
}

function gameLoop() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  fish.velocity += gravity;
  fish.y += fish.velocity;

  pipes.forEach(pipe => {
    pipe.x -= 2;
    if (pipe.x + canvas.width * 0.12 < 0) {
      pipe.x = canvas.width;
      pipe.top = Math.random() * 200 + 50;
      score++;
      scoreText.innerText = "Score: " + score;
    }
    if (detectCollision(pipe)) {
      endGame();
    }
  });

  if (fish.y + fish.radius > canvas.height || fish.y - fish.radius < 0) {
    endGame();
  }

  drawFish();
  drawPipes();
  requestAnimationFrame(gameLoop);
}

function startGame() {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("gameOverScreen").style.display = "none";
  score = 0;
  pipes = [
    { x: 400, top: Math.random() * 200 + 50 },
    { x: 700, top: Math.random() * 200 + 50 }
  ];
  fish.y = 200;
  fish.velocity = 0;
  scoreText.innerText = "Score: 0";
  gameRunning = true;
  bgMusic.play();
  gameLoop();
}

function flap() {
  if (!gameRunning) return;
  fish.velocity = -10;
  flapSound.play();
}

function endGame() {
  gameRunning = false;
  hitSound.play();
  bgMusic.pause();
  bgMusic.currentTime = 0;
  document.getElementById("finalScore").innerText = score;
  document.getElementById("gameOverScreen").style.display = "block";
}

function restartGame() {
  startGame();
}

document.addEventListener("keydown", e => {
  if (e.code === "Space") flap();
});
canvas.addEventListener("click", flap);

// Internet status detection
function checkOnline() {
  const offline = !navigator.onLine;
  document.getElementById("offline-warning").style.display = offline ? "block" : "none";
}
window.addEventListener("online", checkOnline);
window.addEventListener("offline", checkOnline);
checkOnline();

// Resize canvas on window resize
window.addEventListener("resize", resizeCanvas);

// Initial resize
resizeCanvas();
