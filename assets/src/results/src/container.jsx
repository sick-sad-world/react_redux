// Import helper stuff
// ===========================================================================
import { bindAll, findIndex } from 'lodash';
import scrollbarSize from 'dom-helpers/util/scrollbarSize';

// Import React related stuff
// ===========================================================================
import React from 'react';
import { AutoSizer, ArrowKeyStepper, List } from 'react-virtualized';
import { connect } from 'react-redux';

// Import selectors and typecheck
// ===========================================================================
import PropTypes from 'prop-types';
import { stateNum } from 'common/typecheck';
// import { defaultInterface } from '../defaults';
import { makeContainerSelector } from './selectors';

// Import child Components
// ===========================================================================

// description
// ===========================================================================
class ResultsContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
    bindAll(this, 'rowRenderer');
  }

  rowRenderer({ index, isScrolling, isVisible, key, parent, style }) {
    return (
      <div key={key} style={style}>{this.props.payload[index].title}</div>
    );
  }

  render() {
    const { state, payload } = this.props;
    const rowCount = payload.length;
    return (
      <AutoSizer>
        {({ height, width }) => (
          <List
            rowRenderer={this.rowRenderer}
            height={height}
            rowCount={rowCount}
            rowHeight={50}
            width={width}
          />
        )}
      </AutoSizer>
    );
  }
}

ResultsContainer.defaultProps = {};

// ResultsContainer.propTypes = {
//   id: PropTypes.number.isRequired,
//   width: PropTypes.number,
//   data: PropTypes.object.isRequired,
//   displaySettings: PropTypes.arrayOf(PropTypes.string).isRequired,
//   state: stateNum.isRequired,
//   payload: PropTypes.arrayOf(PropTypes.object).isRequired
// };

export default connect(makeContainerSelector())(ResultsContainer);
