import { loadLines, loadPoints, saveLines } from './storage.js';

export const createLine = (x, y, global_R) => {
  const points = loadPoints();
  let bestPoint = null;
  let distation = Infinity;

  if (points.length < 2) {
    return;
  }

  for (const point of points.slice(0, -1)) {
    const [x_point, y_point, r_point] = point;
    const pointX = (x_point * global_R) / r_point;
    const pointY = (y_point * global_R) / r_point;
    const distance = (x - pointX) ** 2 + (y - pointY) ** 2;

    if (distance < distation) {
      bestPoint = [pointX, pointY];
      distation = distance;
    }
  }

  if (bestPoint === null) {
    return;
  }

  const lines = loadLines();
  lines.push([bestPoint[0], bestPoint[1], x, y, global_R]);
  saveLines(lines);
};
