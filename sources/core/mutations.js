/*******************/
/* Unary mutations */
/*******************/

export const m_is_number = (dst, n) => {
  return typeof n === "number";
};

export const m_any = (dst, s) => {
  return s;
};

export const m_stringify = (dst, a) => {
  return JSON.stringify(a);
};

export const m_as_string = (dst, s) => {
  return '"' + s.toString() + '"';
};

export const m_uppercase = (dst, v) => {
  return v.toUpperCase();
};

/**********************/
/* Variadic mutations */
/**********************/

export const m_chain = (dst, toBeOperatedOn, fs) => {
  /* will treat arguments as middleware (mutations) functions */
  /* array of mutations and mutation chaining are similar */
  return fs.reduce((acc, f) => f(dst, acc), toBeOperatedOn);
};
