import { bindAll } from 'lodash';

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
import { ColumnsContainer, DashboardItem } from 'src/columns';
import { ResultsContainer, FullResult, getResults, resultError } from 'src/results';
import PayloadList from '../components/list';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    bindAll(this, 'closeModal');
  }

  closeModal() {
    this.props.router.push(`/${this.props.params.name}`);
  }

  render() {
    const { payload, emptyTpl, scrollTo, location, fetchResults } = this.props;
    return (
      <section className='mod-dashboard'>
        {(payload) ? (
          <ColumnsContainer column_ids={payload.column_ids} actions={['editColumn', 'deleteColumn', 'sortColumns']}>
            {props => (
              <PayloadList width={width} scrollTo={scrollTo} {...props}>
                {({ payload, editColumn, deleteColumn }) => (
                  <DashboardItem payload={payload} editColumn={editColumn} deleteColumn={deleteColumn} getResults={fetchResults}>
                    <ResultsContainer
                      id={payload.id}
                      sort={payload.data.sort}
                      data={payload.data}
                      location={location.pathname}
                      displaySettings={payload.display_settings}
                    />
                  </DashboardItem>
                )}
              </PayloadList>
            )}
          </ColumnsContainer>
        ) : emptyTpl }
        {(this.props.location.query.hash) ? (
          <FullResult id={scrollTo} close={this.closeModal} initial={this.props.location.query.init} hash={this.props.location.query.hash} />
        ) : null}
      </section>
    );
  }
}

Dashboard.defaultProps = {
  emptyTpl: <div className='state-empty'>Oups... Dashboard not found</div>
};

Dashboard.propTypes = {
  payload: PropTypes.shape(defaultInterface),
  scrollTo: PropTypes.number,
  fetchResults: PropTypes.func.isRequired,
  params: PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired,
  router: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
    query: PropTypes.object.isRequired
  }).isRequired,
  emptyTpl: PropTypes.element.isRequired
};

// Connect our Container to State
// @ deps -> Dashboards
// ===========================================================================
export default connect(makeContainerSelector, dispatch => ({
  fetchResults(data, { entity }) {
    return dispatch(getResults(data, { entity })).catch(err => dispatch(resultError(`Results for column ${entity} ended with error`, entity)));
  }
}))(Dashboard);
