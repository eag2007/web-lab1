const logs = document.getElementById('logs');

export const toDecimal = (value) => {
  value = value.trim();

  if (!/^-?\d+(\.\d+)?$/.test(value)) {
    return null;
  }

  return new Decimal(value);
};

export const showError = (message) => {
  logs.innerHTML += `<label style="font-size: 15px">${message}</label>`;
  logs.style.display = 'block';
};

export const hideError = () => {
  logs.textContent = '';
  logs.style.display = 'none';
};
