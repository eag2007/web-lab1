export const loadPoints = () => {
  return JSON.parse(localStorage.getItem('points')) || [];
};

export const savePoints = (points) => {
  localStorage.setItem('points', JSON.stringify(points));
};

export const clearPoints = () => {
  localStorage.removeItem('points');
};