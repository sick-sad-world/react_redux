import { bindAll } from 'lodash';

// Import React related stuff
// ===========================================================================
import React from 'react';
import { connect } from 'react-redux';

// Import selectors and typecheck
// ===========================================================================
import PropTypes from 'prop-types';
import { defaultInterface, width as colWidth } from '../defaults';
import { makeContainerSelector } from '../selectors';

// Import child Components
// ===========================================================================
import DisplaySettings from 'src/display-settings';
import { SingleColumnContainer, DashboardItem, sortColumns } from 'src/columns';
import { ResultsContainer, FullResult, fetchResults } from 'src/results';
import PayloadList from '../components/list';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    bindAll(this, 'closeModal');
    DisplaySettings.setHeightTesterWidth(props.width);
  }

  closeModal() {
    this.props.router.push(`/${this.props.params.name}`);
  }

  render() {
    const { payload, sort, emptyTpl, scrollTo, location, width } = this.props;
    return (
      <section className='mod-dashboard'>
        {(payload) ? (
          <PayloadList width={width} payload={payload.column_ids} scrollTo={scrollTo} sortColumns={this.props.sortColumns}>
            {({ id }) => (
              <SingleColumnContainer col_id={id} actions={['deleteColumn', 'editColumn']}>
                {({ payload, state, deleteColumn, editColumn }) => (
                  <DashboardItem payload={payload} deleteColumn={deleteColumn} editColumn={editColumn} getResults={this.props.fetchResults}>
                    <ResultsContainer
                      id={payload.id}
                      sort={sort}
                      data={payload.data}
                      width={width - 10}
                      location={location.pathname}
                      displaySettings={payload.display_settings}
                    />
                  </DashboardItem>
                )}
              </SingleColumnContainer>
            )}
          </PayloadList>
        ) : emptyTpl }
        {(this.props.location.query.hash) ? (
          <FullResult id={scrollTo} close={this.closeModal} initial={this.props.location.query.init} hash={this.props.location.query.hash} />
        ) : null}
      </section>
    );
  }
}

Dashboard.defaultProps = {
  width: colWidth,
  emptyTpl: <div className='state-empty'>Oups... Dashboard not found</div>
};

Dashboard.propTypes = {
  payload: PropTypes.shape(defaultInterface),
  scrollTo: PropTypes.number,
  width: PropTypes.number.isRequired,
  fetchResults: PropTypes.func.isRequired,
  sortColumns: PropTypes.func.isRequired,
  sort: PropTypes.string.isRequired,
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
export default connect(makeContainerSelector, { sortColumns, fetchResults })(Dashboard);
