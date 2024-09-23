const items = [];
const wheelCanvas = document.getElementById('wheelCanvas');
const ctx = wheelCanvas.getContext('2d');
let angle = 0;
let spinTimeout = null;
let spinAngleStart = 10;
let spinTime = 0;
let spinTimeTotal = 0;
let isSpinning = false;

// List of colors for the wheel segments
const colors = ['#FFDD57', '#FF5C5C', '#67A1F3', '#60D394', '#F5A623', '#8D63AF'];

document.getElementById('add-item').addEventListener('click', addItem);
document.getElementById('spin-btn').addEventListener('click', spinWheel);

function addItem() {
    const itemInput = document.getElementById('item-input');
    const item = itemInput.value.trim();
    if (item) {
        items.push(item);
        itemInput.value = '';
        renderItems();
        drawWheel();
    }
}

function renderItems() {
    const itemsList = document.getElementById('items');
    itemsList.innerHTML = '';
    items.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item;
        itemsList.appendChild(li);
    });
}

function drawWheel() {
    const arc = Math.PI / (items.length / 2);
    ctx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.font = 'bold 14px Arial';
    
    for (let i = 0; i < items.length; i++) {
        const angle = i * arc;
        ctx.fillStyle = colors[i % colors.length];
        ctx.beginPath();
        ctx.arc(250, 250, 200, angle, angle + arc, false);
        ctx.arc(250, 250, 100, angle + arc, angle, true);
        ctx.fill();
        ctx.save();
        ctx.fillStyle = 'black';
        ctx.translate(250 + Math.cos(angle + arc / 2) * 150, 250 + Math.sin(angle + arc / 2) * 150);
        ctx.rotate(angle + arc / 2 + Math.PI / 2);
        ctx.fillText(items[i], -ctx.measureText(items[i]).width / 2, 0);
        ctx.restore();
    }
}

function rotateWheel() {
    angle += (spinAngleStart * Math.PI) / 180;
    drawWheel();
    ctx.save();
    ctx.translate(250, 250);
    ctx.rotate(angle);
    ctx.translate(-250, -250);
    ctx.restore();
    
    spinTimeout = requestAnimationFrame(rotateWheel);
    spinTime += 30;
    if (spinTime >= spinTimeTotal) {
        stopRotateWheel();
    }
}

function stopRotateWheel() {
    cancelAnimationFrame(spinTimeout);
    const degrees = angle * (180 / Math.PI) + 90;
    const arcDegrees = 360 / items.length;
    const index = Math.floor((degrees % 360) / arcDegrees);
    const winningItem = items[items.length - index - 1];
    
    // Display the result
    alert(`Result: ${winningItem}`);

    // Save to history
    const historyList = document.getElementById('history-list');
    const li = document.createElement('li');
    li.textContent = `Result: ${winningItem}`;
    historyList.appendChild(li);
    
    isSpinning = false;
}

function spinWheel() {
    if (items.length > 1 && !isSpinning) {
        spinAngleStart = Math.random() * 10 + 10;
        spinTime = 0;
        spinTimeTotal = Math.random() * 3000 + 4000;
        isSpinning = true;
        rotateWheel();
    } else if (isSpinning) {
        alert('Wheel is already spinning!');
    } else {
        alert('Please add at least 2 items.');
    }
}
