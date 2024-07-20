export function average(arr: number[]) {
  if (arr.length === 0) return 0;

  const sum = arr.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );
  return sum / arr.length;
}

export function stdDev(arr: number[]) {
  if (arr.length === 0) return 0;

  const mean = average(arr);
  const squaredDifferences = arr.map((value) => {
    const difference = value - mean;
    return difference * difference;
  });

  const averageSquaredDifference = average(squaredDifferences);
  return Math.sqrt(averageSquaredDifference);
}
