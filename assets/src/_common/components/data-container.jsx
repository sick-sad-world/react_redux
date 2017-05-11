// Import React related stuff
// ===========================================================================
import React from 'react';

// Import selectors and typecheck
// ===========================================================================
import PropTypes from 'prop-types';
import { stateNum } from 'common/typecheck';

// Import child components
// ===========================================================================
import DeleteConfirmation from 'common/components/delete-confirmation';

class DataContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deleting: null
    };
  }

  setDeleting(item) {
    return () => this.setState({ deleting: item });
  }

  deletingReset() {
    this.setState({ deleting: null });
  }

  deleteItem(...args) {
    return () => this.props.deleteItem(...args).then(this.deletingReset);
  }

  render() {
    return React.cloneElement(this.props.children, {
      ...this.props,
      deleteItem: this.setDeleting,
      deletingPopup: (this.state.deleting) ? (
        <DeleteConfirmation close={this.deletingReset} accept={this.deleteItem(this.state.deleting.id)} >
          {this.props.renderConfirmation(this.state.deleting)}
        </DeleteConfirmation>
      ) : null
    });
  }
}

DataContainer.propTypes = {
  children: PropTypes.element,
  state: stateNum.isRequired,
  payload: PropTypes.arrayOf(PropTypes.object).isRequired,
  deleteItem: PropTypes.func.isRequired,
  renderConfirmation: PropTypes.func.isRequired
};
