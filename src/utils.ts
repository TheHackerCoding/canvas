const wait = (time: number) => {
  return new Promise(resolve => setTimeout(resolve, time));
}

const objLength = (x: {}): number => Object.keys(x).length

export {
  wait,
  objLength,
}