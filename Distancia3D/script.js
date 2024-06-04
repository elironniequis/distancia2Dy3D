// Configuración básica de la escena
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Grilla
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(gridHelper);

// Cubo
const geometry = new THREE.BoxGeometry(50, 50, 50);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Controles
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// TransformControls para mover el cubo
const transformControls = new THREE.TransformControls(camera, renderer.domElement);
transformControls.attach(cube);
transformControls.setMode('translate'); // Permitir solo la traslación
scene.add(transformControls);

// Lista de puntos y líneas
let puntos = [];
let line;

// Materiales para puntos y líneas
const pointMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const lineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });

// Añadir punto a la escena
function addPoint(x, y, z) {
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const point = new THREE.Mesh(geometry, pointMaterial);
    point.position.set(x, y, z);
    scene.add(point);
    puntos.push(point);

    // Eliminar el primer punto si hay más de dos
    if (puntos.length > 2) {
        const oldPoint = puntos.shift();
        scene.remove(oldPoint);
    }
    return point;
}

// Dibujar línea entre dos puntos
function drawLine(p1, p2) {
    // Eliminar la línea anterior si existe
    if (line) {
        scene.remove(line);
    }

    const geometry = new THREE.BufferGeometry().setFromPoints([p1.position, p2.position]);
    line = new THREE.Line(geometry, lineMaterial);
    scene.add(line);
}

// Calcular distancia y mostrar
function calculateDistance(p1, p2) {
    const dx = p2.position.x - p1.position.x;
    const dy = p2.position.y - p1.position.y;
    const dz = p2.position.z - p1.position.z;
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz).toFixed(2);
    const distanceRaiz = `√(${dx.toFixed(2)}² + ${dy.toFixed(2)}² + ${dz.toFixed(2)}²)`;
    document.getElementById('distancia').textContent = distance;
    document.getElementById('distanciaRaiz').textContent = distanceRaiz;
}

// Evento de click para añadir puntos
window.addEventListener('click', (event) => {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(gridHelper);
    if (intersects.length > 0) {
        const intersect = intersects[0];
        const point = addPoint(intersect.point.x, intersect.point.y, intersect.point.z);

        // Si hay exactamente dos puntos, dibujar la línea y calcular la distancia
        if (puntos.length === 2) {
            const p1 = puntos[0];
            const p2 = puntos[1];
            drawLine(p1, p2);
            calculateDistance(p1, p2);
        } else {
            document.getElementById('distancia').textContent = '';
            document.getElementById('distanciaRaiz').textContent = '';
        }
    }
});

// Evento de movimiento del mouse para mostrar coordenadas
window.addEventListener('mousemove', (event) => {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(gridHelper);
    if (intersects.length > 0) {
        const intersect = intersects[0];
        document.getElementById('mouseX').value = intersect.point.x.toFixed(2);
        document.getElementById('mouseY').value = intersect.point.y.toFixed(2);
        document.getElementById('mouseZ').value = intersect.point.z.toFixed(2);
    }
});

// Evento de reinicio
document.getElementById('resetBtn').addEventListener('click', () => {
    puntos.forEach(p => scene.remove(p));
    puntos = [];
    if (line) {
        scene.remove(line);
        line = null;
    }
    document.getElementById('distancia').textContent = '';
    document.getElementById('distanciaRaiz').textContent = '';
});

// Configuración inicial de la cámara
camera.position.set(100, 100, 100);
controls.update();

// Función de animación
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();
