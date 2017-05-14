// Import React related stuff
// ===========================================================================
import React from 'react';
import { connect } from 'react-redux';

// Import selectors and typecheck
// ===========================================================================
import PropTypes from 'prop-types';
import { defaultInterface } from '../defaults';
import { makeContainerSelector } from '../selectors';

// Import child Components
// ===========================================================================
import { DashboardColumns, DashboardItem } from 'src/columns';
import DashboardList from '../components/list';

function Dashboard({ payload, emptyTpl, column }) {
  return (
    <section className='mod-dashboard'>
      {(payload) ? (
        <DashboardColumns column_ids={payload.column_ids}>
          {props => (
            <DashboardList column={column} {...props}>
              {({ key, ...itemProps }) => <DashboardItem {...itemProps}/>}
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
function mapStateToProps() {
  const selector = makeContainerSelector();
  return (state, props) => selector(state, props);
}

export default connect(mapStateToProps())(Dashboard);
