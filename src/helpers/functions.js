export const inject = (target, mixin) => {
  for (let key in mixin) {
    if (key !== '_inject' && !(target[key] instanceof Function)) {
      target[key] = mixin[key].bind(target);
    }
  } 
}