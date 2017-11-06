import { bindAll, get } from 'lodash';
import scrollbarSize from 'dom-helpers/util/scrollbarSize';

// Import React related stuff
// ===========================================================================
import React from 'react';
import { connect } from 'react-redux';

// Import selectors and typecheck
// ===========================================================================
import PropTypes from 'prop-types';
import { defaultInterface, width as colWidth } from '../defaults';
import { makeContainerSelector } from '../selectors';
import { arrayMove } from 'react-sortable-hoc';

// Import child Components
// ===========================================================================
import Icon from 'common/components/icon';
import DisplaySettings from 'src/display-settings';
import { SingleColumnContainer, DashboardItem, sortColumns } from 'src/columns';
import { ResultsContainer, FullResult, fetchResults, setResultState } from 'src/results';

import PayloadList from '../components/list';
import PayloadItem from '../components/item';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      payload: get(props, 'payload.column_ids', [])
    };
    bindAll(this, 'closeModal', 'updateSortState');
    DisplaySettings.setHeightTesterWidth(props.width);
  }

  componentWillReceiveProps({ payload }) {
    this.setState({ payload: payload.column_ids });
  }

  closeModal() {
    this.props.router.push(`/${this.props.params.name}`);
  }

  updateSortState({ oldIndex, newIndex }) {
    if (oldIndex !== newIndex) {
      this.setState({
        payload: arrayMove(this.state.payload, oldIndex, newIndex)
      }, () => this.props.sortColumns({ list: this.state.payload.map((id, i) => ({ id, order: i })) }, { state: false }));
    }
  }

  render() {
    const { emptyTpl, col, location, width, scrollBar } = this.props;
    const { payload } = this.state;
    return (
      <section className='mod-dashboard' ref='root'>
        {(this.props.payload) ? (
          <PayloadList axis='x' lockAxis='x' helperClass='mod-column sortable-ghost' useDragHandle onSortEnd={this.updateSortState}>
            {payload.map((id, i) => (
              <PayloadItem key={id} index={i} width={width}>
                <SingleColumnContainer col_id={id} output='column' actions={['deleteColumn', 'editColumn', 'updateVisibility']}>
                  {({ column, deleteColumn, editColumn, updateVisibility }) => (
                    <DashboardItem
                      payload={column}
                      deleteColumn={deleteColumn}
                      editColumn={editColumn}
                      updateVisibility={updateVisibility}
                      getResults={this.props.fetchResults}
                      setResultState={this.props.setResultState}
                    >
                      <ResultsContainer
                        id={column.id}
                        sort={column.data.sort}
                        data={column.data}
                        width={width - scrollBar}
                        location={location.pathname}
                        displaySettings={column.display_settings}
                      />
                    </DashboardItem>
                  )}
                </SingleColumnContainer>
              </PayloadItem>
            ))}
          </PayloadList>
        ) : emptyTpl}
        {(this.props.location.query.hash) ? (
          <FullResult id={col} close={this.closeModal} initial={this.props.location.query.init} hash={this.props.location.query.hash} />
        ) : null}
      </section>
    );
  }
}

Dashboard.defaultProps = {
  width: colWidth,
  scrollBar: scrollbarSize(),
  emptyTpl: (
    <div className='dashboard-empty state-empty'>
      <Icon icon='cone' />
      <span>Oups... Dashboard not found</span>
    </div>
  )
};

Dashboard.propTypes = {
  width: PropTypes.number.isRequired,
  scrollBar: PropTypes.number.isRequired,
  payload: PropTypes.shape(defaultInterface),
  col: PropTypes.number,
  fetchResults: PropTypes.func.isRequired,
  sortColumns: PropTypes.func.isRequired,
  setResultState: PropTypes.func.isRequired,
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
export default connect(makeContainerSelector, { sortColumns, fetchResults, setResultState })(Dashboard);
