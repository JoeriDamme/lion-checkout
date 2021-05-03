/**
 * Sort array by key. Native solution from Lodash.
 * @param {Array} arr 
 * @param {String} key 
 * @returns {Array} sorted array by key.
 */
export function sortBy(arr, key) {
  return arr.concat().sort((a, b) => (a[key] > b[key]) ? 1 : ((b[key] > a[key]) ? -1 : 0));
}


/**
 * Group collection by key
 * @param {Array} arr 
 * @param {String} property 
 * @returns {Array} sorted array by key.
 */
export function groupBy(arr, property) {
  return arr.reduce(function (acc, obj) {
    var key = obj[property];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {});
}