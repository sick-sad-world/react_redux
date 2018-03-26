import makeFormInput from '../FormField';
import Switcher from './component';

function getValue({target}, {name, options}) {
  const v = (options[target.value] !== undefined) ? options[target.value].value : '';
  return { [name]: v }
}

export default makeFormInput(getValue)(Switcher);