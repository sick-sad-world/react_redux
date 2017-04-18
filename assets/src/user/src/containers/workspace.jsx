// Import utility stuff
// ===========================================================================
import { bindAll, pick } from 'lodash';
import classNames from 'classnames';

// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { defaultInterface } from '../defaults';
import { makeWorkspaceSelector } from '../selectors';

// Import actions
// ===========================================================================
import { logout } from '../actions';

// Import Child components
// ===========================================================================
import MainNav from '../components/main-nav';
import UserBlock from '../components/info-block';
// import Dashboard from '../containers/dashboard';

// Main app screen - where all fun is taking place
// ===========================================================================
class Workspace extends React.Component {
  // Constructor overriding
  // ===========================================================================
  constructor(props) {
    super(props);

    // Set initial state
    // ===========================================================================
    this.state = {
      sidebar: true
    };

    // Bind handlers to our component
    // ===========================================================================
    bindAll(this, 'sidebarHandler', 'logoutHandler');
  }

  // Redirect to auth if user is unauthentificated
  // ===========================================================================
  componentWillMount() {
    if (!this.props.user.id) {
      this.props.router.push('/auth');
    }
  }

  // Redirect to auth if user is unauthentificated
  // ===========================================================================
  componentWillUpdate(newProps) {
    if (!newProps.user.id) {
      this.props.router.push('/auth');
    }
  }

  // Handler for toggling sidebar state
  // ===========================================================================
  sidebarHandler() {
    this.setState({ sidebar: !this.state.sidebar });
  }

  // Handler for logout operation
  // ===========================================================================
  logoutHandler() {
    this.props.logout();
  }

  // Render our screen
  // ===========================================================================
  render() {
    const { user, children, route, location } = this.props;
    const routes = route.childRoutes.map(({ label, path, icon }) => ({ label, path, icon }));
    // Return JSX layout of a component
    // ===========================================================================
    return (
      <section className='screen-main mod-screen-main'>
        <aside className={classNames({
          sidebar: true,
          'is-expanded': this.state.sidebar
        })}>
          <UserBlock fullname={user.fullname} position={user.position} image={user.image} />
          <MainNav routes={routes} toggle={this.sidebarHandler} logout={this.logoutHandler} />
        </aside>
        <div className='screen-content'>
          {/* <Dashboard location={location} />*/}
          {children}
        </div>
      </section>
    );
  }
}

// Proptypes validation
// ===========================================================================
Workspace.propTypes = {
  children: PropTypes.element,
  user: PropTypes.shape(pick(defaultInterface, 'id', 'image', 'fullname', 'position')).isRequired,
  location: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
  route: PropTypes.shape({
    childRoutes: PropTypes.array.isRequired
  }).isRequired,
  router: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};

// Connect our Container to State
// @ deps -> App, (User in future)
// ===========================================================================
const mapStateToProps = () => {
  const selector = makeWorkspaceSelector();
  return (state, props) => selector(state, props);
};

const mapDispatchToProps = dispatch => (bindActionCreators({ logout }, dispatch));

export default connect(mapStateToProps(), mapDispatchToProps)(Workspace);
