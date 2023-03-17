export function getColorByIndex(index) {
  const colors = [
    '#FF0000', // 빨강
    '#FFA500', // 주황
    '#FFFF00', // 노랑
    '#008000', // 초록
    '#00FFFF', // 하늘
    '#0000FF', // 파랑
    '#800080', // 보라
    '#FF00FF', // 자홍
    '#A52A2A', // 갈색
    '#808080', // 회색
  ];

  return colors[index % colors.length];
}