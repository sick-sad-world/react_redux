import React from 'react';
import PropTypes from 'prop-types';
import TextInput from 'common/components/forms/input-text';

// Form to run HTML scrapping
// ===========================================================================
export default function FormHtml({ texts, value, loading, success, onChange, onSubmit, testHandler }) {
  return (
    <form name='HTML'>
      <TextInput
        className='row'
        name='url'
        label='Url to parse'
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

FormHtml.defaultProps = {
  texts: {
    heading: '(if you want to visit the source in your browser, this is where you would go)',
    description: 'Click "Test URL".  If links appear in the right hand pane and some of them are links to articles, HTML scraping works for this site. Click "Create" to start tracking the site using this method.'
  },
  loading: false
};

FormHtml.propTypes = {
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
