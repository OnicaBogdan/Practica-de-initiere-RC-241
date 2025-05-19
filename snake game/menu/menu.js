// Wallpaper logic
const wallpapers = {
    nature: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    desert: "https://th-thumbnailer.cdn-si-edu.com/XO85n-wBdWY7OfafJlEdjljqq_g=/1026x684/https://tf-cmsv2-smithsonianmag-media.s3.amazonaws.com/filer/f2/94/f294516b-db3d-4f7b-9a60-ca3cd5f3d9b2/fbby1h_1.jpg",
    ocean: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
};

function applyWallpaper(name) {
    document.body.style.backgroundImage = `
      linear-gradient(120deg, #0f2027 0%, #43cea2 100%),
      url('${wallpapers[name]}'),
      url('https://www.transparenttextures.com/patterns/dark-mosaic.png')
    `;
    document.body.style.backgroundSize = "cover, cover, auto";
    document.body.style.backgroundRepeat = "no-repeat, no-repeat, repeat";
    document.body.style.backgroundAttachment = "fixed, fixed, fixed";
}

function updateWallpaperPreview(value) {
    document.getElementById("previewImg").src = wallpapers[value];
}

// Live preview on select change or hover
const wallpaperSelect = document.getElementById("wallpaperSelect");
wallpaperSelect.addEventListener("change", function(e) {
    localStorage.setItem("snake_wallpaper", e.target.value);
    applyWallpaper(e.target.value);
    updateWallpaperPreview(e.target.value);
});
wallpaperSelect.addEventListener("input", function(e) { // For "live" on some browsers
    updateWallpaperPreview(wallpaperSelect.value);
});
wallpaperSelect.addEventListener("focus", function(e) {
    updateWallpaperPreview(wallpaperSelect.value);
});
wallpaperSelect.addEventListener("mousemove", function(e) {
    updateWallpaperPreview(wallpaperSelect.value);
});

document.getElementById("snakeSkinSelect").addEventListener("change", function(e) {
    localStorage.setItem("snake_skin", e.target.value);
});

document.getElementById("speedSelect").addEventListener("change", function(e) {
    localStorage.setItem("snake_speed", e.target.value);
});

window.addEventListener("DOMContentLoaded", () => {
    // Wallpaper
    const wp = localStorage.getItem("snake_wallpaper") || "nature";
    document.getElementById("wallpaperSelect").value = wp;
    applyWallpaper(wp);
    updateWallpaperPreview(wp);

    // Snake skin
    const skin = localStorage.getItem("snake_skin") || "classic";
    document.getElementById("snakeSkinSelect").value = skin;

    // Speed
    const speed = localStorage.getItem("snake_speed") || "200";
    document.getElementById("speedSelect").value = speed;

    // Animate menu entrance
    const menu = document.querySelector('.menu-container');
    menu.classList.add('menu-animate-in');

    // --- CONSTANT FLOATING ANIMATION: subtle menu floating ---
    setTimeout(() => {
        let t = 0;
        function floatMenu() {
            t += 0.016;
            // Plutire pe o traiectorie eliptică, smooth, modern
            const x = Math.sin(t * 0.7) * 16;
            const y = Math.cos(t * 0.48) * 11;
            menu.style.transform = `translate(${x}px, ${y}px) scale(1.013)`;
            // Pulse-glow cu umbră
            const baseShadow = "0 18px 80px 0 rgba(67,206,162,0.17), 0 2px 80px #185a9d33";
            const pulseGlow = `0 0 ${(18 + 8*Math.sin(t*1.25))}px 8px #43cea2a6`;
            menu.style.boxShadow = `${baseShadow}, ${pulseGlow}`;
            requestAnimationFrame(floatMenu);
        }
        floatMenu();
    }, 1200);

    // Add sparkle effects to menu border
    addMenuSparkles();
});

document.getElementById("startBtn").onclick = function() {
    window.location.href = "../snake/index.html";
}

// --- Double Snake Animation Around Menu ---
function animateSnakeAroundMenu(canvasId, color1="#43cea2", color2="#185a9d", phase=0) {
    const snakeCanvas = document.getElementById(canvasId);
    if (snakeCanvas) {
        function resizeSnakeCanvas() {
            snakeCanvas.width = window.innerWidth;
            snakeCanvas.height = window.innerHeight;
        }
        resizeSnakeCanvas();
        window.addEventListener('resize', resizeSnakeCanvas);

        const ctx = snakeCanvas.getContext('2d');
        let step = 0;
        let snakeLen = 32;
        function drawSnakeLoop() {
            ctx.clearRect(0,0,snakeCanvas.width,snakeCanvas.height);
            const menu = document.querySelector('.menu-container');
            if (!menu) return;
            const mrect = menu.getBoundingClientRect();
            const r = 36, spacing = 5;
            const speed = 2.1;
            // Build the path (rounded rect)
            let path = [];
            let w = mrect.width, h = mrect.height, x = mrect.left, y = mrect.top;
            for(let i=0;i<w-2*r;i+=spacing) path.push({x:x+r+i, y:y});
            for(let a=0;a<=Math.PI/2;a+=0.08) path.push({x:x+w-r + Math.cos(a)*r, y:y+r + Math.sin(a)*r});
            for(let i=0;i<h-2*r;i+=spacing) path.push({x:x+w, y:y+r+i});
            for(let a=Math.PI/2;a<=Math.PI;a+=0.08) path.push({x:x+w-r + Math.cos(a)*r, y:y+h-r + Math.sin(a)*r});
            for(let i=0;i<w-2*r;i+=spacing) path.push({x:x+w-r-i, y:y+h});
            for(let a=Math.PI;a<=3*Math.PI/2;a+=0.08) path.push({x:x+r + Math.cos(a)*r, y:y+h-r + Math.sin(a)*r});
            for(let i=0;i<h-2*r;i+=spacing) path.push({x:x, y:y+h-r-i});
            for(let a=3*Math.PI/2;a<=2*Math.PI+0.01;a+=0.08) path.push({x:x+r + Math.cos(a)*r, y:y+r + Math.sin(a)*r});
            let pathLen = path.length;
            let headIdx = Math.floor((step*speed+phase)%pathLen);
            for(let i=snakeLen-1;i>=0;i--){
                let idx = (headIdx-i+pathLen)%pathLen;
                let p = path[idx];
                let size = 13 + 8*Math.sin((step-i)*0.21+phase*0.02);
                ctx.save();
                ctx.beginPath();
                ctx.arc(p.x, p.y, size, 0, 2*Math.PI, false);
                let grad = ctx.createRadialGradient(p.x,p.y,2,p.x,p.y,size);
                grad.addColorStop(0, "#fffbe9");
                grad.addColorStop(0.4, color1);
                grad.addColorStop(1, color2);
                ctx.fillStyle = grad;
                ctx.shadowColor = color1;
                ctx.shadowBlur = 18 - i*0.5;
                ctx.globalAlpha = 0.93 - i*0.028;
                ctx.fill();
                // Ochi pe cap
                if(i==0){
                    ctx.shadowBlur = 0;
                    ctx.globalAlpha = 1.0;
                    ctx.beginPath();
                    ctx.arc(p.x+4, p.y-3, 2, 0, 2*Math.PI, false);
                    ctx.fillStyle = "#fff";
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(p.x+4, p.y-3, 0.7, 0, 2*Math.PI, false);
                    ctx.fillStyle = "#222";
                    ctx.fill();
                }
                ctx.restore();
            }
            step++;
            requestAnimationFrame(drawSnakeLoop);
        }
        drawSnakeLoop();
    }
}

// Use the same path, but second snake is always phase-shifted by 50%
window.addEventListener("DOMContentLoaded", () => {
    animateSnakeAroundMenu("snakeAnimBg1", "#43cea2", "#185a9d", 0);
    animateSnakeAroundMenu("snakeAnimBg2", "#ea7dff", "#fff200", 90);
});

// --- Extra: Sparkle animation on menu border ---
function addMenuSparkles() {
    const menu = document.querySelector('.menu-container');
    let sparkles = [];
    let lastTime = 0;
    function spawnSparkle() {
        const mrect = menu.getBoundingClientRect();
        // Perimeter: top, right, bottom, left
        const sides = [
            { x: t => mrect.left + t * mrect.width, y: () => mrect.top }, // Top
            { x: () => mrect.right, y: t => mrect.top + t * mrect.height }, // Right
            { x: t => mrect.right - t * mrect.width, y: () => mrect.bottom }, // Bottom
            { x: () => mrect.left, y: t => mrect.bottom - t * mrect.height } // Left
        ];
        const side = Math.floor(Math.random() * 4);
        const t = Math.random();
        let x = sides[side].x(t);
        let y = sides[side].y(t);
        sparkles.push({
            x, y,
            alpha: 1,
            size: 5 + Math.random()*5,
            dy: -0.5 + Math.random(),
            dx: -0.5 + Math.random(),
            life: 28 + Math.floor(Math.random()*10)
        });
    }

    function drawSparkles() {
        const canvasId = "menuSparkleCanvas";
        let sparkleCanvas = document.getElementById(canvasId);
        if (!sparkleCanvas) {
            sparkleCanvas = document.createElement("canvas");
            sparkleCanvas.id = canvasId;
            sparkleCanvas.style.position = "fixed";
            sparkleCanvas.style.left = "0";
            sparkleCanvas.style.top = "0";
            sparkleCanvas.style.pointerEvents = "none";
            sparkleCanvas.style.zIndex = "3";
            document.body.appendChild(sparkleCanvas);
        }
        function resize() {
            sparkleCanvas.width = window.innerWidth;
            sparkleCanvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        const ctx = sparkleCanvas.getContext('2d');
        function animateSparkles(now) {
            ctx.clearRect(0, 0, sparkleCanvas.width, sparkleCanvas.height);
            if (Math.random() < 0.14) spawnSparkle();
            for (let i = sparkles.length-1; i >= 0; i--) {
                let s = sparkles[i];
                ctx.save();
                ctx.globalAlpha = Math.max(0, s.alpha * (s.life/40));
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.size, 0, 2*Math.PI);
                ctx.fillStyle = "#fff8e3";
                ctx.shadowColor = "#ea7dff";
                ctx.shadowBlur = 18;
                ctx.fill();
                ctx.restore();
                s.x += s.dx;
                s.y += s.dy;
                s.alpha *= 0.97;
                s.size *= 0.98;
                s.life--;
                if (s.life <= 0) sparkles.splice(i, 1);
            }
            requestAnimationFrame(animateSparkles);
        }
        animateSparkles();
    }
    drawSparkles();
}