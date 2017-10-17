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
import DashboardGrid from './grid';
import ItemWrapper from './item';

export default class PayloadList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      payload: props.payload
    };
    bindAll(this, 'cellRenderer', 'updateSortState');
  }

  componentWillReceiveProps({ payload }) {
    this.setState({ payload });
  }

  updateSortState({ oldIndex, newIndex }) {
    if (oldIndex !== newIndex) {
      this.setState({
        payload: arrayMove(this.state.payload, oldIndex, newIndex)
      }, () => this.props.sortColumns({ list: this.state.payload.map((id, i) => ({ id, order: i })) }, { state: false }));
      const instance = this.SortableGrid.getWrappedInstance();
      instance.List.recomputeGridSize({ columnIndex: newIndex, rowIndex: 1 });
    }
  }

  cellRenderer({ columnIndex, style }) {
    return (
      <ItemWrapper key={columnIndex} style={style} index={columnIndex}>
        {this.props.children({ id: this.state.payload[columnIndex] })}
      </ItemWrapper>
    );
  }

  render() {
    const colCount = this.state.payload.length;
    return (colCount) ? (
      <div className='list-container'>
        <AutoSizer>
          {({ height, width }) => (
            <ArrowKeyStepper columnCount={colCount} rowCount={1} scrollToColumn={findIndex(this.state.payload, { id: this.props.col })}>
              {({ onSectionRendered, scrollToColumn }) => (
                <DashboardGrid
                  ref={(instance) => { this.SortableGrid = instance; }}
                  width={width}
                  height={height}
                  cellRenderer={this.cellRenderer}
                  onSectionRendered={onSectionRendered}
                  scrollToColumn={scrollToColumn}
                  columnCount={colCount}
                  columnWidth={this.props.width}
                  overscanColumnCount={Math.ceil(window.innerWidth / (this.props.width * 1.5))}
                  rowHeight={height - scrollbarSize()}
                  onSortEnd={this.updateSortState}
                  helperClass='mod-column sortable-ghost'
                  lockAxis='x'
                  axis='x'
                  useDragHandle
                  rowCount={1}
                  overscanRowCount={1}
                />
              )}
            </ArrowKeyStepper>
          )}
        </AutoSizer>

      </div>
    ) : this.props.emptyTpl;
  }
}

PayloadList.defaultProps = {
  width: 400,
  emptyTpl: <div className='state-empty'>No columns visible on a Dashboard</div>
};

PayloadList.propTypes = {
  width: PropTypes.number.isRequired,
  payload: PropTypes.arrayOf(PropTypes.number).isRequired,
  col: PropTypes.number,
  sortColumns: PropTypes.func.isRequired,
  children: PropTypes.func.isRequired,
  emptyTpl: PropTypes.element.isRequired
};
