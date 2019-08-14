/* get value by its path in obj */
export const jsonGetByPath = (obj, path) => {
  for (var i = 0, path = path.split("."), len = path.length; i < len; i++)
    obj = obj[path[i]];
  return obj;
};

/* mutate obj[path] to value */
/* create path in obj if it doesnt exists */
/* https://stackoverflow.com/a/18022123 */
export const jsonSetbyPath = (obj, val, path) => {
  const fields = path.split(".");
  for (let i = 0, n = fields.length; i < n && obj !== undefined; i++) {
    let field = fields[i];
    if (i === n - 1) {
      obj[field] = val;
    } else {
      if (
        typeof obj[field] === "undefined" ||
        obj[field].constructor !== Object
      )
        obj[field] = {};
      obj = obj[field];
    }
  }
};

/* remove all keys/value pair for a given 'filter' value */
export const jsonRemoveKeysContaining = (j, filter /* = CONSTANTS.MAGIC */) => {
  Object.entries(j).forEach(([k, v]) => {
    if (v && v.constructor === Object)
      /* recursive */
      jsonRemoveKeysContaining(v, filter);
    if (v.constructor === Array) j[k] = v.filter(e => e !== filter);
    if (v === filter) delete j[k];
  });
  return j;
};

/* Remove null/undefined/zero-length objects/arrays */
export const cleanObject = object => {
  Object.entries(object).forEach(([k, v]) => {
    if (v && v.constructor === Object) cleanObject(v);
    if (
      (v && v.constructor === Object && !Object.keys(v).length) ||
      v === null ||
      v === undefined ||
      v.length === 0
    ) {
      delete object[k];
    }
  });
  return object;
};
