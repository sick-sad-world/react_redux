import PropTypes from 'prop-types';

export const emailRegExp = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

export const webHookRegExp = /^https:\/\/hooks.slack.com\/services\/\S*$/;

/** Helper Fabric method for keeping chained style of PropTypes */
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

/** Simple value shape */
export const valueShape = PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]);

export const optionShape = PropTypes.arrayOf(PropTypes.shape({
  label: PropTypes.string.isRequired,
  value: valueShape
}));

/** Default options shape for Dropdowns, switchers, e.t.c */
export const optionShapeExtended = (size = 0, labelProp = 'label') => createOptionableValidator((props, propName) => {
  if (size > 0 && props[propName].length > size) {
    return new Error(`[${propName}] options list is too long. Shold be no more that ${size} items`);
  }

  if (props[propName].length > 0) {
    props[propName].forEach((item) => {
      if (item.value === undefined || item[labelProp] === undefined) {
        return new Error(`[${propName}] options list should be an Array(Object(label: | value:))`);
      }
    })
  }

  return undefined;
});

/** All possible variations of ClassNames definitions based on classNames https://github.com/JedWatson/classnames */
export const classNameShape = PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string), PropTypes.objectOf(PropTypes.bool)]);

/** Shape of valid property provided by React-Validable */
export const validShape = PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.arrayOf(PropTypes.string)]);

/** Generall error shape Message or false */
export const validationMessageShape = PropTypes.oneOfType([PropTypes.string, PropTypes.bool]);

/** Common React Children possible options */
export const childrenShape = PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.arrayOf(PropTypes.node)]);

/** Check prop to be valid email string */
export const emailStr = createOptionableValidator((props, propName) => {
  if (!emailRegExp.test(props[propName])) {
    return new Error(`[${propName}] Should be an email like: "blablabla-okay@gmail.com"`);
  }
  return undefined;
});

/** Check prop to be valid Slack webhook url */
export const webHookStr = createOptionableValidator((props, propName) => {
  if (!webHookRegExp.test(props[propName])) {
    return new Error(`[${propName}] Should be an Slack webhook starting with: "https://hooks.slack.com/services"`);
  }
  return undefined;
});
