// Import utility stuff
// ===========================================================================
import { deleteColumn } from '../actions';

// Import React related stuff
// ===========================================================================
import React from 'react';
import { connect } from 'react-redux';

// Import selectors and typecheck
// ===========================================================================
import PropTypes from 'prop-types';
import { stateNum } from 'common/typecheck';
import { defaultInterface } from '../defaults';
import { makeListSelector } from '../selectors';

// Import child components
// ===========================================================================
import DataContainer from 'common/components/data-container';

function ColumnsContainer({ children, ...props }) {
  return children(props);
  /* return (
    <DataContainer {...props}
      renderConfirmation={deleting => (
        <dl>
          <dt>Trendolizer Feed</dt>
          <dd>{`ID: ${deleting.id} - ${deleting.name}`}</dd>
        </dl>
      )
    }/>
  );*/
}

ColumnsContainer.propTypes = {
  criterea: PropTypes.shape({
    disabled: PropTypes.arrayOf(PropTypes.number),
    column_ids: PropTypes.arrayOf(PropTypes.number),
    seach: PropTypes.string
  }),
  // children: PropTypes.func.isRequired,
  state: stateNum.isRequired,
  payload: PropTypes.arrayOf(PropTypes.shape(defaultInterface)).isRequired
};

// Connect our Container to State
// @ deps -> Columns
// ===========================================================================
function mapStateToProps() {
  const selector = makeListSelector();
  return (state, props) => selector(state, props);
}
export default connect(mapStateToProps(), { deleteItem: deleteColumn })(ColumnsContainer);
