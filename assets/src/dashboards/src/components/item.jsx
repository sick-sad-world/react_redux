// Import helper stuff
// ===========================================================================
import { bindAll } from 'lodash';

// Import React related stuff
// ===========================================================================
import React from 'react';

// Import selectors and typecheck
// ===========================================================================
import PropTypes from 'prop-types';
import { stateNum } from 'common/typecheck';

// Import child components
// ===========================================================================
import ItemHeader from './item-header';

export default class DashboardItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }
  render() {
    const { style, payload } = this.props;
    return (
      <div style={style}>
        <section className='mod-column'>
          <ItemHeader name={payload.name}/>
        </section>
      </div>
    );
  }
}

DashboardItem.propTypes = {
  style: PropTypes.object.isRequired,
  payload: PropTypes.object.isRequired
};

