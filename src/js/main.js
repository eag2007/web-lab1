const buttonCheck = document.getElementById('check-button');
const buttonClear = document.getElementById('clear-button');
const logs = document.getElementById('logs');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

context.translate(canvas.width / 2, canvas.height / 2);
context.scale(1, -1);

global_r = 1;
array = [];

var isDragging = false;
var lastX = 0;
var lastY = 0;

var zoom = 1;
var offsetX = 0;
var offsetY = 0;

const toDecimal = (value) => {
  value = value.trim();
  if (!/^-?\d+(\.\d+)?$/.test(value)) {
    return null;
  }
  return new Decimal(value);
};

const showError = (message) => {
  logs.innerHTML += `<label style="font-size: 15px">${message}</label>`;
  logs.style.display = 'block';
};

const hideError = () => {
  logs.textContent = '';
  logs.style.display = 'none';
};

const clickCheckButton = () => {
  hideError();

  const x = parseInt(document.getElementById('x')?.value);
  const y = toDecimal(document.getElementById('y')?.value);
  const r = toDecimal(document.getElementById('r')?.value);

  if (y == null) {
    showError('Координата Y не соответсвует числу');
    return;
  }

  if (r == null) {
    showError('Значение R не соответсвует числу');
    return;
  }

  if (y.lt(-3) || y.gt(3)) {
    showError('Координата  Y не соответсвует диапазону');
    return;
  }

  if (r.lt(2) || r.gt(5)) {
    showError('Значение R не соответсвует диапазону');
    return;
  }

  global_r = r;
  let tmp = new Date().toLocaleString('ru-RU');
  let is_range = checkRange(x, y) ? 'Попала' : 'Не попала';

  const value_table = document.getElementsByTagName('tbody')[0];
  value_table.innerHTML += `<tr>
                                <td>${x}</td>
                                <td>${y}</td>
                                <td>${r}</td>
                                <td>${is_range}</td>
                                <td>${tmp}</td>
                           </tr>`;

  array.push([x, y, r, is_range, tmp]);

  clearCanvas();
  drawArea();
  draw();
  drawText('X',
    (canvas.width / 2 - offsetX) / zoom - 15 / zoom,
    10 / zoom
  );
  drawText(
    'Y',
    10 / zoom,
    (canvas.height / 2 + offsetY) / zoom - 15 / zoom,
  );
  drawValues();
  drawPoints(array);
};

const clickClearButton = () => {
  hideError();
  let values_table = document.getElementsByTagName('tbody')[0];
  values_table.innerHTML = '';
  clearCanvas();
  array = [];
  drawArea();
  draw();
  drawText('X',
    (canvas.width / 2 - offsetX) / zoom - 15 / zoom,
    10 / zoom
  );
  drawText(
    'Y',
    10 / zoom,
    (canvas.height / 2 + offsetY) / zoom - 15 / zoom,
  );
  drawValues();
};

const checkRange = (x, y) => {
  if (y <= -2 * x + global_r && x <= global_r / 2 && y <= global_r) {
    return true;
  } else if (x >= -global_r && x <= 0 && -y <= 0 && y >= -global_r / 2) {
    return true;
  } else if (x ** 2 + y ** 2 <= global_r ** 2 && x <= 0 && y >= 0) {
    return true;
  }
  return false;
};

const draw = () => {
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

const drawText = (text, x, y) => {
  context.save();
  context.translate(x, y);
  context.scale(1 / zoom, -1 / zoom);
  context.fillText(text, 0, 0);
  context.restore();
};

const drawValues = () => {
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
  let start = 0.5;
  while (canvas.width / zoom > xStep * n * zoom) {
    tickX(xStep * n);
    drawText(`${start}`, xStep * n, 15);
    n++;
    if (zoom < 0.24) {
      start += 1.5;
      n++;
      n++;
    } else {
      start += 0.5;
    }
  }

  n = 1;
  start = -0.5;
  while (-canvas.width / zoom < -xStep * n * zoom) {
    tickX(-xStep * n);
    drawText(`${start}`, -xStep * n, 15);
    n++;
    if (zoom < 0.24) {
      start -= 1.5;
      n++;
      n++;
    } else {
      start -= 0.5;
    }
  }

  // y
  n = 1;
  start = 0.5;
  while (canvas.height / zoom > xStep * n * zoom) {
    tickY(yStep * n);
    drawText(`${start}`, 15, yStep * n);
    n++;
    if (zoom < 0.24) {
      start += 1.5;
      n++;
      n++;
    } else {
      start += 0.5;
    }
  }

  n = 1;
  start = -0.5;
  while (-canvas.height / zoom < -yStep * n * zoom) {
    tickY(-yStep * n);
    drawText(`${start}`, 15, -yStep * n);
    n++;
    if (zoom < 0.24) {
      start -= 1.5;
      n++;
      n++;
    } else {
      start -= 0.5;
    }
  }
};

const drawArea = () => {
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

const clearCanvas = () => {
  context.save();

  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, canvas.width, canvas.height);

  context.restore();
};

const drawPoints = (points) => {
  const xStep = canvas.width / 6;
  const yStep = canvas.height / 6;

  points.forEach(([x, y, r, flag, time]) => {
    const px = (x * xStep * 2) / r;
    const py = (y * yStep * 2) / r;

    context.beginPath();
    context.arc(px, py, 6, 0, Math.PI * 2);
    context.fillStyle = 'blue';
    context.fill();
  });
  context.fillStyle = 'black';
};

const drawZoomUpdate = (zoom) => {
  // сбросим scale наш
  context.setTransform(1, 0, 0, 1, 0, 0);

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.translate(canvas.width / 2 + offsetX, canvas.height / 2 + offsetY);
  context.scale(zoom, -zoom);

  drawArea();
  draw();
  drawText('X',
    (canvas.width / 2 - offsetX) / zoom - 15 / zoom,
    10 / zoom
  );
  drawText(
    'Y',
    10 / zoom,
    (canvas.height / 2 + offsetY) / zoom - 15 / zoom,
  );
  drawValues();
  drawPoints(array);
};

const zoomOperation = (event) => {
  event.preventDefault();
  if (event.deltaY < 0) {
    zoom = Math.min(zoom * 1.1, 15);
  }

  if (event.deltaY > 0) {
    zoom = Math.max(zoom / 1.1, 0.11);
  }
  console.log(zoom);
  drawZoomUpdate(zoom);
};

const selectedFromMove = (event) => {
  isDragging = true;

  lastX = event.clientX;
  lastY = event.clientY;
};

const moveMouse = (event) => {
  if (!isDragging) {
    return;
  }

  const dx = event.clientX - lastX;
  const dy = event.clientY - lastY;

  offsetX += dx;
  offsetY += dy;

  lastX = event.clientX;
  lastY = event.clientY;

  drawZoomUpdate(zoom);
};

const unselectedFromMove = (event) => {
  isDragging = false;
};

canvas.addEventListener('wheel', zoomOperation);
canvas.addEventListener('mousedown', selectedFromMove);
canvas.addEventListener('mousemove', moveMouse);

window.addEventListener('mouseup', unselectedFromMove);

buttonCheck.addEventListener('click', clickCheckButton);
buttonClear.addEventListener('click', clickClearButton);

drawArea();
draw();
drawText('X',
  (canvas.width / 2 - offsetX) / zoom - 15 / zoom,
  10 / zoom
);
drawText(
  'Y',
  10 / zoom,
  (canvas.height / 2 + offsetY) / zoom - 15 / zoom,
);
drawValues();
