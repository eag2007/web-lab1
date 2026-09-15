import { points } from './points.js';

const value_table = document.getElementsByTagName('tbody')[0];

export const addPointToTable = (point) => {
  const [x, y, r, is_range, time] = point;

  value_table.innerHTML += `<tr>
                              <td>${x}</td>
                              <td>${y}</td>
                              <td>${r}</td>
                              <td>${is_range}</td>
                              <td>${time}</td>
                           </tr>`;
};

export const clearTable = () => {
  value_table.innerHTML = '';
};

export const addToTable = () => {
  for (const i of points) {
    value_table.innerHTML += `<tr>
                                <td>${i[0]}</td>
                                <td>${i[1]}</td>
                                <td>${i[2]}</td>
                                <td>${i[3]}</td>
                                <td>${i[4]}</td>
                             </tr>`;
  }
};
