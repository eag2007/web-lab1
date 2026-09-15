import { points, global_r, checkRange } from './points.js';
import { savePoints } from './storage.js';
import { addPointToTable } from './table.js';

export const canvas = document.getElementById('canvas');

const context = canvas.getContext('2d');

context.translate(canvas.width / 2, canvas.height / 2);
context.scale(1, -1);

let isDragging = false;
let lastX = 0;
let lastY = 0;

export let zoom = 1;
export let offsetX = 0;
export let offsetY = 0;

export const drawLine = () => {
  const width = canvas.width / zoom + Math.abs(offsetX) / zoom;
  const height = canvas.height / zoom + Math.abs(offsetY) / zoom;

  context.beginPath();

  context.moveTo(-width, 0);
  context.lineTo(width, 0);

  context.moveTo(0, height);
  context.lineTo(0, -height);

  context.lineWidth = 1 / zoom;
  context.strokeStyle = 'black';
  context.stroke();
};

export const drawText = (text, x, y) => {
  context.save();

  context.translate(x, y);
  context.scale(1 / zoom, -1 / zoom);

  context.fillText(text, 0, 0);

  context.restore();
};

export const drawValues = () => {
  const xStep = canvas.width / 6;
  const yStep = canvas.height / 6;
  const tickSize = 5;

  // черта на X
  const tickX = (x) => {
    context.beginPath();
    context.moveTo(x, -tickSize);
    context.lineTo(x, tickSize);
    context.stroke();
  };

  // черта на Y
  const tickY = (y) => {
    context.beginPath();
    context.moveTo(-tickSize, y);
    context.lineTo(tickSize, y);
    context.stroke();
  };

  // x
  let n = 1;
  let start = global_r / 2;

  while (canvas.width / zoom > xStep * n * zoom) {
    tickX(xStep * n);
    drawText(`${start}`, xStep * n, 15);

    n++;

    if (zoom < 0.24) {
      start += (global_r / 2) * 3;
      n++;
      n++;
    } else {
      start += global_r / 2;
    }
  }

  n = 1;
  start = -global_r / 2;

  while (-canvas.width / zoom < -xStep * n * zoom) {
    tickX(-xStep * n);
    drawText(`${start}`, -xStep * n, 15);

    n++;

    if (zoom < 0.24) {
      start -= (global_r / 2) * 3;
      n++;
      n++;
    } else {
      start -= global_r / 2;
    }
  }

  // y
  n = 1;
  start = global_r / 2;

  while (canvas.height / zoom > xStep * n * zoom) {
    tickY(yStep * n);
    drawText(`${start}`, 15, yStep * n);

    n++;

    if (zoom < 0.24) {
      start += (global_r / 2) * 3;
      n++;
      n++;
    } else {
      start += global_r / 2;
    }
  }

  n = 1;
  start = -global_r / 2;

  while (-canvas.height / zoom < -yStep * n * zoom) {
    tickY(-yStep * n);
    drawText(`${start}`, 15, -yStep * n);

    n++;

    if (zoom < 0.24) {
      start -= (global_r * 3) / 2;
      n++;
      n++;
    } else {
      start -= global_r / 2;
    }
  }
};

export const drawArea = () => {
  const xStep = canvas.width / 6;
  const yStep = canvas.height / 6;

  const rX = xStep * 2;
  const rY = yStep * 2;

  context.save();

  context.fillStyle = 'rgba(0, 122, 255, 0.22)';
  context.strokeStyle = 'rgba(0, 122, 255, 0.22)';
  context.lineWidth = 1.5 / zoom;

  // четверть круга слева сверху
  context.beginPath();
  context.moveTo(0, 0);
  context.ellipse(0, 0, rX, rY, 0, Math.PI / 2, Math.PI);
  context.closePath();
  context.fill();
  context.stroke();

  // прямоугольник слева снизу
  context.beginPath();
  context.rect(-rX, -yStep, rX, yStep);
  context.fill();
  context.stroke();

  // треугольник справа сверху
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(0, rY);
  context.lineTo(xStep, 0);
  context.closePath();
  context.fill();
  context.stroke();

  context.restore();
};

export const drawPoints = (points) => {
  const xStep = canvas.width / 6;
  const yStep = canvas.height / 6;

  points.forEach(([x, y, r, flag, time]) => {
    const px = (x * xStep * 2) / global_r;
    const py = (y * yStep * 2) / global_r;

    context.beginPath();

    context.arc(px, py, 6, 0, Math.PI * 2);

    context.fillStyle = 'blue';
    context.fill();
  });

  context.fillStyle = 'black';
};

export const drawZoomUpdate = (zoom) => {
  context.setTransform(1, 0, 0, 1, 0, 0);

  context.clearRect(0, 0, canvas.width, canvas.height);

  context.translate(canvas.width / 2 + offsetX, canvas.height / 2 + offsetY);
  context.scale(zoom, -zoom);

  drawArea();
  drawLine();

  drawText('X', (canvas.width / 2 - offsetX) / zoom - 15 / zoom, 10 / zoom);
  drawText('Y', 10 / zoom, (canvas.height / 2 + offsetY) / zoom - 15 / zoom);

  drawValues();
  drawPoints(points);
};

export const zoomOperation = (event) => {
  event.preventDefault();

  if (event.deltaY < 0) {
    zoom = Math.min(zoom * 1.1, 15);
  }

  if (event.deltaY > 0) {
    zoom = Math.max(zoom / 1.1, 0.11);
  }

  drawZoomUpdate(zoom);
};

export const selectedFromMove = (event) => {
  isDragging = true;

  lastX = event.clientX;
  lastY = event.clientY;
};

export const moveMouse = (event) => {
  if (!isDragging) {
    return;
  }

  const dx = event.clientX - lastX;
  const dy = event.clientY - lastY;

  offsetX += dx;
  offsetY += dy;

  const xStep = canvas.width / 6;
  const yStep = canvas.height / 6;

  const maxOffsetX = (300 * 2 * xStep * zoom) / global_r;
  const maxOffsetY = (300 * 2 * yStep * zoom) / global_r;

  offsetX = Math.max(-maxOffsetX, Math.min(maxOffsetX, offsetX));
  offsetY = Math.max(-maxOffsetY, Math.min(maxOffsetY, offsetY));

  lastX = event.clientX;
  lastY = event.clientY;

  drawZoomUpdate(zoom);
};

export const unselectedFromMove = () => {
  isDragging = false;
};

export const createPoint = (event) => {
  const rect = canvas.getBoundingClientRect();

  let x = ((event.clientX - rect.left) * canvas.width) / rect.width;
  let y = ((event.clientY - rect.top) * canvas.height) / rect.height;

  x = (x - canvas.width / 2 - offsetX) / zoom;
  y = -(y - canvas.height / 2 - offsetY) / zoom;

  const xStep = canvas.width / 6;
  const yStep = canvas.height / 6;

  x = (x / (2 * xStep)) * global_r;
  y = (y / (2 * yStep)) * global_r;

  const is_range = checkRange(x, y) ? 'Попала' : 'Не попала';
  const time = new Date().toLocaleString('ru-RU');
  const point = [x, y, global_r, is_range, time];

  points.push(point);

  savePoints(points);
  addPointToTable(point);

  drawZoomUpdate(zoom);
};
