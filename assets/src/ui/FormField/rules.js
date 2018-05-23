import { every, includes } from 'lodash';

const REGEXP = {
  url: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
  email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  number: /^[-+]?(?:\d*[.])?\d+$/,
  float: /^(?:[-+]?(?:\d+))?(?:\.\d*)?(?:[eE][\+\-]?(?:\d+))?$/
};

const isAbsent = val => val === null || val === undefined;

const isStr = val => typeof val === 'string';

const isEmptyStr = val => val === '';

const matchReg = (val, reg) => isStr(val) && reg.test(val);

const rules = {
  required(val, opts) {
    const m = opts.message || 'This value is required';
    return !isAbsent(val) || m;
  },
  match(val, { pattern, ...opts }) {
    const m = opts.message || `This value match ${pattern.toString()} pattern.`;
    return isAbsent(val) || (matchReg(`${val}`, pattern) || m);
  },
  numeric(val, opts) {
    const m = opts.message || 'This value should a number';
    return isAbsent(val) || ((typeof val === 'number' || matchReg(`${val}`, REGEXP.number)) || m);
  },
  float(val, opts) {
    const m = opts.message || 'This value should a number with a float point';
    return isAbsent(val) || (matchReg(`${val}`, REGEXP.float) || m);
  },
  url(val, opts) {
    const m = opts.message || 'This value expected to be valid URL address';
    return isAbsent(val) || (matchReg(`${val}`, REGEXP.url) || m);
  },
  email(val, opts) {
    const m = opts.message || 'This value expected to be email address';
    return isAbsent(val) || (matchReg(`${val}`, REGEXP.email) || m);
  },
  maxLength(val, { treshold, ...opts }) {
    const m = opts.message || `Maximum length is ${treshold}`;
    return isAbsent(val) || ((isStr(val) && val.length <= treshold) || m);
  },
  equal(val, { match, loose, ...opts }) {
    const m = opts.message || `This value ${(loose) ? 'contain' : 'equal'} to: ${match}`;
    const isValid = (loose) ? val.indexOf(match) > -1 : val === match;
    return isAbsent(val) || (isValid || m);
  },
  oneOf(val, { possible = [], ...opts }) {
    const m = opts.message || `This value should be one of: ${possible.join(', ')}`;
    return isAbsent(val) || (!!possible.find(itm => itm === val) || m);
  },
  file(val, { size, type, ...opts }) {
    if (!isAbsent(val)) {
      if (type && (val.type !== type && !includes(type, val.type))) {
        return `File: ${val.name} does not match allowed type list`;
      } else if (size && val.size > (size * 1024)) {
        return `File: ${val.name} exceeds maximum size allowed`;
      }
    }
    return true;
  }
};

export function addRules(newRules) {
  Object.entries(newRules).forEach((([k, v]) => {
    if (typeof v !== 'function') {
      throw new Error(`Validator ${k} is not a function. Each new custom validator should be a [Func] -> @bool or @string if validation failed.`);
    }
    if (typeof rules[k] === 'function') {
      throw new Error(`Validator ${k} already declared. Change name. Overriding may cause issues`);
    }
  }));

  Object.assign(rules, newRules);
}

export default rules;
