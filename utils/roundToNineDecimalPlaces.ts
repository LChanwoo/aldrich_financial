export function roundToNineDecimalPlaces(number : number) {
  return Math.round(number * 1000000000) / 1000000000;
}