export function calCoinPrice(price:any ) : number {
  if( typeof price === "string" ) price = price.replace(",","")
  price = Number(price);
  let unit = 1; // 거래 단위를 1원으로 초기화합니다.

  // 거래 가격이 1000원 이상일 경우 1000원 단위로 거래합니다.
  if (price < 0.1) {
    unit = 0.0001;
  }

  // 거래 가격이 10000원 이상일 경우 5000원 단위로 거래합니다.
  else if (price< 1) {
    unit = 0.001;
  }

  // 거래 가격이 50000원 이상일 경우 10000원 단위로 거래합니다.
  else if (price < 10) {
    unit = 0.01;
  }

  // 거래 가격이 100000원 이상일 경우 50000원 단위로 거래합니다.
  else if (price < 100) {
    unit = 0.1;
  }

  // 거래 가격이 500000원 이상일 경우 100000원 단위로 거래합니다.
  else if (price <1000) {
    unit = 1;
  }

  // 거래 가격이 1000000원 이상일 경우 500000원 단위로 거래합니다.
  else if (price < 10000) {
    unit = 5;
  }

  // 거래 가격이 5000000원 이상일 경우 1000000원 단위로 거래합니다.
  else if (price < 100000) {
    unit = 10;
  }

  // 거래 가격이 10000000원 이상일 경우 5000000원 단위로 거래합니다.
  else if (price < 500000) {
    unit = 50;
  }

  // 거래 가격이 50000000원 이상일 경우 10000000원 단위로 거래합니다.
  else if (price < 1000000) {
    unit = 100;
  }

  // 거래 가격이 100000000원 이상일 경우 50000000원 단위로 거래합니다.
  else if (price < 2000000) {
    unit = 500;
  }
  else if (price >= 2000000) {
    unit = 1000;
  }

  // 거래 가격을 거래 단위로 나누어서 소숫점 이하를 버리고, 다시 거래 단위를 곱하여 최종 거래 가격을 계산합니다.
  const result = Math.floor(price / unit) * unit;
  console.log("price", price)
  console.log("unit", unit)
  console.log("price/unit", price/unit)
  return result;
}