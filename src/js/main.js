const buttonCheck = document.getElementById('check-button');
const buttonClear = document.getElementById('clear-button');
const logs = document.getElementById('logs');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d')

context.translate(canvas.width / 2, canvas.height / 2);
context.scale(1, -1);

const now = new Date();

global_r = 1;
array = [];

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
  let tmp = now.toLocaleString('ru-RU');

  const value_table = document.getElementsByTagName('tbody')[0];
  value_table.innerHTML += `<tr>
                                <td>${x}</td>
                                <td>${y}</td>
                                <td>${r}</td>
                                <td>${checkRange(x, y) ? 'Попала' : 'Не попала'}</td>
                                <td>${tmp}</td>
                           </tr>`;

  array.push([x, y, r, checkRange(x, y), tmp])

  clearCanvas();
  drawArea();
  draw();
  drawText('X', canvas.width / 2 - 15, 0);
  drawText('Y', 0, -canvas.height / 2 + 15);
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
  drawText('X', canvas.width / 2 - 15, 0);
  drawText('Y', 0, -canvas.height / 2 + 15);
  drawValues();
};

const checkRange = (x, y) => {
  if (y <= -2 * x + global_r && x <= global_r / 2 && y <= global_r) {
    return true;
  } else if (x >= -global_r && x <= 0 && -y <= 0 && y >= -global_r / 2) {
    return true;
  } else if (x ** 2 + y ** 2 <= global_r ** 2 && x <= 0 && y <= 0) {
    return true;
  }
  return false;
};

const draw = () => {
  // рисуем стрелку вверх
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(0, canvas.height / 2 - 25);
  context.strokeStyle = 'black';
  context.lineWidth = 1;
  context.stroke();

  // рисуем стрелку вниз
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(0, -canvas.height / 2 + 25);
  context.strokeStyle = 'black';
  context.lineWidth = 1;
  context.stroke();

  // рисуем стрелку вправо
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(canvas.width / 2 - 25, 0);
  context.strokeStyle = 'black';
  context.lineWidth = 1;
  context.stroke();

  // рисуем стрелку влево
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(-canvas.width / 2 + 25, 0);
  context.strokeStyle = 'black';
  context.lineWidth = 1;
  context.stroke();
};

const drawText = (text, x, y) => {
  context.scale(1, -1);
  context.fillText(text, x, y);
  context.scale(1, -1);
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
  tickX(-xStep * 2);
  drawText(`${-global_r}`, -xStep * 2, 15);
  tickX(-xStep);
  drawText(`${-global_r / 2}`, -xStep, 15);
  tickX(xStep);
  drawText(`${global_r / 2}`, xStep, 15);
  tickX(xStep * 2);
  drawText(`${global_r}`, xStep * 2, 15);


  // y
  tickY(yStep * 2);
  drawText(`${global_r}`, 15, -yStep * 2);
  tickY(yStep);
  drawText(`${global_r / 2}`, 20, -yStep);
  tickY(-yStep);
  drawText(`${-global_r / 2}`, 25, yStep);
  tickY(-yStep * 2);
  drawText(`${-global_r}`, 15, yStep * 2);
};

const drawArea = () => {
  const xStep = canvas.width / 6;
  const yStep = canvas.height / 6;

  const rX = xStep * 2;
  const rY = yStep * 2;

  context.save();

  context.fillStyle = 'rgba(0, 122, 255, 0.22)';
  context.strokeStyle = 'rgba(0, 122, 255, 0.55)';
  context.lineWidth = 1.5;

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
  context.clearRect(
    -canvas.width / 2,
    -canvas.height / 2,
    canvas.width,
    canvas.height,
  );
  draw()
};

const drawPoints = (points) => {
  const xStep = canvas.width / 6;
  const yStep = canvas.height / 6;

  points.forEach(([x, y]) => {
    const px = (x * xStep * 2) / global_r;
    const py = (y * yStep * 2) / global_r;

    context.beginPath();
    context.arc(px, py, 6, 0, Math.PI * 2);
    context.fillStyle = 'blue';
    context.fill();
  });
};

buttonCheck.addEventListener('click', clickCheckButton);
buttonClear.addEventListener('click', clickClearButton);

drawArea();
draw();
drawText('X', canvas.width / 2 - 15, 0);
drawText('Y', 0, -canvas.height / 2 + 15);
drawValues();
