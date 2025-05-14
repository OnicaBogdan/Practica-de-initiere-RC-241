const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 400;

const boxSize = 20;
let snake = [{ x: boxSize * 5, y: boxSize * 5 }];
let direction = "RIGHT";
let apple = {
  x: Math.floor(Math.random() * (canvas.width / boxSize)) * boxSize,
  y: Math.floor(Math.random() * (canvas.height / boxSize)) * boxSize,
};
let score = 0;
let gameInterval;
const restartButton = document.getElementById("restartButton");

document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
  if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
}

function drawSnake() {
  ctx.fillStyle = "lime";
  snake.forEach((segment) => {
    ctx.fillRect(segment.x, segment.y, boxSize, boxSize);
  });
}

function drawApple() {
  ctx.fillStyle = "red";
  ctx.fillRect(apple.x, apple.y, boxSize, boxSize);
}

function updateSnake() {
  const head = { ...snake[0] };

  if (direction === "UP") head.y -= boxSize;
  if (direction === "DOWN") head.y += boxSize;
  if (direction === "LEFT") head.x -= boxSize;
  if (direction === "RIGHT") head.x += boxSize;

  snake.unshift(head);

  if (head.x === apple.x && head.y === apple.y) {
    score++;
    document.getElementById("score").textContent = score;
    apple = {
      x: Math.floor(Math.random() * (canvas.width / boxSize)) * boxSize,
      y: Math.floor(Math.random() * (canvas.height / boxSize)) * boxSize,
    };
  } else {
    snake.pop();
  }
}

function checkCollision() {
  const head = snake[0];

  if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
    return true;
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }

  return false;
}

function gameOver() {
  clearInterval(gameInterval);
  alert("Game Over! Your score is " + score);
  restartButton.classList.remove("hidden");
}

function gameLoop() {
  if (checkCollision()) {
    gameOver();
    return;
  }
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawApple();
  updateSnake();
  drawSnake();
}

function restartGame() {
  snake = [{ x: boxSize * 5, y: boxSize * 5 }];
  direction = "RIGHT";
  score = 0;
  document.getElementById("score").textContent = score;
  apple = {
    x: Math.floor(Math.random() * (canvas.width / boxSize)) * boxSize,
    y: Math.floor(Math.random() * (canvas.height / boxSize)) * boxSize,
  };
  restartButton.classList.add("hidden");
  gameInterval = setInterval(gameLoop, 150);
}

restartButton.addEventListener("click", restartGame);


gameInterval = setInterval(gameLoop, 150);