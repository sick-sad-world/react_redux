// Import utility stuff
// ===========================================================================
import { bindAll } from 'lodash';
import classNames from 'classnames';
import { stateNum, listShape } from 'common/typecheck';

// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';

// Import child components
// ===========================================================================
import { arrayMove } from 'react-sortable-hoc';
import ListItem from './item';
import PayloadList from './list';

// Abstract Page list component
// ===========================================================================
export class ListSection extends React.Component {
  // Set initial state
  // ===========================================================================
  constructor(props) {
    super(props);
    this.state = {
      payload: props.payload.map((item, i) => ({ ...item, order: i }))
    };
    bindAll(this, 'createHandler', 'updateSortState', 'renderChildren', 'runSortHandler');
  }

  componentWillReceiveProps(newProps) {
    if (newProps.state === 2) this.setState({ payload: newProps.payload.map((item, i) => ({ ...item, order: i })) });
  }

  createHandler(e) {
    e.preventDefault();
    this.props.createItem(e.target.elements.name.value);
    e.target.elements.name.value = '';
  }

  runSortHandler() {
    return this.props.sortItems({ list: this.state.payload.map(({ id }, i) => ({ id, order: i })) });
  }

  updateSortState({ oldIndex, newIndex }) {
    if (oldIndex !== newIndex) {
      this.setState({
        payload: arrayMove(this.state.payload, oldIndex, newIndex)
      }, this.runSortHandler);
    }
  }

  renderChildren() {
    const { children, deleteItem } = this.props;
    return (this.state.payload && children) ? (
      this.state.payload.map((item, i) => children({
        key: item.id,
        index: (typeof item.order === 'number') ? item.order : i,
        deleteAction: (deleteItem) ? deleteItem(item) : null,
        ...item
      }))
    ) : null;
  }

  render() {
    return (
      <section className='mod-subsection-list'>
        <header className='subsection-header'>
          <div className='text'>
            <h1>{this.props.texts.title}</h1>
            <p>{this.props.texts.description}</p>
            <form onSubmit={this.createHandler}>
              <input type='text' name='name' required placeholder={this.props.texts.placeholder} />
              <button className='button is-accent size-90' title={this.props.texts.btn}>Add</button>
            </form>
          </div>
        </header>
        <PayloadList
          lockAxis='y'
          helperClass='mod-entity sortable-ghost'
          useDragHandle
          onSortEnd={this.updateSortState}
          emptyText={this.props.texts.empty}
        >
          {this.renderChildren}
        </PayloadList>
      </section>
    );
  }
}

ListSection.defaultProps = {
  texts: {
    title: 'List title',
    description: 'List description.',
    placeholder: 'New item name',
    btn: 'Create new item',
    deleting: 'Are you sure want to delete this?',
    empty: 'List is empty.'
  },
  state: 1,
  payload: []
};

ListSection.propTypes = {
  children: PropTypes.func.isRequired,
  texts: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    btn: PropTypes.string.isRequired,
    deleting: PropTypes.string.isRequired,
    empty: PropTypes.string.isRequired
  }).isRequired,
  createItem: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired,
  sortItems: PropTypes.func.isRequired,
  state: stateNum.isRequired,
  payload: PropTypes.arrayOf(PropTypes.shape(listShape)).isRequired
};

export { ListItem };

