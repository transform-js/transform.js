import { MutationError } from "./errors.js";

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

export const m_as_string = (dst, s, base = 10) => {
  if (s && (s.constructor === String || s.constructor === Number))
    return '"' + (base === 16 ? "0x" : "") + s.toString(base) + '"';
  throw new MutationError();
};

export const m_uppercase = (dst, v) => {
  try {
    return v.toUpperCase();
  } catch (e) {
    throw new MutationError();
  }
};

/**********************/
/* Variadic mutations */
/**********************/

export const m_chain = (dst, toBeOperatedOn, fs) => {
  /* will treat arguments as middleware (mutations) functions */
  /* array of mutations and mutation chaining are similar */
  try {
    return fs.reduce((acc, f) => f(dst, acc), toBeOperatedOn);
  } catch (e) {
    throw new MutationError();
  }
};
