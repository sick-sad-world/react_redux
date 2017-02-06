export const inject = (target, mixin) => {
  for (let key in mixin) {
    if (key !== '_inject' && !(target[key] instanceof Function)) {
      target[key] = mixin[key].bind(target);
    }
  } 
}

export const numOrString = (str, base = 10) => {
  let int = parseFloat(str, base);
  return (int !== int) ? str : int; 
}