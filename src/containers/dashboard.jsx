// Import utility stuff
// ===========================================================================
import { bindAll } from 'lodash';

// Import React related stuff
// ===========================================================================
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Import actions
// ===========================================================================
import { errorHandler } from '../redux/app';
import { editColumn, deleteColumn } from '../redux/columns';

// Import Child components
// ===========================================================================
import Column from '../components/column';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
  }

  createList (func) {
    if (this.props.state === 1) {
      return this.props.loadingTpl;
    } else {
      return (this.props.payload.length) ? this.props.payload.reduce(func, []) : this.props.emptyTpl;
    }
  }

  updateItem (data) {
    this.props.updateUser(data).catch(this.props.errorHandler);
  }

  render () {
    return (
      <div className='mod-dashboard'>
        {this.createList((acc, column) => {
          let item = null;
          if (column.open) {
            item = (
              <Column
                key={column.id}
                id={column.id}
                name={column.name}
                open={column.open}
                infinite={column.data.infinite}
                autoreload={column.data.autoreload}
                direction={column.data.direction}
                sort={column.data.sort}
              >
              </Column>
            )
          }
          if (item) acc.push(item);
          return acc;
        })}
      </div>
    )
  }
}

Dashboard.defaultProps = {
  emptyTpl: <section className='state-empty'>No columns created</section>,
  loadingTpl: <section className='state-loading'>Loading...</section>
}

// Connect our Container to State
// @ deps -> Columns
// ===========================================================================
const mapStateToProps = ({columns}) => ({...columns});

const mapDispatchToProps = (dispatch) => (bindActionCreators({
  editColumn,
  deleteColumn,
  errorHandler
}, dispatch))

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);