import makeFormInput from '../FormField';
import RadioButton from './component';

function getValue({target}, {name, value}) {
  return {
    [name]: (target.checked) ? value : null
  }
}

export default makeFormInput(getValue)(RadioButton);