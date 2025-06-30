
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

let player = {
  x: 180,
  y: 500,
  width: 30,
  height: 30,
  color: "#FFD700",
  dy: 0,
  jumpPower: -10,
  gravity: 0.03,
  onGround: false,
  canJump: false,
  oxygen: 100,
  score: 0,  
};

let platforms = [];
let oxygens = [];
let gameSpeed = 1;
let keys = {};
let frame = 0;

function createPlatform(x, y, w, speed) {
  return {
    x,
    y,
    width: w,
    height: 10,
    speed,
    dir: Math.random() > 0.5 ? 1 : -1,
  };
}

function createOxygen(x, y) {
  return { x, y, radius: 8, collected: false };
}

// Initialize platforms
function initPlatforms() {
  platforms = [];
  for (let i = 0; i < 7; i++) {
    const x = Math.random() * 300;
    const y = 100 * i;
    const speed = Math.random() * 0.5 + 0.3;
    platforms.push(createPlatform(x, canvas.height - y, 80, speed));
  }
}
initPlatforms();

function update() {
  frame++;

  // Move platforms
  for (let p of platforms) {
    p.x += p.speed * p.dir;
    if (p.x <= 0 || p.x + p.width >= canvas.width) {
      p.dir *= -1;
    }
    p.y += gameSpeed;

    // Respawn at top
    if (p.y > canvas.height) {
      p.y = -10;
      p.x = Math.random() * 300;
      if (Math.random() < 0.3) {
        oxygens.push(createOxygen(p.x + 30, p.y - 10));
      }
    }
  }

  // Player controls
  if (keys["ArrowLeft"]) player.x -= 3;
  if (keys["ArrowRight"]) player.x += 3;

  player.dy += player.gravity;
  player.y += player.dy;
  player.onGround = false;

  for (let p of platforms) {
    if (
      player.y + player.height >= p.y &&
      player.y + player.height <= p.y + p.height &&
      player.x + player.width > p.x &&
      player.x < p.x + p.width &&
      player.dy > 0
    ) {
      player.y = p.y - player.height;
      player.dy = 0;
      player.onGround = true;
      player.canJump = true;
      player.score += 1;
    }
  }

  // Oxygen
  player.oxygen -= 0.05;
  if (player.oxygen <= 0) {
    alert("Out of Oxygen! Game Over.");
    resetGame();
  }

  for (let o of oxygens) {
    if (!o.collected && Math.hypot(player.x - o.x, player.y - o.y) < 20) {
      o.collected = true;
      player.oxygen = Math.min(player.oxygen + 30, 100);
    }
    o.y += gameSpeed;
  }

  // Boundaries
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width)
    player.x = canvas.width - player.width;
}

function draw() {
  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Platforms
  ctx.fillStyle = "#444";
  for (let p of platforms) {
    ctx.fillRect(p.x, p.y, p.width, p.height);
  }

  // Oxygen
  for (let o of oxygens) {
    if (!o.collected) {
      ctx.beginPath();
      ctx.arc(o.x, o.y, o.radius, 0, Math.PI * 2);
      ctx.fillStyle = "#00f";
      ctx.fill();
    }
  }

  // Player
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Oxygen bar
  ctx.fillStyle = "#fff";
  ctx.fillRect(10, 10, 100, 10);
  ctx.fillStyle = "#0f0";
  ctx.fillRect(10, 10, player.oxygen, 10);

  // Score
  ctx.fillStyle = "#fff";
  ctx.font = "14px monospace";
  ctx.fillText(`Altitude: ${player.score}`, 300, 20);
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

function resetGame() {
  player.y = 500;
  player.dy = 0;
  player.oxygen = 100;
  player.score = 0;
  player.canJump = false;
  oxygens = [];
  initPlatforms();
}

document.addEventListener("keydown", (e) => {
  keys[e.key] = true;

  if ((e.key === " " || e.code === "Space") && player.canJump) {
    player.dy = player.jumpPower;
    player.canJump = false;
  }
});

document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

loop();
