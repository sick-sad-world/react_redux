import PropTypes from 'prop-types';

export const emailRegExp = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

export const webHookRegExp = /^https:\/\/hooks.slack.com\/services\/\S*$/;

export default function createOptionableValidator(validator) {
  function validate(isRequired, props, propName, componentName, location) {
    if (props[propName] === null || props[propName] === undefined) {
      return (!isRequired) ? undefined : new Error(`
        Required prop "${propName}" is not supplied to "${componentName}".
        Should be not "null" and not "undefined"
        Validation failed.
      `);
    }
    const result = validator(props, propName, componentName, location);
    return (result) ? new Error(`
      Invalid prop "${propName}" supplied to "${componentName}".
      ${result}
      Passed: ${props[propName]}
      Validation failed.
    `) : result;
  }

  const chainedValidate = validate.bind(null, false);
  chainedValidate.isRequired = validate.bind(null, true);

  return chainedValidate;
}

export const optionShape = (type = 'string') => PropTypes.arrayOf(PropTypes.shape({
  value: PropTypes[type].isRequired,
  label: PropTypes.string.isRequired
}));

export const textShape = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  confirmation: PropTypes.string.isRequired
};

export const listShape = {
  id: PropTypes.number,
  name: PropTypes.string.isRequired,
  order: PropTypes.number,
  counter: PropTypes.number
};

export const childrenShape = PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element]);

export const actionShape = {
  btn: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string
};

export const critereaShape = {
  disabled: PropTypes.arrayOf(PropTypes.number),
  ids: PropTypes.arrayOf(PropTypes.number),
  search: PropTypes.string
};

export const emailStr = createOptionableValidator((props, propName) => {
  if (!emailRegExp.test(props[propName])) {
    return new Error('Should be an email like: "blablabla-okay@gmail.com"');
  }
  return undefined;
});

export const webHookStr = createOptionableValidator((props, propName) => {
  if (!webHookRegExp.test(props[propName])) {
    return new Error('Should be an Slack webhook starting with: "https://hooks.slack.com/services"');
  }
  return undefined;
});

export const imageUrl = createOptionableValidator((props, propName) => {
  if (!/\.(png|jpe?g|gif)$/.test(props[propName])) {
    return new Error('Should be an URL leading to image (ending with .jpeg, .gif, .png, .jpg)');
  }
  return undefined;
});

export const stateNum = createOptionableValidator((props, propName) => {
  if ([0, 1, 2, 3].find(code => code === props[propName]) === undefined) {
    return new Error('Status is a number from 0 to 3. Where 0 - error, 1 - initial, 2 - idle, 3 - loading.');
  }
  return undefined;
});

export const directionString = createOptionableValidator((props, propName) => {
  if (props[propName] !== 'asc' && props[propName] !== 'desc') {
    return new Error('Direction of column results should be a string "asc" or "desc"');
  }
  return undefined;
});

export const numBool = createOptionableValidator((props, propName) => {
  if ([0, 1].find(code => code === props[propName]) === undefined) {
    return new Error('Number boolean means that value should be 1 for "true" and 0 for "false"');
  }
  return undefined;
});
