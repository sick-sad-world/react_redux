import React from 'react';
import PropTypes from 'prop-types';
import TextInput from 'common/components/forms/input-text';

// Form to create Reddit type feed
// ===========================================================================
export default function FormReddit({ texts, value, loading, onChange, onSubmit }) {
  return (
    <form name='Reddit'>
      <div className='row'>{texts.heading}</div>
      <TextInput
        className='row'
        name='url'
        label='Subreddit /r/'
        placeholder='subreddit'
        disabled={loading}
        value={value}
        onChange={onChange}
        desc={texts.description}
      />
      <div className='row'>
        <input disabled={loading} className='button is-accent size-half' type='button' value='Create' onClick={onSubmit} />
      </div>
    </form>
  );
}

FormReddit.defaultProps = {
  texts: {
    heading: '(The part after /r/ in the URL of this subreddit)',
    description: 'Create source based on a subreddit at Reddit'
  },
  loading: false
};

FormReddit.propTypes = {
  texts: PropTypes.shape({
    heading: PropTypes.string,
    description: PropTypes.string
  }),
  loading: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};
