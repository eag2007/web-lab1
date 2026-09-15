import { points, setGlobalR, checkRange } from './points.js';
import { savePoints, clearPoints } from './storage.js';
import { toDecimal, showError, hideError } from './validation.js';
import { addPointToTable, clearTable, addToTable } from './table.js';

import {
  canvas,
  zoom,
  drawZoomUpdate,
  zoomOperation,
  selectedFromMove,
  moveMouse,
  unselectedFromMove,
  createPoint,
} from './canvas.js';

const buttonCheck = document.getElementById('check-button');
const buttonClear = document.getElementById('clear-button');

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

  setGlobalR(r);

  const tmp = new Date().toLocaleString('ru-RU');
  const is_range = checkRange(x, y) ? 'Попала' : 'Не попала';
  const point = [x, y, r, is_range, tmp];

  points.push(point);

  savePoints(points);
  addPointToTable(point);

  drawZoomUpdate(zoom);
};

const clickClearButton = () => {
  hideError();

  points.length = 0;

  clearPoints();
  clearTable();

  drawZoomUpdate(zoom);
};

canvas.addEventListener('wheel', zoomOperation);
canvas.addEventListener('mousedown', selectedFromMove);
canvas.addEventListener('mousemove', moveMouse);
canvas.addEventListener('dblclick', createPoint);
window.addEventListener('mouseup', unselectedFromMove);

buttonCheck.addEventListener('click', clickCheckButton);
buttonClear.addEventListener('click', clickClearButton);

addToTable();
drawZoomUpdate(zoom);
