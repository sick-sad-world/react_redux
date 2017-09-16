// Import utility stuff
// ===========================================================================
import { includes, without, concat, bindAll, isEqual, forOwn, capitalize, omit } from 'lodash';
import classNames from 'classnames';

// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';
import { stateNum, textShape } from '../typecheck';

// Import Child components
// ===========================================================================
import DeleteConfirmation from 'common/components/delete-confirmation';
import { ListSection, ListItem } from 'common/list';

export default function ContainerAlt(opts, Component) {
  const o = { create: 'call', ...opts };

  class ContainerHOC extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
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
      this.props.actionCreate({ ...data, order: -1 }, ...args).then(({ payload }) => this.changeLocation(`/${payload.id}`));
    }

    createItem(value) {
      if (o.create === 'call') {
        this.runCreateAction({ name: value });
      } else {
        this.changeLocation('/new', { name: value });
      }
    }

    editItem(data, ...args) {
      if (o.create === 'edit' && !data.id) {
        return this.runCreateAction(omit(data, 'id'), ...args);
      }
      return this.props.actionEdit(data, ...args);
    }

    deleteConfirm(deleting = null) {
      return () => this.setState({ deleting });
    }

    deleteItem() {
      if (!this.state.deleting) return;
      this.props.actionDelete({ id: this.state.deleting.id }).then(this.deleteConfirm()).then(() => this.changeLocation());
    }

    render() {
      return (
        <Component
          {...this.props}
          deleting={this.state.deleting}
          createItem={this.createItem}
          editItem={this.editItem}
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
