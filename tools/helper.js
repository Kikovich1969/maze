/**
 * @param {number} min smallest number
 * @param {number} max highest number
 */
function generateRandomIntegerInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * @param {Array} arr Array to pick from
 * @param {number} count count of picks
 */
function pickRandom(arr, count) {
  let _arr = [...arr];
  return [...Array(count)].map(
    () => _arr.splice(Math.floor(Math.random() * _arr.length), 1)[0]
  );
}


export { generateRandomIntegerInRange, pickRandom };
