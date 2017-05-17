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
import { ResultsContainer } from 'src/results';
import DashboardList from '../components/list';

function Dashboard({ payload, emptyTpl, column }) {
  return (
    <section className='mod-dashboard'>
      {(payload) ? (
        <DashboardColumns column_ids={payload.column_ids}>
          {props => (
            <DashboardList width={width} column={column} {...props}>
              {({ key, payload, editColumn, deleteColumn }) => (
                <DashboardItem payload={payload} editColumn={editColumn} deleteColumn={deleteColumn}>
                  <ResultsContainer width={width} data={payload.data} id={payload.id} displaySettings={payload.display_settings} />
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
  emptyTpl: PropTypes.element.isRequired
};

// Connect our Container to State
// @ deps -> Dashboards
// ===========================================================================
export default connect(makeContainerSelector())(Dashboard);
