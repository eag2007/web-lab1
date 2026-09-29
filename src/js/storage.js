export const loadPoints = () => {
  return JSON.parse(localStorage.getItem('points')) || [];
};

export const savePoints = (points) => {
  localStorage.setItem('points', JSON.stringify(points));
};

export const clearPoints = () => {
  localStorage.removeItem('points');
};

export const loadLines = () => {
  return JSON.parse(localStorage.getItem('lines')) || [];
};

export const saveLines = (lines) => {
  localStorage.setItem('lines', JSON.stringify(lines))
};

export const clearLines = () => {
  localStorage.removeItem('lines')
};