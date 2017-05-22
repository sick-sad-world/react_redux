// Import React related stuff
// ===========================================================================
import React from 'react';
import { connect } from 'react-redux';

// Import selectors and typecheck
// ===========================================================================
import PropTypes from 'prop-types';
import { defaultInterface, width } from '../defaults';
import { makeContainerSelector } from '../selectors';

// Import child Components
// ===========================================================================
import { DashboardColumns, DashboardItem } from 'src/columns';
import { ResultsContainer, getResults, resultError } from 'src/results';
import DashboardList from '../components/list';

function Dashboard({ payload, emptyTpl, column, location, getResults }) {
  return (
    <section className='mod-dashboard'>
      {(payload) ? (
        <DashboardColumns column_ids={payload.column_ids}>
          {props => (
            <DashboardList width={width} column={column} {...props}>
              {({ payload, editColumn, deleteColumn }) => (
                <DashboardItem payload={payload} editColumn={editColumn} deleteColumn={deleteColumn} getResults={getResults}>
                  <ResultsContainer
                    id={payload.id}
                    sort={payload.data.sort}
                    data={payload.data}
                    location={location.pathname}
                    displaySettings={payload.display_settings}
                  />
                </DashboardItem>
              )}
            </DashboardList>
          )}
        </DashboardColumns>
      ) : emptyTpl }
    </section>
  );
}

Dashboard.defaultProps = {
  emptyTpl: <div className='state-empty'>Oups... Dashboard not found</div>
};

Dashboard.propTypes = {
  payload: PropTypes.shape(defaultInterface),
  column: PropTypes.number,
  getResults: PropTypes.func.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string
  }).isRequired,
  emptyTpl: PropTypes.element.isRequired
};

// Connect our Container to State
// @ deps -> Dashboards
// ===========================================================================
export default connect(makeContainerSelector(), dispatch => ({
  getResults(...args) {
    return dispatch(getResults(...args)).catch(err => dispatch(resultError(err)));
  }
}))(Dashboard);
