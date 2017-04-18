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

export function imageUrl(props, propName, componentName) {
  if (!/\.(png|jpe?g|gif)$/.test(props[propName])) {
    return new Error(`
      Invalid prop "${propName}" supplied to "${componentName}".
      Should be an URL leading to image (ending with .jpeg, .gif, .png, .jpg)
      Validation failed.
    `);
  }
  return undefined;
}

export function stateNum(props, propName, componentName) {
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
