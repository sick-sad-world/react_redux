import React from 'react';
import PropTypes from 'prop-types';
import TextInput from 'common/components/forms/input-text';

// Form to run RSS feed testing
// ===========================================================================
export default function FormFacebook({ texts, feed, url, running, success, onChange, onSubmit }) {
  return (
    <form name='RSS'>
      <div className='row'>{texts.heading}</div>
      <TextInput
        className='row'
        name='feed'
        label='Facebook URL'
        placeholder='https://www.facebook.com/....'
        disabled={running}
        value={feed}
        onChange={onChange}
        desc={texts.feed}
      />
      <TextInput
        className='row'
        name='url'
        label='Feed url'
        placeholder='http://something.com'
        disabled={running}
        value={url}
        onChange={onChange}
        desc={texts.description}
      />
      <div className='row button-group'>
        <input className='button is-accent size-half' disabled={running} type='button' value='Create' onClick={onSubmit} />
      </div>
      <div className='form-description'>{ texts.description }</div>
    </form>
  );
}

FormFacebook.defaultProps = {
  texts: {
    feed: '(URL of a facebook page)',
    url: '(If the Facebook page is related to a website, enter the URL here, otherwise put the FB URL in here too)',
    description: 'Searching for Facebook pages related to URL.'
  },
  running: false
};

FormFacebook.propTypes = {
  texts: PropTypes.shape({
    feed: PropTypes.string,
    url: PropTypes.string,
    description: PropTypes.string
  }),
  running: PropTypes.bool.isRequired,
  feed: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};