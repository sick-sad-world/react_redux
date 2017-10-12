import React from 'react';
import PropTypes from 'prop-types';
import TextInput from 'common/components/forms/input-text';

// Form to run RSS feed testing
// ===========================================================================
export default function FormRss({ texts, value, loading, success, onChange, onSubmit, testHandler }) {
  return (
    <form name='RSS'>
      <TextInput
        className='row'
        name='url'
        label='Url to test'
        placeholder='http://something.com'
        disabled={loading}
        value={value}
        onChange={onChange}
        desc={texts.heading}
      />
      <div className='row button-group'>
        <input type='submit' value='Test URL' onClick={testHandler} className='button is-accent size-half' />
        <input className='button is-accent size-half' disabled={loading || !success} type='button' value='Create' onClick={onSubmit} />
      </div>
      <div className='form-description'>{ texts.description }</div>
    </form>
  );
}

FormRss.defaultProps = {
  texts: {
    heading: '(if you want to visit the source in your browser, this is where would you go)',
    description: 'Click "Test URL" and click one or more of the detected feeds (if any appear), then click "Create" to start tracking them.'
  },
  loading: false
};

FormRss.propTypes = {
  texts: PropTypes.shape({
    heading: PropTypes.string,
    description: PropTypes.string
  }),
  success: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
  testHandler: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};
