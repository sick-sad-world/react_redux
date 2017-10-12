import React from 'react';
import PropTypes from 'prop-types';
import TextInput from 'common/components/forms/input-text';
import Checkbox from 'common/components/forms/checkbox';

// Form to run RSS feed testing
// ===========================================================================
export default function FormAutodetect({ texts, value, loading, success, activeTypes, onChange, onSubmit, testHandler, changeType }) {
  return (
    <form name='autodetect'>
      <TextInput
        className='row'
        label='Url to test'
        name='url'
        onChange={onChange}
        value={value}
        descr={texts.heading}
      />
      <h4>{texts.typeDescr}</h4>
      <div className='row-flex'>
        <Checkbox
          name='type'
          title='RSS Feed'
          value='RSS'
          disabled={loading}
          checked={activeTypes.indexOf('RSS') > -1}
          onChange={changeType}
        />
        <Checkbox
          name='type'
          title='Facebook Page'
          value='Facebook'
          disabled={loading}
          checked={activeTypes.indexOf('Facebook') > -1}
          onChange={changeType}
        />
        <Checkbox
          name='type'
          title='HTML Scraping'
          value='HTML'
          disabled={loading}
          checked={activeTypes.indexOf('HTML') > -1}
          onChange={changeType}
        />
      </div>
      <div className='row button-group'>
        <input type='submit' value='Test URL' onClick={testHandler} className='button is-accent size-half' />
        <input className='button is-accent size-half' disabled={loading || !success} type='button' value='Create' onClick={onSubmit} />
      </div>
      <div className='form-description'>{ texts.description }</div>
    </form>
  );
}

FormAutodetect.defaultProps = {
  texts: {
    heading: '(if you want to visit the source in your browser, this is where you would go)',
    typeDescr: 'Pick type(s) of source to autodetect',
    description: 'Selecting one of feeds founded by given url will make RSS type feed. If this is facebook feed - it will create Facebook type feed. Else it will create HTML feed.'
  },
  loading: false
};

FormAutodetect.propTypes = {
  texts: PropTypes.shape({
    heading: PropTypes.string.isRequired,
    typeDescr: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
  }),
  activeTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
  success: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
  testHandler: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  changeType: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};
