// Import utility stuff
// ===========================================================================
import { capitalize } from 'lodash';

// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';
import FormSubmit from 'common/components/forms/form-submit';

function createMessage(text, changed) {
  return text.replace('{data}', capitalize(changed.map((change => change.replace('_', ' '))).join(', ')));
}

export default function Confirmation({ text, changed, running, apply, cancel }) {
  return (
    <div className='edit-confirmation'>
      <p>{(text.indexOf('{data}') > -1) ? createMessage(text, changed) : text}</p>
      <div>
        <FormSubmit loading={running} className='button is-accent' text='Apply' onClick={apply} />
        <a onClick={cancel} className='button'>Cancel</a>
      </div>
    </div>
  );
}

Confirmation.defaultProps = {
  running: false
};

Confirmation.propTypes = {
  changed: PropTypes.arrayOf(PropTypes.string).isRequired,
  running: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
  apply: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired
};
