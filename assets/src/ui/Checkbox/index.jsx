import makeFormInput from '../FormField';
import Checkbox from './component';

function getValue({ target }, {name, numBool}) {
  if (numBool) {
    return { [name]: (target.checked) ? 1 : 0 };
  } else {
    return { [name]: target.value };
  }
}

export default makeFormInput(getValue)(Checkbox);