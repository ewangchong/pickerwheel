const items = [];
const wheelCanvas = document.getElementById('wheelCanvas');
const ctx = wheelCanvas.getContext('2d');
let angle = 0;
let spinTimeout = null;
let spinAngleStart = 10;
let spinTime = 0;
let spinTimeTotal = 0;

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
    items.forEach((item, index) => {
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
        ctx.fillStyle = i % 2 === 0 ? '#FFDD57' : '#FF5C5C';
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
    alert(`Result: ${items[items.length - index - 1]}`);
}

function spinWheel() {
    if (items.length > 1) {
        spinAngleStart = Math.random() * 10 + 10;
        spinTime = 0;
        spinTimeTotal = Math.random() * 3000 + 4000;
        rotateWheel();
    } else {
        alert('Please add at least 2 items.');
    }
}
