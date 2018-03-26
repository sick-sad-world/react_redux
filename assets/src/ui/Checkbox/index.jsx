import makeFormInput from '../FormField';
import Checkbox from './component';

function getValue({ target }, {name, numBool, value}) {
  if (numBool) {
    return { [name]: (target.checked) ? 1 : 0 }
  } else {
    return { [name]: (target.checked) ? value : null }
  }
}

export default makeFormInput(getValue)(Checkbox);