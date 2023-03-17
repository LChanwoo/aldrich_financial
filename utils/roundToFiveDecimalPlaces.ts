export function roundToFiveDecimalPlaces(number : number) {
  return Math.round(number * 100000) / 100000;
}