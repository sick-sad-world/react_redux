import React from 'react';
import PropTypes from 'prop-types';
import TextInput from 'common/components/forms/input-text';

// Form to create Twitter type feed
// ===========================================================================
export default function FormTwitter({ texts, value, running, onChange, onSubmit }) {
  return (
    <form name='Twitter'>
      <div className='row'>{texts.heading}</div>
      <TextInput
        className='row'
        name='url'
        label='Query'
        placeholder='#hastag or keyword'
        disabled={running}
        value={value}
        onChange={onChange}
        desc={texts.description}
      />
      <div className='row'>
        <input disabled={running} className='button is-accent size-half' type='button' value='Create' onClick={onSubmit} />
      </div>
    </form>
  );
}

FormTwitter.defaultProps = {
  texts: {
    heading: '(Enter the #hashtags or keywords to search on Twitter. Links will be pulled from the tweets that are found.)',
    description: 'Create source based on a Twitter search'
  },
  running: false
};

FormTwitter.propTypes = {
  texts: PropTypes.shape({
    heading: PropTypes.string,
    description: PropTypes.string
  }),
  running: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};
