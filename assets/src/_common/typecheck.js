export function email(props, propName, componentName) {
  if (!/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(props[propName])) {
    return new Error(`
      Invalid prop "${propName}" supplied to "${componentName}".
      Should be an email like: "blablabla-okay@gmail.com"
      Validation failed.
    `);
  }
  return undefined;
}

export function state(props, propName, componentName) {
  if ([0, 1, 2, 3].find(code => code === props[propName])) {
    return new Error(`
      Invalid prop "${propName}" supplied to "${componentName}".
      Status is a number from 0 to 3. Where 0 - error, 1 - initial, 2 - idle, 3 - loading.
      Validation failed.
    `);
  }
  return undefined;
}

export function numBool(props, propName, componentName) {
  if ([0, 1].find(code => code === props[propName])) {
    return new Error(`
      Invalid prop "${propName}" supplied to "${componentName}".
      Number boolean means that value should be 1 for "true" and 0 for "false"
      Validation failed.
    `);
  }
  return undefined;
}
