'use strict';

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 150;
const T = 2 * Math.PI;
const OMEGA0 = 2 * Math.PI / T;
const A = 1.0;
const SAMPLES = 400;
const AXIS_COLOR = '#aaa';
const RECT_WAVE_COLOR = 'blue';
const SINE_WAVE_COLOR = 'red';

const canvasRect = document.getElementById('rectWaveCanvas');
const ctxRect = canvasRect.getContext('2d');
const canvasSine = document.getElementById('sineWaveCanvas');
const ctxSine = canvasSine.getContext('2d');

const dutySlider = document.getElementById('dutySlider');
const phaseSliderRad = document.getElementById('phaseSliderRad');
const dutyValueSpan = document.getElementById('dutyValue');
const phaseValueRadSpan = document.getElementById('phaseValueRad');

function mapX(t) {
    return (t / T) * (CANVAS_WIDTH - 20) + 10;
}

function mapYRect(y) {
    const margin = CANVAS_HEIGHT * 0.1;
    if (y === 0) {
        return CANVAS_HEIGHT - margin;
    } else {
        return margin;
    }
}

function mapYSine(y, maxAmplitude) {
    const margin = CANVAS_HEIGHT * 0.1;
    const graphHeight = CANVAS_HEIGHT - 2 * margin;
    const displayMax = maxAmplitude === 0 ? A / 2 : Math.max(maxAmplitude, A / 10);
    return CANVAS_HEIGHT / 2 - (y / displayMax) * (graphHeight / 2);
}

function drawAxes(ctx, mapYFunc, yCenterVal = 0, maxAmplitude = A) {
    ctx.strokeStyle = AXIS_COLOR;
    ctx.lineWidth = 1;
    ctx.font = '10px sans-serif';
    ctx.fillStyle = AXIS_COLOR;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    const yCenterCanvas = mapYFunc(yCenterVal, maxAmplitude, ctx);
    ctx.beginPath();
    ctx.moveTo(0, yCenterCanvas);
    ctx.lineTo(CANVAS_WIDTH, yCenterCanvas);
    ctx.stroke();

    const xZero = mapX(0);
    ctx.beginPath();
    ctx.moveTo(xZero, 0);
    ctx.lineTo(xZero, CANVAS_HEIGHT);
    ctx.stroke();

    const labels = ['0', 'π/2', 'π', '3π/2', '2π'];
    for (let i = 0; i <= 4; i++) {
        const t = i * Math.PI / 2;
        const x = mapX(t);
        ctx.beginPath();
        ctx.moveTo(x, yCenterCanvas - 4);
        ctx.lineTo(x, yCenterCanvas + 4);
        ctx.stroke();
        ctx.fillText(labels[i], x, yCenterCanvas + 6);
    }
}

function draw() {
    const dutyRatio = parseFloat(dutySlider.value);
    const phaseRad = parseFloat(phaseSliderRad.value) * Math.PI;

    dutyValueSpan.textContent = dutyRatio.toFixed(2);
    phaseValueRadSpan.textContent = phaseSliderRad.value + 'π';

    const pulse_width = dutyRatio * T;
    const t_pulse_center = phaseRad;
    const t_start = t_pulse_center - pulse_width / 2;

    const C1 = Math.abs(Math.sin(Math.PI * dutyRatio));
    const fundamentalPhaseRad = phaseRad;

    let displayPhase = (fundamentalPhaseRad % (2 * Math.PI));
    if (displayPhase > Math.PI) displayPhase -= 2 * Math.PI;
    if (displayPhase <= -Math.PI) displayPhase += 2 * Math.PI;

    ctxRect.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    drawAxes(ctxRect, mapYRect, 0);

    ctxRect.strokeStyle = RECT_WAVE_COLOR;
    ctxRect.lineWidth = 2;
    ctxRect.beginPath();

    let lastY_rect = NaN;
    for (let i = 0; i <= SAMPLES; i++) {
        const t = (i / SAMPLES) * T;
        let y = 0;

        const time_since_start = t - t_start;
        const normalized_time = (time_since_start % T + T) % T;

        if (normalized_time < pulse_width) {
            y = A;
        }

        const x_coord = mapX(t);
        const y_coord = mapYRect(y, ctxRect);

        if (i === 0) {
            ctxRect.moveTo(x_coord, y_coord);
        } else {
            if (Math.abs(y - lastY_rect) > A / 2) {
                const prev_x_coord = mapX((i - 1) / SAMPLES * T);
                ctxRect.lineTo(prev_x_coord, y_coord);
                ctxRect.lineTo(x_coord, y_coord);
            } else {
                ctxRect.lineTo(x_coord, y_coord);
            }
        }
        lastY_rect = y;
    }
    ctxRect.stroke();

    ctxSine.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    drawAxes(ctxSine, mapYSine, 0, C1);

    ctxSine.strokeStyle = SINE_WAVE_COLOR;
    ctxSine.lineWidth = 2;
    ctxSine.beginPath();

    for (let i = 0; i <= SAMPLES; i++) {
        const t = (i / SAMPLES) * T;
        const y = C1 * Math.cos(OMEGA0 * t - fundamentalPhaseRad);

        const x_coord = mapX(t);
        const y_coord = mapYSine(y, 1);

        if (i === 0) {
            ctxSine.moveTo(x_coord, y_coord);
        } else {
            ctxSine.lineTo(x_coord, y_coord);
        }
    }
    ctxSine.stroke();
}

function init() {
    dutySlider.addEventListener('input', draw);
    phaseSliderRad.addEventListener('input', draw);
    draw();
}

document.addEventListener('DOMContentLoaded', init);