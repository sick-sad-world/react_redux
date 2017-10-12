// Import utility stuff
// ===========================================================================
import { bindAll, omit } from 'lodash';

// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';
import { listShape } from 'common/typecheck';

export default function makePageContainer(opts, Component) {
  const o = { create: 'call', ...opts };

  class ContainerHOC extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        creating: false,
        deleting: null
      };
      bindAll(this, 'changeLocation', 'createItem', 'editItem', 'deleteItem', 'deleteConfirm', 'deleteItem');
    }

    changeLocation(chunk = '', query = {}) {
      this.props.router.push({
        pathname: this.props.route.path + chunk,
        query
      });
    }

    runCreateAction(data, ...args) {
      this.setState({ creating: true });
      this.props.actionCreate({ ...data, order: -1 }, ...args)
        .then(({ payload }) => this.changeLocation(`/${payload.id}`))
        .then(() => this.setState({ creating: false }))
        .catch(() => this.setState({ creating: false }));
    }

    createItem(value) {
      if (o.create === 'call') {
        this.runCreateAction({ name: value });
      } else {
        this.changeLocation('/new', { name: value });
      }
    }

    editItem(data, options, changed) {
      if (o.create === 'edit' && !data.id) {
        return this.runCreateAction(omit(data, 'id'), options);
      }
      return this.props.actionEdit(data, options, changed);
    }

    deleteConfirm(deleting = null) {
      return () => this.setState({ deleting });
    }

    deleteItem() {
      if (!this.state.deleting) return;
      const closeModal = this.deleteConfirm();
      this.props.actionDelete({ id: this.state.deleting.id })
        .then(closeModal)
        .then(() => this.changeLocation())
        .catch(closeModal);
    }

    render() {
      return (
        <Component
          {...this.props}
          creating={this.state.creating}
          deleting={this.state.deleting}
          createItem={this.createItem}
          editItem={this.editItem}
          deleteItem={this.deleteItem}
          deleteConfirm={this.deleteConfirm}
          actionSort={this.props.actionSort}
          changeLocation={this.changeLocation}
        />
      );
    }
  }

  ContainerHOC.propTypes = {
    router: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired,
    actionEdit: PropTypes.func.isRequired,
    actionDelete: PropTypes.func.isRequired,
    actionCreate: PropTypes.func.isRequired,
    actionSort: PropTypes.func.isRequired
  };

  return ContainerHOC;
}

export const injectedProps = {
  curId: PropTypes.number.isRequired,
  creating: PropTypes.bool.isRequired,
  deleting: PropTypes.shape(listShape),
  editItem: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired,
  deleteConfirm: PropTypes.func.isRequired,
  createItem: PropTypes.func.isRequired,
  actionSort: PropTypes.func.isRequired,
  changeLocation: PropTypes.func.isRequired
};
