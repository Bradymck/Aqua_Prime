export const validateCoordinates = (x: number, y: number): boolean => {
  return x >= 0 && x < 50 && y >= 0 && y < 30;
} 