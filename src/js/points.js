import { loadPoints } from './storage.js';

export const points = loadPoints();
export let global_r = 1;

export const setGlobalR = (value) => {
  global_r = value;
};

export const checkRange = (x, y) => {
  if (y <= -2 * x + global_r && x <= global_r / 2 && y <= global_r) {
    return true;
  } else if (x >= -global_r && x <= 0 && -y <= 0 && y >= -global_r / 2) {
    return true;
  } else if (x ** 2 + y ** 2 <= global_r ** 2 && x <= 0 && y >= 0) {
    return true;
  }

  return false;
};
