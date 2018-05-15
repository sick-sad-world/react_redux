// Import utility stuff
// ===========================================================================
import bindAll from 'lodash/bindAll';
import pick from 'lodash/pick';
import classNames from 'classnames';

// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { defaultInterface } from '../defaults';
import { makeWorkspaceSelector } from '../selectors';

// Import actions
// ===========================================================================
import { actions } from '../redux';

// Import Child components
// ===========================================================================
import MainNav from '../components/main-nav';
import UserBlock from '../components/info-block';
import { DashboardNav } from 'src/dashboards';

// Main app screen - where all fun is taking place
// ===========================================================================
class Workspace extends React.Component {
  // Constructor overriding
  // ===========================================================================
  constructor(props) {
    super(props);
    const sidebarState = window.localStorage.getItem('trzr-sidebar') === `${props.user.id}-true`;
    this.state = {
      sidebar: sidebarState
    };

    // Bind handlers to our component
    // ===========================================================================
    bindAll(this, 'sidebarHandler', 'logoutHandler');
  }

  redirectHandler(props) {
    if (!props.user.id) {
      this.props.router.replace(props.route.authPath);
    }
  }

  // // Redirect to auth if user is unauthentificated
  // // ===========================================================================
  componentWillMount() {
    this.redirectHandler(this.props);
  }

  // Redirect to auth if user is unauthentificated
  // ===========================================================================
  componentWillReceiveProps(newProps) {
    this.redirectHandler(newProps);
  }

  // Handler for toggling sidebar state
  // ===========================================================================
  sidebarHandler() {
    this.setState({ sidebar: !this.state.sidebar }, () => {
      window.localStorage.setItem('trzr-sidebar', `${this.props.user.id}-${this.state.sidebar}`);
    });
  }

  // Handler for logout operation
  // ===========================================================================
  logoutHandler() {
    this.props.logout().then(() => this.props.router.replace(this.props.route.authPath));
  }

  // Render our screen
  // ===========================================================================
  render() {
    const { user, children, route } = this.props;
    const routes = route.childRoutes.filter(({ omit }) => !omit).map(({ label, path, icon }) => ({ label, path, icon }));
    // Return JSX layout of a component
    // ===========================================================================
    return (this.props.user.id) ? (
      <section className='screen-main mod-screen-main'>
        <aside className={classNames({
          sidebar: true,
          'is-expanded': this.state.sidebar
        })}>
          <UserBlock fullname={user.fullname} position={user.position} image={user.image} />
          <MainNav routes={routes} toggle={this.sidebarHandler} logout={this.logoutHandler}>
            <DashboardNav base={this.props.route.dashboardPath} />
          </MainNav>
        </aside>
        <div className='screen-content'>
          {children}
        </div>
      </section>
    ) : null;
  }
}

// Proptypes validation
// ===========================================================================
Workspace.propTypes = {
  children: PropTypes.element,
  user: PropTypes.shape(pick(defaultInterface, 'id', 'image', 'fullname', 'position')),
  logout: PropTypes.func.isRequired,
  route: PropTypes.shape({
    childRoutes: PropTypes.array.isRequired,
    authPath: PropTypes.string.isRequired,
    dashboardPath: PropTypes.string.isRequired
  }).isRequired,
  router: PropTypes.shape({
    replace: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired
  }).isRequired
};

// Connect our Container to State
// @ deps -> App, (User in future)
// ===========================================================================
export default connect(makeWorkspaceSelector, { logout: actions.logout })(Workspace);
