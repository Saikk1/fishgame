const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

canvas.width = 800;
canvas.height = 600;

let score = 0;
let playerSize = 50;
let playerX = canvas.width / 2;
let playerY = canvas.height / 2;
let fish = [];

class Fish {
    constructor(size) {
        this.size = size || Math.random() * 30 + 20;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.speed = Math.random() * 2 + 1;
        this.color = `hsl(${Math.random() * 360}, 50%, 50%)`;
    }

    update() {
        // 简单AI：向玩家移动
        const dx = playerX - this.x;
        const dy = playerY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > 0) {
            this.x += (dx / dist) * this.speed;
            this.y += (dy / dist) * this.speed;
        }

        // 碰撞检测
        if (this.size < playerSize && 
            Math.abs(this.x - playerX) < (this.size + playerSize)/2 &&
            Math.abs(this.y - playerY) < (this.size + playerSize)/2) {
            this.reset();
            playerSize += 2;
            score++;
            scoreElement.textContent = `得分: ${score}`;
        }
    }

    reset() {
        this.size = Math.random() * 30 + 20;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.speed = Math.random() * 2 + 1;
        this.color = `hsl(${Math.random() * 360}, 50%, 50%)`;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, this.size/2, this.size/4, 0, 0, Math.PI * 2);
        ctx.fill();
    }
}

function spawnFish() {
    for (let i = 0; i < 10; i++) {
        fish.push(new Fish());
    }
}

function drawPlayer() {
    ctx.fillStyle = '#FFA500';
    ctx.beginPath();
    ctx.ellipse(playerX, playerY, playerSize/2, playerSize/4, 0, 0, Math.PI * 2);
    ctx.fill();
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制玩家
    drawPlayer();
    
    // 更新和绘制其他鱼
    fish.forEach(f => {
        f.update();
        f.draw();
    });

    requestAnimationFrame(gameLoop);
}

// 鼠标控制
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    playerX = e.clientX - rect.left;
    playerY = e.clientY - rect.top;
});

spawnFish();
gameLoop();
