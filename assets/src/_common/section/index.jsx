// Import utility stuff
// ===========================================================================
import classNames from 'classnames';

// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';

// Import child components
// ===========================================================================
import SectionHeader from './header.jsx';

export default function SectionWrapper({ url, title, description, running, children, className }) {
  return (
    <section className={classNames('mod-subsection-edit', className, { 'state-loading': running })}>
      <SectionHeader url={url} title={title} description={description} />
      {children}
    </section>
  );
}

SectionWrapper.defaultProps = {
  running: false
};

SectionWrapper.propTypes = {
  running: PropTypes.bool.isRequired,
  url: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.arrayOf(PropTypes.element)
};
