// Import React related stuff
// ===========================================================================
import React from 'react';
import Icon from './icon';

// Abstract Page Edit component
// ===========================================================================
export default class PageEdit extends React.Component {
  render () {
    let { className } = this.props;
    return (
      <section className={className}>
        <EditFormHeader {...headingData} />
        {this.props.children}
      </section>
    );
  }
}