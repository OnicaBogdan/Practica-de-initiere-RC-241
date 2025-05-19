// === SNAKE.JS - efecte vizuale AAA & sunete, vizualuri complete ===

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

const wallpapers = {
  nature: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
  desert: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
  ocean: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
};
const selectedWallpaper = localStorage.getItem("snake_wallpaper") || "nature";
const selectedSkin = localStorage.getItem("snake_skin") || "classic";
const selectedSpeed = parseInt(localStorage.getItem("snake_speed") || "120");

document.body.style.backgroundImage = `url('${wallpapers[selectedWallpaper]}')`;
document.body.style.backgroundSize = "cover";
document.body.style.backgroundRepeat = "no-repeat";
document.body.style.backgroundPosition = "center";

document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
  if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
}

// ========== SUNETE ==========
let appleAudio = new Audio("https://cdn.pixabay.com/audio/2022/10/16/audio_12cd1e2a2b.mp3");
let popAudio = new Audio("https://cdn.pixabay.com/audio/2022/07/26/audio_124bfa98a0.mp3");
appleAudio.volume = 0.22;
popAudio.volume = 0.17;

// ========== EFECTE AAA ==========
let pulseEffectTimer = 0;
let appleGlowTimer = 0;
let particles = [];
let sparkles = [];
let lastTrail = 0;
let appleShockwave = 0;
let appleSpin = 0;
let applePulse = 0;

// --- BACKGROUND PARTICLES (optional, detalii vizuale extra) ---
let bgParticles = [];
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

// --- SNAKE 3D/AAA ---
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

  // Umbra sub segment (efect 3D)
  ctx.save();
  ctx.globalAlpha = 0.28;
  ctx.beginPath();
  ctx.ellipse(segment.x + boxSize/2, segment.y + boxSize - 2, boxSize/2.3, boxSize/6, 0, 0, 2*Math.PI);
  ctx.fillStyle = "#211";
  ctx.fill();
  ctx.restore();

  // Glow/contur colorat pentru fiecare segment
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

  // Segment 3D
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(segment.x, segment.y, boxSize, boxSize, 9);
  ctx.shadowColor = grad;
  ctx.shadowBlur = 14;
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.restore();

  // Reflexii și highlight-uri
  ctx.save();
  ctx.globalAlpha = 0.7;
  ctx.beginPath();
  ctx.moveTo(segment.x + 5, segment.y + 5);
  ctx.quadraticCurveTo(segment.x + boxSize/2, segment.y + 2, segment.x + boxSize - 5, segment.y + 5);
  ctx.lineWidth = 2.2;
  ctx.strokeStyle = "rgba(255,255,255,0.52)";
  ctx.stroke();
  ctx.globalAlpha = 1.0;
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = 0.22;
  ctx.beginPath();
  ctx.moveTo(segment.x + 6, segment.y + boxSize - 6);
  ctx.quadraticCurveTo(segment.x + boxSize/2, segment.y + boxSize - 2, segment.x + boxSize - 6, segment.y + boxSize - 6);
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = "rgba(255,255,255,0.52)";
  ctx.stroke();
  ctx.globalAlpha = 1.0;
  ctx.restore();

  // Solzi 3D (subtil)
  ctx.save();
  ctx.globalAlpha = 0.17;
  ctx.fillStyle = "#fff";
  for(let i=0; i<2; i++) for(let j=0; j<2; j++) {
    ctx.beginPath();
    ctx.arc(segment.x + 7 + i*6, segment.y + 7 + j*6, 2, 0, 2 * Math.PI);
    ctx.fill();
  }
  ctx.globalAlpha = 1.0;
  ctx.restore();

  // Pulse efect pe cap
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

  // Trail luminos
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

// --- PARTICULE & SPARKLES ---
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

// Sparkles pentru efect magic la mar
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

// --- Desenează tot șarpele ---
function drawSnake() {
  drawParticles();
  snake.forEach((segment, idx) => {
    drawSnakePart(segment, idx === 0, direction);
  });
}

// --- MARUL 3D, cu efecte AAA: highlight, glow, shockwave, sparkle, particule, animatii ---
function drawApple() {
  // Umbra sub măr
  ctx.save();
  ctx.globalAlpha = 0.27;
  ctx.beginPath();
  ctx.ellipse(apple.x + boxSize / 2, apple.y + boxSize - 3, boxSize/2.3, boxSize/6, 0, 0, 2 * Math.PI);
  ctx.fillStyle = "#111";
  ctx.fill();
  ctx.globalAlpha = 1.0;
  ctx.restore();

  // Shockwave radial când mărul e mâncat
  if (appleShockwave > 0) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(apple.x + boxSize/2, apple.y + boxSize/2, boxSize/2 + appleShockwave*3, 0, 2*Math.PI);
    ctx.globalAlpha = 0.25 * (appleShockwave/15);
    ctx.strokeStyle = "rgba(255,255,0,0.6)";
    ctx.lineWidth = 4+appleShockwave;
    ctx.shadowColor = "#fff";
    ctx.shadowBlur = 18;
    ctx.stroke();
    ctx.restore();
    appleShockwave--;
  }

  // Glow când mărul a fost mâncat recent
  if (appleGlowTimer > 0) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(apple.x + boxSize / 2, apple.y + boxSize / 2, boxSize / 2 + appleGlowTimer, 0, 2 * Math.PI);
    ctx.globalAlpha = 0.16 * (appleGlowTimer / 10);
    ctx.fillStyle = "#fff000";
    ctx.shadowColor = "#ff0";
    ctx.shadowBlur = 22 + 13 * (appleGlowTimer / 10);
    ctx.fill();
    ctx.restore();
  }

  // Pulse și spin la mar (vizual de tip "AAA")
  applePulse += 0.18;
  appleSpin += 0.06;
  let pulseR = Math.abs(Math.sin(applePulse))*3;

  // Corp măr (3D cu gradient detaliat) + pulsare și rotire
  ctx.save();
  ctx.translate(apple.x + boxSize/2, apple.y + boxSize/2);
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

  // Reflexii multiple
  ctx.save();
  ctx.globalAlpha = 0.65;
  ctx.beginPath();
  ctx.ellipse(apple.x + boxSize / 2 - 4, apple.y + boxSize / 2 - 8, 5, 2, -0.6, 0, 2 * Math.PI);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.globalAlpha = 0.28;
  ctx.beginPath();
  ctx.ellipse(apple.x + boxSize / 2 + 3, apple.y + boxSize / 2 + 2, 2.2, 1, -0.2, 0, 2 * Math.PI);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.globalAlpha = 1.0;
  ctx.restore();

  // Codiță 3D animată
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(apple.x + boxSize / 2, apple.y + boxSize / 2 - 8 - Math.sin(appleSpin)*2);
  ctx.lineTo(apple.x + boxSize / 2 + 2, apple.y + boxSize / 2 - 14 - Math.sin(appleSpin)*2);
  ctx.strokeStyle = "#795548";
  ctx.lineWidth = 2.6;
  ctx.shadowColor = "#222";
  ctx.shadowBlur = 2;
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.restore();

  // Sparkles magice în jurul mărului
  drawSparkles();
}

// --- Particule la mâncare (explozie) ---
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
  // Sparkles magice
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

// --- Update snake logic ---
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
    spawnAppleParticles(apple.x + boxSize/2, apple.y + boxSize/2, "#ffe7a1");
    appleGlowTimer = 14;
    pulseEffectTimer = 12;
    appleShockwave = 15;
    appleSpin = 0;
    applePulse = 0;
    apple = {
      x: Math.floor(Math.random() * (canvas.width / boxSize)) * boxSize,
      y: Math.floor(Math.random() * (canvas.height / boxSize)) * boxSize,
    };
    appleAudio.currentTime = 0; appleAudio.play();
    popAudio.currentTime = 0; setTimeout(()=>popAudio.play(), 40);
  } else {
    snake.pop();
  }
}

// --- Collision detection ---
function checkCollision() {
  const head = snake[0];
  if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) return true;
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) return true;
  }
  return false;
}

// --- Game over handler ---
function gameOver() {
  clearInterval(gameInterval);
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
  alert("Game Over! Your score is " + score);
  restartButton.classList.remove("hidden");
}

// --- Main game loop ---
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBgParticles();
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

// --- Restart logic ---
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
  clearInterval(gameInterval);
  appleGlowTimer = 0;
  pulseEffectTimer = 0;
  appleShockwave = 0;
  appleSpin = 0;
  applePulse = 0;
  particles = [];
  sparkles = [];
  bgParticles = [];
  gameInterval = setInterval(gameLoop, selectedSpeed);
}

restartButton.addEventListener("click", restartGame);

// --- Start game ---
gameInterval = setInterval(gameLoop, selectedSpeed);