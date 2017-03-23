// Import utility stuff
// ===========================================================================
import { bindAll, find, includes } from 'lodash';

// Import React related stuff
// ===========================================================================
import React from 'react';

export default function containerUtility (Component) {
  return class Container extends React.Component {

    composeListProps(props) {
      return {
        payload: this.props.payload,
        state: this.props.state,
        createItem: this.createItem,
        deleteItem: this.deleteConfirm,
        ...this.props.listProps,
        ...props
      }
    }

    render () {
      return (
        <Component composeListProps={this.composeListProps}></Component>
      );
    }

  };
}