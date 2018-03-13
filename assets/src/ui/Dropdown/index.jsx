import makeFormInput from '../FormField';
import Dropdown from './component';

function getValue(e, {name}) {
  return {
    [name]: (e && e.value) ? e.value : e
  }
}

export default makeFormInput(getValue)(Dropdown);