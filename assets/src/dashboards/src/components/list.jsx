// Import helper stuff
// ===========================================================================
import { bindAll } from 'lodash';
import scrollbarSize from 'dom-helpers/util/scrollbarSize';

// Import React related stuff
// ===========================================================================
import React from 'react';
import { AutoSizer, Grid, ArrowKeyStepper } from 'react-virtualized';
import DeleteConfirmation from 'common/components/delete-confirmation';

// Import selectors and typecheck
// ===========================================================================
import PropTypes from 'prop-types';

export default class DashboardList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      deleting: null
    };
    bindAll(this, 'cellRenderer');
  }

  deleteConfirm(deleting = null) {
    return () => this.setState({ deleting });
  }

  deleteColumn(id) {
    return () => this.props.deleteColumn({ id: this.state.deleting.id });
  }

  cellRenderer({ columnIndex, key, rowIndex, style }) {
    const { children, payload, refreshResults, editColumn } = this.props;
    const column = payload[columnIndex];
    return (
      <div key={key} style={style}>
        {children({
          payload: column,
          deleteColumn: this.deleteConfirm({ id: column.id, name: column.name }),
          refreshResults,
          editColumn
        })}
      </div>
    );
  }

  render() {
    const colCount = this.props.payload.length;
    return (colCount) ? (
      <div className='list-container'>
        <AutoSizer>
          {({ height, width }) => (
            <ArrowKeyStepper columnCount={colCount} rowCount={1}>
              {({ onSectionRendered, scrollToColumn }) => (<Grid
                cellRenderer={this.cellRenderer}
                onSectionRendered={onSectionRendered}
                scrollToColumn={scrollToColumn}
                columnCount={colCount}
                columnWidth={378}
                height={height}
                rowCount={1}
                rowHeight={height - scrollbarSize()}
                width={width}
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
  deleteColumn: PropTypes.func.isRequired,
  refreshResults: PropTypes.func,
  editColumn: PropTypes.func.isRequired,
  children: PropTypes.func.isRequired,
  emptyTpl: PropTypes.element.isRequired
};
