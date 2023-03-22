export function roundToFiveDecimalPlaces(number : number) {
  return Math.round(number * 10000) / 10000;
}