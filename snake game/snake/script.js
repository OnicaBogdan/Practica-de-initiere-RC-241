// === SNAKE.JS - efecte vizuale AAA, skinuri, sunete, imbunatatiri moderne ===

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 400;

const boxSize = 20;
window.snake = [{ x: boxSize * 5, y: boxSize * 5 }];
let direction = "RIGHT";
let nextDirection = "RIGHT";
window.apple = {
  x: Math.floor(Math.random() * (canvas.width / boxSize)) * boxSize,
  y: Math.floor(Math.random() * (canvas.height / boxSize)) * boxSize,
};
let score = 0;
let highScore = parseInt(localStorage.getItem('snake_highscore') || "0");
let gameInterval;
const restartButton = document.getElementById("restartButton");
const scoreSpan = document.getElementById("score");

const wallpapers = {
  nature: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
  desert: "https://th-thumbnailer.cdn-si-edu.com/XO85n-wBdWY7OfafJlEdjljqq_g=/1026x684/https://tf-cmsv2-smithsonianmag-media.s3.amazonaws.com/filer/f2/94/f294516b-db3d-4f7b-9a60-ca3cd5f3d9b2/fbby1h_1.jpg",
  ocean: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
};
const selectedWallpaper = localStorage.getItem("snake_wallpaper") || "nature";
const selectedSkin = localStorage.getItem("snake_skin") || "classic";
const selectedSpeed = parseInt(localStorage.getItem("snake_speed") || "120");

function setBg() {
  document.body.style.backgroundImage =
    `linear-gradient(rgba(40,50,70,0.55),rgba(30,34,39,0.64)),url('${wallpapers[selectedWallpaper]}')`;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundRepeat = "no-repeat";
  document.body.style.backgroundPosition = "center";
}
setBg();

function resizeCanvas() {
  let min = Math.min(window.innerWidth, window.innerHeight) - 80;
  min = Math.max(300, Math.min(480, min));
  canvas.width = min - (min % boxSize);
  canvas.height = min - (min % boxSize);
}
resizeCanvas();
window.addEventListener("resize", () => {
  resizeCanvas();
  window.apple.x = Math.min(window.apple.x, canvas.width - boxSize);
  window.apple.y = Math.min(window.apple.y, canvas.height - boxSize);
});

document.addEventListener("keydown", changeDirection);
function changeDirection(event) {
  if (
    (event.key === "ArrowUp" || event.key === "w") && direction !== "DOWN"
  ) nextDirection = "UP";
  if (
    (event.key === "ArrowDown" || event.key === "s") && direction !== "UP"
  ) nextDirection = "DOWN";
  if (
    (event.key === "ArrowLeft" || event.key === "a") && direction !== "RIGHT"
  ) nextDirection = "LEFT";
  if (
    (event.key === "ArrowRight" || event.key === "d") && direction !== "LEFT"
  ) nextDirection = "RIGHT";
  if (event.key === " " || event.key === "p") togglePause();
}

let touchStartX = null, touchStartY = null;
canvas.addEventListener("touchstart", e => {
  const t = e.touches[0];
  touchStartX = t.clientX;
  touchStartY = t.clientY;
}, { passive: true });
canvas.addEventListener("touchmove", e => {
  if (touchStartX === null || touchStartY === null) return;
  const t = e.touches[0];
  const dx = t.clientX - touchStartX;
  const dy = t.clientY - touchStartY;
  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 20 && direction !== "LEFT") nextDirection = "RIGHT";
    if (dx < -20 && direction !== "RIGHT") nextDirection = "LEFT";
  } else {
    if (dy > 20 && direction !== "UP") nextDirection = "DOWN";
    if (dy < -20 && direction !== "DOWN") nextDirection = "UP";
  }
  touchStartX = null; touchStartY = null;
}, { passive: true });

let appleAudio = new Audio("https://cdn.pixabay.com/audio/2022/10/16/audio_12cd1e2a2b.mp3");
let popAudio = new Audio("https://cdn.pixabay.com/audio/2022/07/26/audio_124bfa98a0.mp3");
let loseAudio = new Audio("https://cdn.pixabay.com/audio/2022/11/16/audio_125b6ebfd1.mp3");
appleAudio.volume = 0.22;
popAudio.volume = 0.17;
loseAudio.volume = 0.12;

let pulseEffectTimer = 0;
let appleGlowTimer = 0;
let particles = [];
let sparkles = [];
let lastTrail = 0;
let appleShockwave = 0;
let appleSpin = 0;
let applePulse = 0;
let bgParticles = [];

function drawSnakePart(segment, isHead = false, direction = "RIGHT") {
  let grad;
  if (selectedSkin === "classic") {
    grad = ctx.createLinearGradient(segment.x, segment.y, segment.x, segment.y + boxSize);
    grad.addColorStop(0, "#e2ffb7");
    grad.addColorStop(0.3, "#8bd65e");
    grad.addColorStop(0.7, "#3e7e2c");
    grad.addColorStop(1, "#24491a");
  } else if (selectedSkin === "blue") {
    grad = ctx.createLinearGradient(segment.x, segment.y, segment.x, segment.y + boxSize);
    grad.addColorStop(0, "#b7e7ff");
    grad.addColorStop(0.3, "#63b3e6");
    grad.addColorStop(0.7, "#215e85");
    grad.addColorStop(1, "#12374c");
  } else if (selectedSkin === "red") {
    grad = ctx.createLinearGradient(segment.x, segment.y, segment.x, segment.y + boxSize);
    grad.addColorStop(0, "#ffb7b7");
    grad.addColorStop(0.3, "#ff6262");
    grad.addColorStop(0.7, "#b21a1a");
    grad.addColorStop(1, "#6c1010");
  } else if (selectedSkin === "yellow") {
    grad = ctx.createLinearGradient(segment.x, segment.y, segment.x, segment.y + boxSize);
    grad.addColorStop(0, "#fff7b7");
    grad.addColorStop(0.3, "#ffe162");
    grad.addColorStop(0.7, "#e4c34c");
    grad.addColorStop(1, "#9a7f15");
  } else if (selectedSkin === "purple") {
    grad = ctx.createLinearGradient(segment.x, segment.y, segment.x, segment.y + boxSize);
    grad.addColorStop(0, "#e1cfff");
    grad.addColorStop(0.3, "#a07fe0");
    grad.addColorStop(0.7, "#6c3eb2");
    grad.addColorStop(1, "#3d2068");
  } else if (selectedSkin === "pink") {
    grad = ctx.createLinearGradient(segment.x, segment.y, segment.x, segment.y + boxSize);
    grad.addColorStop(0, "#ffd6f3");
    grad.addColorStop(0.3, "#ff7eb9");
    grad.addColorStop(0.7, "#ff3482");
    grad.addColorStop(1, "#c2185b");
  } else if (selectedSkin === "gold") {
    grad = ctx.createLinearGradient(segment.x, segment.y, segment.x, segment.y + boxSize);
    grad.addColorStop(0, "#fff7b7");
    grad.addColorStop(0.3, "#ffe162");
    grad.addColorStop(0.7, "#e4c34c");
    grad.addColorStop(1, "#9a7f15");
  } else if (selectedSkin === "black") {
    grad = ctx.createLinearGradient(segment.x, segment.y, segment.x, segment.y + boxSize);
    grad.addColorStop(0, "#bbb");
    grad.addColorStop(0.3, "#444");
    grad.addColorStop(0.7, "#222");
    grad.addColorStop(1, "#111");
  } else if (selectedSkin === "white") {
    grad = ctx.createLinearGradient(segment.x, segment.y, segment.x, segment.y + boxSize);
    grad.addColorStop(0, "#fff");
    grad.addColorStop(1, "#ccc");
  } else if (selectedSkin === "rainbow") {
    const rainbow = [
      "#FF3F3F", "#FF9C1A", "#FFF700", "#49FF00", "#00FFF7", "#006EFF", "#B200FF"
    ];
    let idx = ((segment.x / boxSize) + (segment.y / boxSize)) % rainbow.length;
    let color1 = rainbow[Math.floor(idx)];
    let color2 = rainbow[(Math.floor(idx) + 1) % rainbow.length];
    grad = ctx.createLinearGradient(segment.x, segment.y, segment.x, segment.y + boxSize);
    grad.addColorStop(0, color1);
    grad.addColorStop(1, color2);
  } else {
    grad = ctx.createLinearGradient(segment.x, segment.y, segment.x, segment.y + boxSize);
    grad.addColorStop(0, "#e2ffb7");
    grad.addColorStop(1, "#24491a");
  }

  ctx.save();
  ctx.globalAlpha = 0.28;
  ctx.beginPath();
  ctx.ellipse(segment.x + boxSize/2, segment.y + boxSize - 2, boxSize/2.3, boxSize/6, 0, 0, 2*Math.PI);
  ctx.fillStyle = "#211";
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.shadowColor = isHead ? "#fff" : grad;
  ctx.shadowBlur = isHead ? 28 : 10;
  ctx.beginPath();
  ctx.roundRect(segment.x, segment.y, boxSize, boxSize, 9);
  ctx.closePath();
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 7;
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(segment.x, segment.y, boxSize, boxSize, 9);
  ctx.shadowColor = grad;
  ctx.shadowBlur = 14;
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.restore();

  if(isHead && pulseEffectTimer > 0) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, pulseEffectTimer/10);
    ctx.beginPath();
    ctx.roundRect(segment.x-4, segment.y-4, boxSize+8, boxSize+8, 13);
    ctx.fillStyle = "#fff";
    ctx.shadowColor = grad;
    ctx.shadowBlur = 50 * (pulseEffectTimer/10);
    ctx.fill();
    ctx.globalAlpha = 1.0;
    ctx.restore();
  }
  if(isHead && Date.now() - lastTrail > 33) {
    particles.push({
      x: segment.x + boxSize/2,
      y: segment.y + boxSize/2,
      color: grad,
      alpha: 0.37,
      size: boxSize/2,
      life: 13
    });
    lastTrail = Date.now();
  }

  // Capul: ochi 3D și gură
  if(isHead) {
    ctx.save();
    ctx.beginPath();
    if (direction === "UP" || direction === "DOWN") {
      ctx.arc(segment.x + 7, segment.y + 8, 2, 0, 2 * Math.PI);
      ctx.arc(segment.x + boxSize - 7, segment.y + 8, 2, 0, 2 * Math.PI);
    } else if (direction === "LEFT") {
      ctx.arc(segment.x + 7, segment.y + 7, 2, 0, 2 * Math.PI);
      ctx.arc(segment.x + 7, segment.y + boxSize - 7, 2, 0, 2 * Math.PI);
    } else {
      ctx.arc(segment.x + boxSize - 7, segment.y + 7, 2, 0, 2 * Math.PI);
      ctx.arc(segment.x + boxSize - 7, segment.y + boxSize - 7, 2, 0, 2 * Math.PI);
    }
    ctx.fillStyle = "#fff";
    ctx.shadowColor = "#fff";
    ctx.shadowBlur = 4;
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.fillStyle = "#222";
    if (direction === "UP" || direction === "DOWN") {
      ctx.beginPath();
      ctx.arc(segment.x + 8, segment.y + 7, 0.9, 0, 2 * Math.PI);
      ctx.arc(segment.x + boxSize - 6, segment.y + 7, 0.9, 0, 2 * Math.PI);
      ctx.fill();
    } else if (direction === "LEFT") {
      ctx.beginPath();
      ctx.arc(segment.x + 8, segment.y + 8, 0.9, 0, 2 * Math.PI);
      ctx.arc(segment.x + 8, segment.y + boxSize - 6, 0.9, 0, 2 * Math.PI);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(segment.x + boxSize - 6, segment.y + 8, 0.9, 0, 2 * Math.PI);
      ctx.arc(segment.x + boxSize - 6, segment.y + boxSize - 6, 0.9, 0, 2 * Math.PI);
      ctx.fill();
    }

    ctx.strokeStyle = "#234e1b";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    if(direction === "UP") {
      ctx.arc(segment.x + boxSize/2, segment.y + 7, 4, 0.1 * Math.PI, 0.9 * Math.PI, true);
    } else if(direction === "DOWN") {
      ctx.arc(segment.x + boxSize/2, segment.y + boxSize - 7, 4, 1.1 * Math.PI, 1.9 * Math.PI, false);
    } else if(direction === "LEFT") {
      ctx.arc(segment.x + 7, segment.y + boxSize/2, 4, 1.5 * Math.PI, 0.5 * Math.PI, true);
    } else {
      ctx.arc(segment.x + boxSize - 7, segment.y + boxSize/2, 4, 0.5 * Math.PI, 1.5 * Math.PI, true);
    }
    ctx.stroke();
    ctx.restore();
  }
}

function drawParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    ctx.save();
    ctx.globalAlpha = p.alpha * (p.life/14);
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * (p.life/14), 0, 2 * Math.PI);
    ctx.fillStyle = typeof p.color === "string" ? p.color : "#fff";
    ctx.shadowColor = typeof p.color === "string" ? p.color : "#fff";
    ctx.shadowBlur = 12 + (p.life/2);
    ctx.fill();
    ctx.restore();
    p.life--;
    if (p.dx !== undefined) {
      p.x += p.dx;
      p.y += p.dy;
      p.alpha *= 0.97;
      p.size *= 0.98;
    }
    if (p.life <= 0) particles.splice(i,1);
  }
}

function drawSparkles() {
  for (let i = sparkles.length-1; i >= 0; i--) {
    const s = sparkles[i];
    ctx.save();
    ctx.globalAlpha = s.alpha;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size, 0, 2 * Math.PI);
    ctx.fillStyle = s.color;
    ctx.shadowColor = "#fff";
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.restore();
    s.life--;
    s.alpha *= 0.95;
    s.size *= 0.98;
    if (s.life <= 0) sparkles.splice(i,1);
  }
}

function drawBgParticles() {
  if (bgParticles.length < 70 && Math.random() < 0.2) {
    bgParticles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 0.5 + Math.random() * 1.8,
      alpha: 0.08 + 0.13 * Math.random(),
      vy: 0.15 + Math.random() * 0.2
    });
  }
  for (let i = bgParticles.length-1; i >= 0; i--) {
    const b = bgParticles[i];
    ctx.save();
    ctx.globalAlpha = b.alpha;
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, 2 * Math.PI);
    ctx.fillStyle = "#fff";
    ctx.shadowColor = "#fff";
    ctx.shadowBlur = 7;
    ctx.fill();
    ctx.restore();
    b.y += b.vy;
    if (b.y > canvas.height + 5) bgParticles.splice(i,1);
  }
}

function drawSnake() {
  drawParticles();
  window.snake.forEach((segment, idx) => {
    drawSnakePart(segment, idx === 0, direction);
  });
}

function drawApple() {
  ctx.save();
  ctx.globalAlpha = 0.27;
  ctx.beginPath();
  ctx.ellipse(window.apple.x + boxSize / 2, window.apple.y + boxSize - 3, boxSize/2.3, boxSize/6, 0, 0, 2 * Math.PI);
  ctx.fillStyle = "#111";
  ctx.fill();
  ctx.globalAlpha = 1.0;
  ctx.restore();

  if (appleShockwave > 0) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(window.apple.x + boxSize/2, window.apple.y + boxSize/2, boxSize/2 + appleShockwave*3, 0, 2*Math.PI);
    ctx.globalAlpha = 0.25 * (appleShockwave/15);
    ctx.strokeStyle = "rgba(255,255,0,0.6)";
    ctx.lineWidth = 4+appleShockwave;
    ctx.shadowColor = "#fff";
    ctx.shadowBlur = 18;
    ctx.stroke();
    ctx.restore();
    appleShockwave--;
  }

  if (appleGlowTimer > 0) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(window.apple.x + boxSize / 2, window.apple.y + boxSize / 2, boxSize / 2 + appleGlowTimer, 0, 2 * Math.PI);
    ctx.globalAlpha = 0.16 * (appleGlowTimer / 10);
    ctx.fillStyle = "#fff000";
    ctx.shadowColor = "#ff0";
    ctx.shadowBlur = 22 + 13 * (appleGlowTimer / 10);
    ctx.fill();
    ctx.restore();
  }

  applePulse += 0.18;
  appleSpin += 0.06;
  let pulseR = Math.abs(Math.sin(applePulse))*3;

  ctx.save();
  ctx.translate(window.apple.x + boxSize/2, window.apple.y + boxSize/2);
  ctx.rotate(Math.sin(appleSpin)/18);
  let appleGrad = ctx.createRadialGradient(
    -3, -7, 5,
    0, 0, boxSize/2 - 2 + pulseR
  );
  appleGrad.addColorStop(0, "#fff7");
  appleGrad.addColorStop(0.23, "#ffe0e0");
  appleGrad.addColorStop(0.45, "#fa6e6e");
  appleGrad.addColorStop(0.8, "#c0392b");
  appleGrad.addColorStop(1, "#7a2219");
  ctx.beginPath();
  ctx.arc(0, 0, boxSize / 2 - 2 + pulseR, 0, 2 * Math.PI, false);
  ctx.fillStyle = appleGrad;
  ctx.shadowColor = "#b41a1a";
  ctx.shadowBlur = 16;
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = 0.65;
  ctx.beginPath();
  ctx.ellipse(window.apple.x + boxSize / 2 - 4, window.apple.y + boxSize / 2 - 8, 5, 2, -0.6, 0, 2 * Math.PI);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.globalAlpha = 0.28;
  ctx.beginPath();
  ctx.ellipse(window.apple.x + boxSize / 2 + 3, window.apple.y + boxSize / 2 + 2, 2.2, 1, -0.2, 0, 2 * Math.PI);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.globalAlpha = 1.0;
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(window.apple.x + boxSize / 2, window.apple.y + boxSize / 2 - 8 - Math.sin(appleSpin)*2);
  ctx.lineTo(window.apple.x + boxSize / 2 + 2, window.apple.y + boxSize / 2 - 14 - Math.sin(appleSpin)*2);
  ctx.strokeStyle = "#795548";
  ctx.lineWidth = 2.6;
  ctx.shadowColor = "#222";
  ctx.shadowBlur = 2;
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.restore();

  drawSparkles();
}

function spawnAppleParticles(x, y, color) {
  for(let i=0;i<22;i++) {
    let angle = Math.random() * Math.PI * 2;
    let speed = 2.3 + Math.random()*2.7;
    particles.push({
      x: x,
      y: y,
      color: color,
      alpha: 0.9,
      size: 3+Math.random()*2,
      dx: Math.cos(angle)*speed,
      dy: Math.sin(angle)*speed,
      life: 22+Math.random()*16
    });
  }
  for(let i=0;i<16;i++) {
    let theta = Math.random() * Math.PI * 2;
    let r = 18 + Math.random()*10;
    sparkles.push({
      x: x + Math.cos(theta)*r,
      y: y + Math.sin(theta)*r,
      color: "#fff8a6",
      alpha: 0.85,
      size: 2+Math.random()*1.6,
      life: 12+Math.random()*13
    });
  }
}

function updateSnake() {
  direction = nextDirection;
  const head = { ...window.snake[0] };
  if (direction === "UP") head.y -= boxSize;
  if (direction === "DOWN") head.y += boxSize;
  if (direction === "LEFT") head.x -= boxSize;
  if (direction === "RIGHT") head.x += boxSize;

  // Coliziune cu obstacole
  if (window.obstacles && window.obstacles.some(o => o.x === head.x && o.y === head.y)) {
    loseAudio.play();
    gameOver();
    return;
  }

  window.snake.unshift(head);

  if (head.x === window.apple.x && head.y === window.apple.y) {
    score++;
    scoreSpan.textContent = score;
    spawnAppleParticles(window.apple.x + boxSize/2, window.apple.y + boxSize/2, "#ffe7a1");
    appleGlowTimer = 14;
    pulseEffectTimer = 12;
    appleShockwave = 15;
    appleSpin = 0;
    applePulse = 0;
    do {
      window.apple.x = Math.floor(Math.random() * (canvas.width / boxSize)) * boxSize;
      window.apple.y = Math.floor(Math.random() * (canvas.height / boxSize)) * boxSize;
    } while (
      window.snake.some(s=>s.x===window.apple.x&&s.y===window.apple.y) ||
      (window.obstacles && window.obstacles.some(o=>o.x===window.apple.x&&o.y===window.apple.y))
    );
    appleAudio.currentTime = 0; appleAudio.play();
    popAudio.currentTime = 0; setTimeout(()=>popAudio.play(), 40);
  } else {
    window.snake.pop();
  }
}

function checkCollision() {
  const head = window.snake[0];
  if (
    head.x < 0 || head.x >= canvas.width ||
    head.y < 0 || head.y >= canvas.height
  ) return true;
  for (let i = 1; i < window.snake.length; i++)
    if (head.x === window.snake[i].x && head.y === window.snake[i].y) return true;
  return false;
}

function gameOver() {
  clearInterval(gameInterval);
  loseAudio.play();
  ctx.save();
  ctx.globalAlpha = 0.7;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.globalAlpha = 1.0;
  ctx.restore();
  for(let i=0;i<40;i++) {
    let angle = Math.random() * Math.PI * 2;
    let speed = 1.7 + Math.random()*2.2;
    particles.push({
      x: canvas.width/2,
      y: canvas.height/2,
      color: "#111",
      alpha: 0.7,
      size: 3+Math.random()*2,
      dx: Math.cos(angle)*speed,
      dy: Math.sin(angle)*speed,
      life: 22+Math.random()*14
    });
  }
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('snake_highscore', highScore);
  }
  setTimeout(() => {
    alert(`Game Over!\nScore: ${score}\nHigh Score: ${highScore}`);
  }, 200);
}

let isPaused = false;
function togglePause() {
  if (!gameInterval) return;
  isPaused = !isPaused;
  if (isPaused) {
    clearInterval(gameInterval);
    document.getElementById("pauseBtn").classList.add("snake-btn-paused");
  } else {
    gameInterval = setInterval(gameLoop, selectedSpeed);
    document.getElementById("pauseBtn").classList.remove("snake-btn-paused");
  }
}

function gameLoop() {
  if (isPaused) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBgParticles();
  if (typeof window.drawObstacles === "function") window.drawObstacles();
  drawApple();
  updateSnake();
  drawSnake();
  drawParticles();
  if (appleGlowTimer > 0) appleGlowTimer--;
  if (pulseEffectTimer > 0) pulseEffectTimer--;
  if (checkCollision()) {
    gameOver();
    return;
  }
}

function restartGame() {
  window.snake = [{ x: boxSize * 5, y: boxSize * 5 }];
  direction = "RIGHT";
  nextDirection = "RIGHT";
  score = 0;
  scoreSpan.textContent = score;
  window.apple = {
    x: Math.floor(Math.random() * (canvas.width / boxSize)) * boxSize,
    y: Math.floor(Math.random() * (canvas.height / boxSize)) * boxSize,
  };
  if (window.obstacles) window.obstacles.length = 0;
  clearInterval(gameInterval);
  appleGlowTimer = 0;
  pulseEffectTimer = 0;
  appleShockwave = 0;
  appleSpin = 0;
  applePulse = 0;
  particles = [];
  sparkles = [];
  bgParticles = [];
  isPaused = false;
  resizeCanvas();
  gameInterval = setInterval(gameLoop, selectedSpeed);
}

document.getElementById("pauseBtn").addEventListener("click", togglePause);
document.getElementById("restartButton").addEventListener("click", restartGame);
document.getElementById("restartBtn").addEventListener("click", restartGame);

document.getElementById("clearScoreBtn")?.addEventListener("click", () => {
  highScore = 0;
  localStorage.setItem('snake_highscore', "0");
  let hiDiv = document.getElementById('highScore');
  if (hiDiv) hiDiv.textContent = `High Score: ${highScore}`;
  alert("High Score resetat!");
});

if (!document.getElementById('help-tip')) {
  const tip = document.createElement('div');
  tip.id = 'help-tip';
  tip.innerHTML = `
    <span style="background:#222a;padding:4px 15px;border-radius:11px;color:#fffbe7;font-size:1em;opacity:.88;box-shadow:0 1px 8px #0003;">
      Controls: <b>Arrows/WASD</b> or <b>Swipe</b>, <b>Space/P</b> = Pause
    </span>
  `;
  tip.style.cssText = "margin-top:10px;text-align:center;";
  document.querySelector('.score-board').appendChild(tip);
}

if (!document.getElementById('highScore')) {
  const hi = document.createElement('div');
  hi.id = 'highScore';
  hi.textContent = `High Score: ${highScore}`;
  hi.style.cssText = "margin-top:8px;font-size:1.1em;color:#fffd;text-align:center;text-shadow:0 2px 8px #000;";
  document.querySelector('.score-board').appendChild(hi);
}