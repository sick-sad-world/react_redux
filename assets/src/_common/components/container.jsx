// Import utility stuff
// ===========================================================================
import { bindAll, omit } from 'lodash';

// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';
import { stateNum } from 'common/typecheck';

// Import Child components
// ===========================================================================
import DeleteConfirmation from 'common/components/delete-confirmation';
import { ListSection, ListItem } from 'common/components/list';

// Default
// ===========================================================================
export default class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deleting: null
    };
    bindAll(this, 'createItem', 'deleteItem', 'editItem', 'deleteConfirm', 'deleteReset');
  }

  createWrapper(data, ...rest) {
    this.props.actionCreate(data, ...rest).then(({ payload }) => {
      this.props.router.push(`${this.props.route.path}/${payload.id}`);
    });
  }

  createItem(value) {
    if (this.props.callOnCreate) {
      this.createWrapper({ name: value });
    } else {
      this.props.router.push({
        pathname: `${this.props.route.path}/new`,
        query: { name: value }
      });
    }
  }

  editItem(data) {
    if (!this.props.callOnCreate && !data.id) {
      return this.createWrapper(omit(data, 'id'));
    }
    return this.props.actionEdit(data);
  }

  deleteConfirm(deleting = null) {
    return () => this.setState({ deleting });
  }

  deleteReset() {
    this.setState({ deleting: null });
  }

  deleteItem(id) {
    return () => this.props.actionDelete({ id }).then(this.deleteReset).then(() => this.props.router.push(this.props.route.path));
  }

  render() {
    return (
      <div className='mod-page'>
        <ListSection
          payload={this.props.payload}
          state={this.props.state}
          createItem={this.createItem}
          deleteItem={this.deleteConfirm}
          {...this.props.listSectionOpts}
        >
          {props => <ListItem {...props} url={this.props.route.path} current={this.props.curId} {...this.props.listItemOpts} />}
        </ListSection>
        { (this.props.children) ? this.props.children({
          data: this.props.chosen,
          state: this.props.state,
          current: this.props.curId,
          update: this.editItem,
          backPath: this.props.route.path,
          ...this.props.editOpts
        }) : null }
        {(this.state.deleting) ? (
          <DeleteConfirmation close={this.deleteReset} accept={this.deleteItem(this.state.deleting.id)}>
            {this.props.confText(this.state.deleting)}
          </DeleteConfirmation>
        ) : null}
      </div>
    );
  }
}

Container.defaultProps = {
  callOnCreate: true,
  state: 1,
  payload: [],
  listSectionOpts: {},
  listItemOpts: {},
  editOpts: {}
};

Container.propTypes = {
  callOnCreate: PropTypes.bool.isRequired,
  curId: PropTypes.number,
  state: stateNum.isRequired,
  payload: PropTypes.arrayOf(PropTypes.object).isRequired,
  children: PropTypes.func,
  router: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  route: PropTypes.shape({
    path: PropTypes.string.isRequired
  }).isRequired,
  chosen: PropTypes.object,
  listSectionOpts: PropTypes.object.isRequired,
  listItemOpts: PropTypes.object.isRequired,
  editOpts: PropTypes.object.isRequired,
  confText: PropTypes.func.isRequired,
  actionCreate: PropTypes.func.isRequired,
  actionEdit: PropTypes.func.isRequired,
  actionDelete: PropTypes.func.isRequired
};
