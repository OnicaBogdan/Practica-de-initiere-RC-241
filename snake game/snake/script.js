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

// --- FUNCTIE NOUA: Deseneaza o portiune de sarpe cu texturi, ochi, gura ---
function drawSnakePart(segment, isHead = false, direction = "RIGHT") {
  // Corp: gradient + linii verticale
  let gradient = ctx.createLinearGradient(segment.x, segment.y, segment.x + boxSize, segment.y + boxSize);
  gradient.addColorStop(0, "#38ef7d");
  gradient.addColorStop(1, "#11998e");
  ctx.fillStyle = gradient;
  ctx.fillRect(segment.x, segment.y, boxSize, boxSize);

  // Linii de textura pe corp
  ctx.strokeStyle = "#0b6846";
  ctx.lineWidth = 1;
  for (let i = 3; i < boxSize; i += 4) {
    ctx.beginPath();
    ctx.moveTo(segment.x + i, segment.y);
    ctx.lineTo(segment.x + i, segment.y + boxSize);
    ctx.stroke();
  }

  // Capul: ochi + gura
  if(isHead) {
    ctx.save();
    // Ochi (poziție în funcție de direcție)
    ctx.fillStyle = "#222";
    if (direction === "UP" || direction === "DOWN") {
      ctx.beginPath();
      ctx.arc(segment.x + 6, segment.y + 6, 2, 0, 2 * Math.PI);
      ctx.arc(segment.x + boxSize - 6, segment.y + 6, 2, 0, 2 * Math.PI);
      ctx.fill();
    } else if (direction === "LEFT") {
      ctx.beginPath();
      ctx.arc(segment.x + 6, segment.y + 6, 2, 0, 2 * Math.PI);
      ctx.arc(segment.x + 6, segment.y + boxSize - 6, 2, 0, 2 * Math.PI);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(segment.x + boxSize - 6, segment.y + 6, 2, 0, 2 * Math.PI);
      ctx.arc(segment.x + boxSize - 6, segment.y + boxSize - 6, 2, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Gură (poziție în funcție de direcție)
    ctx.strokeStyle = "#222";
    ctx.lineWidth = 2;
    ctx.beginPath();
    if(direction === "UP") {
      ctx.arc(segment.x + boxSize/2, segment.y + 4, 4, 0, Math.PI, true);
    } else if(direction === "DOWN") {
      ctx.arc(segment.x + boxSize/2, segment.y + boxSize - 4, 4, 0, Math.PI, false);
    } else if(direction === "LEFT") {
      ctx.arc(segment.x + 4, segment.y + boxSize/2, 4, 1.5*Math.PI, 0.5*Math.PI, true);
    } else {
      ctx.arc(segment.x + boxSize - 4, segment.y + boxSize/2, 4, 0.5*Math.PI, 1.5*Math.PI, true);
    }
    ctx.stroke();
    ctx.restore();
  }
}

// --- FUNCTIE NOUA: Deseneaza mar rotund si cu highlight ---
function drawApple() {
  // Mar rotund (cerc)
  ctx.beginPath();
  ctx.arc(apple.x + boxSize / 2, apple.y + boxSize / 2, boxSize / 2 - 2, 0, 2 * Math.PI, false);
  ctx.fillStyle = "#e74c3c";
  ctx.fill();

  // Highlight
  ctx.beginPath();
  ctx.arc(apple.x + boxSize / 2 + 4, apple.y + boxSize / 2 - 4, 3, 0, 2 * Math.PI);
  ctx.fillStyle = "#fff";
  ctx.globalAlpha = 0.4;
  ctx.fill();
  ctx.globalAlpha = 1.0;

  // Codita
  ctx.beginPath();
  ctx.moveTo(apple.x + boxSize / 2, apple.y + boxSize / 2 - 8);
  ctx.lineTo(apple.x + boxSize / 2, apple.y + boxSize / 2 - 14);
  ctx.strokeStyle = "#874c26";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.lineWidth = 1;
}

// --- MODIFICAT: Desenare sarpe cu cap custom ---
function drawSnake() {
  snake.forEach((segment, idx) => {
    drawSnakePart(segment, idx === 0, direction);
  });
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