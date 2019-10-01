/* eslint-disable camelcase */
import { MutationError } from './errors.js'

/*******************/
/* Unary mutations */
/*******************/

export const m_is_number = (src, dst, n) => {
  return typeof n === 'number'
}

export const m_any = (src, dst, s) => {
  return s
}

export const m_stringify = (src, dst, a) => {
  return JSON.stringify(a)
}

export const m_as_string = (src, dst, s, base = 10) => {
  if (s && (s.constructor === String || s.constructor === Number)) { return '"' + (base === 16 ? '0x' : '') + s.toString(base) + '"' }
  throw new MutationError()
}

export const m_uppercase = (src, dst, v) => {
  try {
    return v.toUpperCase()
  } catch (e) {
    throw new MutationError()
  }
}

/**********************/
/* Variadic mutations */
/**********************/

export const m_chain = (src, dst, toBeOperatedOn, fs) => {
  /* will treat arguments as middleware (mutations) functions */
  /* array of mutations and mutation chaining are similar */
  try {
    return fs.reduce((acc, f) => f(src, dst, acc), toBeOperatedOn)
  } catch (e) {
    throw new MutationError()
  }
}

/* eslint-enable camelcase */
