// Import helper stuff
// ===========================================================================
import { bindAll, findIndex } from 'lodash';
import scrollbarSize from 'dom-helpers/util/scrollbarSize';

// Import React related stuff
// ===========================================================================
import React from 'react';
import { AutoSizer, ArrowKeyStepper } from 'react-virtualized';
import { arrayMove } from 'react-sortable-hoc';

// Import selectors and typecheck
// ===========================================================================
import PropTypes from 'prop-types';

// Import Child components
// ===========================================================================
import DeleteConfirmation from 'common/components/delete-confirmation';
import DashboardGrid from './grid';
import DashboardItemContainer from './item';

export default class DashboardList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      deleting: null,
      payload: props.payload
    };
    bindAll(this, 'cellRenderer', 'runSortHandler', 'updateSortState');
  }

  deleteConfirm(deleting = null) {
    return () => this.setState({ deleting });
  }

  deleteColumn(id) {
    return () => this.props.deleteColumn({ id: this.state.deleting.id });
  }

  runSortHandler() {
    return this.props.sortColumns({ list: this.state.payload.map(({ id }, i) => ({ id, order: i })) });
  }

  updateSortState({ oldIndex, newIndex }) {
    if (oldIndex !== newIndex) {
      this.setState({
        payload: arrayMove(this.state.payload, oldIndex, newIndex)
      }, this.runSortHandler);

      const instance = this.SortableGrid.getWrappedInstance();
      instance.List.recomputeGridSize({ columnIndex: newIndex, rowIndex: 1 });
    }
  }

  cellRenderer({ columnIndex, key, rowIndex, style }) {
    const { children, refreshResults, editColumn } = this.props;
    const column = this.state.payload[columnIndex];
    return (
      <DashboardItemContainer key={columnIndex} style={style} index={(typeof column.order === 'number') ? column.order : columnIndex}>
        {children({
          payload: column,
          deleteColumn: this.deleteConfirm({ id: column.id, name: column.name }),
          refreshResults,
          editColumn
        })}
      </DashboardItemContainer>
    );
  }

  render() {
    const colCount = this.state.payload.length;
    return (colCount) ? (
      <div className='list-container'>
        <AutoSizer>
          {({ height, width }) => (
            <ArrowKeyStepper columnCount={colCount} rowCount={1} scrollToColumn={findIndex(this.state.payload, { id: this.props.column })}>
              {({ onSectionRendered, scrollToColumn }) => (<DashboardGrid
              ref={(instance) => { this.SortableGrid = instance; }}
                cellRenderer={this.cellRenderer}
                onSectionRendered={onSectionRendered}
                scrollToColumn={scrollToColumn}
                columnCount={colCount}
                columnWidth={378}
                height={height}
                rowCount={1}
                rowHeight={height - scrollbarSize()}
                width={width}
                onSortEnd={this.updateSortState}
                lockAxis='x'
                axis='x'
                helperClass='mod-column sortable-ghost'
                useDragHandle
              />)}
            </ArrowKeyStepper>
          )}
        </AutoSizer>
        {(this.state.deleting) ? (
          <DeleteConfirmation close={this.deleteConfirm()} accept={this.deleteColumn(this.state.deleting.id)}>
            <dl>
              <dt>Trendolizer Column</dt>
              <dd>{`ID: ${this.state.deleting.id} - ${this.state.deleting.name}.`}</dd>
            </dl>
          </DeleteConfirmation>
        ) : null}
      </div>
    ) : this.props.emptyTpl;
  }
}

DashboardList.defaultProps = {
  emptyTpl: <div className='state-empty'>No columns visible on a Dashboard</div>
};

DashboardList.propTypes = {
  payload: PropTypes.arrayOf(PropTypes.object).isRequired,
  column: PropTypes.number,
  sortColumns: PropTypes.func.isRequired,
  deleteColumn: PropTypes.func.isRequired,
  refreshResults: PropTypes.func,
  editColumn: PropTypes.func.isRequired,
  children: PropTypes.func.isRequired,
  emptyTpl: PropTypes.element.isRequired
};