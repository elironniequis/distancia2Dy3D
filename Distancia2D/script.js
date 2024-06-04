class Punto {
    constructor(x = 0, y = 0, coordX = 0, coordY = 0) {
        this.x = x;
        this.y = y;
        this.coordX = coordX;
        this.coordY = coordY;
    }
}

let puntos = [];
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const step = 20; // Ajuste de pasos para la cuadrícula
const numX = 20;
const numY = 15;
const originX = 30;
const originY = canvas.height - 30;

function drawGrid() {
    const width = canvas.width;
    const height = canvas.height;

    ctx.strokeStyle = '#555';
    ctx.beginPath();
    for (let x = originX; x < width; x += step) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
    }
    for (let y = originY; y > 0; y -= step) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
    }
    ctx.stroke();

    ctx.strokeStyle = '#ffcc00';
    ctx.beginPath();
    for (let x = originX, i = 0; i <= numX; x += step, i++) {
        ctx.moveTo(x, originY);
        ctx.lineTo(x, originY + 10);
        ctx.strokeText(i, x - 5, originY + 20);
    }
    for (let y = originY, i = 0; i <= numY; y -= step, i++) {
        ctx.moveTo(originX - 10, y);
        ctx.lineTo(originX, y);
        ctx.strokeText(i, originX - 25, y + 5);
    }
    ctx.stroke();
}

function drawPoints() {
    ctx.fillStyle = 'red';
    puntos.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#ffcc00';
        ctx.fillText(`(${p.coordX}, ${p.coordY})`, p.x + 5, p.y - 5);
        ctx.fillStyle = 'red';
    });
}

function drawLines() {
    if (puntos.length >= 2) {
        const p1 = puntos[0];
        const p2 = puntos[1];
        ctx.strokeStyle = 'blue';
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        // Cálculo de la distancia usando la fórmula de Pitágoras
        const deltaX = p2.coordX - p1.coordX;
        const deltaY = p2.coordY - p1.coordY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY).toFixed(2);
        document.getElementById('distancia').textContent = distance;
        document.getElementById('distanciaRaiz').textContent = `√(${deltaX}² + ${deltaY}²)`;

        // Mostrar las propiedades de la función de distancia
        document.getElementById('positividad').textContent = `Positividad: d(x,y) = ${distance} ≥ 0 y d(x,y) = 0 si x=y`;
        document.getElementById('simetria').textContent = `Simetría: d(x,y) = d(y,x) = ${distance}`;
        document.getElementById('desigualdad').textContent = `Desigualdad triangular: d(x,z) ≤ d(x,y) + d(y,z) (para cualquier tercer punto z)`;
    }
}

function toCartesian(x, y) {
    const coordX = Math.round((x - originX) / step);
    const coordY = Math.round((originY - y) / step);
    return { coordX, coordY };
}

canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const xPos = event.clientX - rect.left;
    const yPos = event.clientY - rect.top;
    const { coordX, coordY } = toCartesian(xPos, yPos);
    document.getElementById('mouseX').value = coordX;
    document.getElementById('mouseY').value = coordY;
});

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const xPos = event.clientX - rect.left;
    const yPos = event.clientY - rect.top;
    const { coordX, coordY } = toCartesian(xPos, yPos);
    const adjustedX = originX + coordX * step;
    const adjustedY = originY - coordY * step;

    if (puntos.length >= 2) {
        puntos.shift();  // Eliminar el primer punto
    }
    puntos.push(new Punto(adjustedX, adjustedY, coordX, coordY));
    draw();
});

document.getElementById('resetBtn').addEventListener('click', () => {
    puntos = [];
    document.getElementById('distancia').textContent = '';
    document.getElementById('distanciaRaiz').textContent = '';
    document.getElementById('positividad').textContent = '';
    document.getElementById('simetria').textContent = '';
    document.getElementById('desigualdad').textContent = '';
    draw();
});

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawPoints();
    drawLines();
}

draw();
