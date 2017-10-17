// Import utility stuff
// ===========================================================================
import { bindAll } from 'lodash';

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
        loading: false,
        deleting: null
      };
      bindAll(this, 'changeLocation', 'createItem', 'editItem', 'deleteItem', 'deleteConfirm', 'updateLoading');
    }

    changeLocation(chunk = '', query = {}) {
      this.props.router.push({
        pathname: this.props.route.path + chunk,
        query
      });
    }

    updateLoading(type) {
      this.setState({
        loading: (typeof type === 'string') ? type : false
      });
    }

    createItem(value) {
      if (o.create === 'call') {
        this.updateLoading('creating');
        this.props.actionCreate({ name: value, order: -1 })
          .then(({ payload }) => this.changeLocation(`/${payload.id}`))
          .catch(console.error)
          .then(this.updateLoading);
      } else {
        this.changeLocation('/new', { name: value });
      }
    }

    editItem(data, options, changed) {
      this.updateLoading('editing');
      if (o.create === 'edit' && !data.id) {
        this.props.actionCreate({ ...data, order: -1, id: undefined }, options)
          .then(({ payload }) => this.changeLocation(`/${payload.id}`))
          .catch(console.error)
          .then(this.updateLoading);
      } else {
        this.props.actionEdit(data, options, changed)
          .catch(console.error)
          .then(this.updateLoading);
      }
    }

    deleteConfirm(deleting = null) {
      return () => this.setState({ deleting, loading: false });
    }

    deleteItem() {
      if (!this.state.deleting) return;
      this.updateLoading('deleting');
      this.props.actionDelete({ id: this.state.deleting.id })
        .catch(console.error)
        .then(() => this.changeLocation())
        .then(this.deleteConfirm());
    }

    render() {
      return (
        <Component
          {...this.props}
          loading={this.state.loading}
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
  loading: PropTypes.oneOf([false, 'creating', 'editing', 'deleting']).isRequired,
  deleting: PropTypes.shape(listShape),
  editItem: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired,
  deleteConfirm: PropTypes.func.isRequired,
  createItem: PropTypes.func.isRequired,
  actionSort: PropTypes.func.isRequired,
  changeLocation: PropTypes.func.isRequired
};
