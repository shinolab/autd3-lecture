import * as THREE from 'three';

let scene, camera, renderer;
let transducers = [];
let waves = [];
let focusPoint;
let mouse;
let isDragging = false;
let selectedObject = null;
let t = 0;

const width = 400;
const height = 400;

const numTransducers = 15;
const transducerSpacing = 0.1;
const transducerRadius = 0.03;
const transducerHeight = 0.06;
const focusRadius = 0.04;
const initialFocusPosition = new THREE.Vector3(0, 0.5, 0);
const dt = 0.005;

init();
animate();

function init() {
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: document.querySelector("#demo")
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFFFFFF);

    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 1000);
    camera.position.set(0, 0, 3);

    const transducerGeometry = new THREE.CylinderGeometry(transducerRadius, transducerRadius, transducerHeight, 16);
    const transducerMaterial = new THREE.MeshStandardMaterial();
    const arrayWidth = (numTransducers - 1) * transducerSpacing;
    const startX = -arrayWidth / 2;
    for (let i = 0; i < numTransducers; i++) {
        const transducer = new THREE.Mesh(transducerGeometry, transducerMaterial);
        const x = startX + i * transducerSpacing;
        transducer.position.set(x, -0.5, 0);
        scene.add(transducer);
        transducers.push(transducer);
    }

    const focusGeometry = new THREE.SphereGeometry(focusRadius, 32, 16);
    const focusMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
    focusPoint = new THREE.Mesh(focusGeometry, focusMaterial);
    focusPoint.position.copy(initialFocusPosition);
    scene.add(focusPoint);

    transducers.forEach(_ => {
        const geometry = new THREE.BufferGeometry().setFromPoints([]);
        const material = new THREE.LineBasicMaterial({ color: 0x00FF00 });

        const line = new THREE.Line(geometry, material);
        scene.add(line);
        waves.push(line);
    });

    mouse = new THREE.Vector2();
    renderer.domElement.addEventListener('mousedown', onMouseDown);
}

function updateMouseCoordinates(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    const canvas = document.querySelector("#demo").getBoundingClientRect();
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    mouse.x = ((event.clientX - rect.left) / canvasWidth) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / canvasHeight) * 2 + 1;
}

function onMouseDown(event) {
    resetWaves();

    updateMouseCoordinates(event);

    isDragging = true;
    selectedObject = focusPoint;

    selectedObject.position.set(mouse.x, mouse.y, 0);
    updateWaves();

    renderer.domElement.addEventListener('mousemove', onDragMouseMove);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('mouseleave', onMouseUp);
}

function onDragMouseMove(event) {
    if (!isDragging || !selectedObject) return;

    resetWaves();

    updateMouseCoordinates(event);

    selectedObject.position.set(mouse.x, mouse.y, 0);
    updateWaves();
}

function onMouseUp(event) {
    if (isDragging) {
        isDragging = false;
        selectedObject = null;

        renderer.domElement.removeEventListener('mousemove', onDragMouseMove);
        renderer.domElement.removeEventListener('mouseup', onMouseUp);
        renderer.domElement.removeEventListener('mouseleave', onMouseUp);
    }
}

function resetWaves() {
    t = 0;
    for (let i = 0; i < transducers.length; i++) {
        const line = waves[i];
        const geometry = new THREE.BufferGeometry().setFromPoints([]);
        line.geometry.dispose();
        line.geometry = geometry;
    }
}

function updateWaves() {
    let maxDistance = 0;
    for (let i = 0; i < transducers.length; i++) {
        const transducer = transducers[i];
        const distance = transducer.position.distanceTo(focusPoint.position);
        if (distance > maxDistance) {
            maxDistance = distance;
        }
    }

    for (let i = 0; i < waves.length; i++) {
        const line = waves[i];
        const transducer = transducers[i];

        const distance = transducer.position.distanceTo(focusPoint.position);

        let radius = t * maxDistance - (maxDistance - distance);
        if (radius > 0) {
            const path = new THREE.Path();
            path.arc(transducers[i].position.x, transducers[i].position.y, radius, 0, Math.PI, false);
            const points = path.getPoints();

            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            line.geometry.dispose();
            line.geometry = geometry;
        }
        line.geometry.attributes.position.needsUpdate = true;
    }
}

function animate() {
    t += dt;
    if (t > 1.0) resetWaves();
    updateWaves();

    renderer.render(scene, camera);

    requestAnimationFrame(animate);
}