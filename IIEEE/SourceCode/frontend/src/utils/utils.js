//켈빈 -> 화씨
export const kvToFh = (kelvin) => {
  const fahrenheit = (kelvin - 273.15) * (9 / 5) + 32;
  const pointFix = fahrenheit.toFixed(0);
  return pointFix;
};
