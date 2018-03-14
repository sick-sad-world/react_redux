import makeFormInput from '../FormField';
import TextInput from './component';

function getValue({ target }, {name}) {
  return { [name]: (target.value.length) ? target.value : null };
}

export default makeFormInput(getValue)(TextInput);
