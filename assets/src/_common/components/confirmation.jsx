// Import utility stuff
// ===========================================================================
import { capitalize } from 'lodash';

// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';

export default function Confirmation({ text, changed, apply, cancel }) {
  let message = text;
  if (text.indexOf('{data}') > -1) {
    message = text.replace('{data}', capitalize(changed.map((change => change.replace('_', ' '))).join(', ')));
  }

  return (
    <div className='edit-confirmation'>
      <p>{message}</p>
      <div>
        <a onClick={apply} className='button is-accent'>Apply</a>
        <a onClick={cancel} className='button'>Cancel</a>
      </div>
    </div>
  );
}

Confirmation.propTypes = {
  changed: PropTypes.arrayOf(PropTypes.string).isRequired,
  text: PropTypes.string.isRequired,
  apply: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired
};
