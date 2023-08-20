export const sizeCalc = (size: number) => {
  let i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  const newSize = (size / Math.pow(1024, i)).toFixed(1);
  return Number(newSize) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
};
