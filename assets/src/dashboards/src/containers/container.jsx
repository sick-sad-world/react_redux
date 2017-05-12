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
import { ColumnsContainer } from 'src/columns';
import DashboardList from '../components/list';
import DashboardItem from '../components/item';

function Dashboard({ payload, emptyTpl }) {
  return (
    <section className='mod-dashboard'>
      {(payload) ? (
        <ColumnsContainer criterea={{ column_ids: payload.column_ids, open: 1 }}>
          {props => (
            <DashboardList {...props}>
              {({ key, ...itemProps }) => <DashboardItem key={key} {...itemProps}/>}
            </DashboardList>
          )}
        </ColumnsContainer>
      ) : emptyTpl }
    </section>
  );
}

Dashboard.defaultProps = {
  emptyTpl: <div className='state-empty'>Oups... Dashboard not found</div>
};

Dashboard.propTypes = {
  payload: PropTypes.shape(defaultInterface),
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
