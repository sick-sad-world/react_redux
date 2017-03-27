// Import utility stuff
// ===========================================================================
import { bindAll } from 'lodash';
import classNames from 'classnames';

// Import React related stuff
// ===========================================================================
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { makeWorkspaceSelector } from '../selectors/user';

// Import actions
// ===========================================================================
import { logout } from '../redux/user';

// Import Child components
// ===========================================================================
import MainNav from '../components/main-nav';
import UserBlock from '../components/brief-info';
import Dashboard from '../containers/dashboard';

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
    !this.props.user.id && this.props.router.push('/auth');
  }

  // Redirect to auth if user is unauthentificated
  // ===========================================================================
  componentWillUpdate(newProps) {
    !newProps.user.id && this.props.router.push('/auth');
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
    let routes = this.props.route.childRoutes.map(({label, path, icon}) => ({label, path, icon}));
    // Return JSX layout of a component
    // ===========================================================================
    return (
      <section className='screen-main mod-screen-main'>
        <aside className={classNames({
          'sidebar': true,
          'is-expanded': this.state.sidebar
        })}>
          <UserBlock fullname={this.props.user.fullname} position={this.props.user.position} image={this.props.user.image} />
          <MainNav routes={routes} toggle={this.sidebarHandler} logout={this.logoutHandler} />
        </aside>
        <div className='screen-content'>
          <Dashboard location={this.props.location} />
          {this.props.children}
        </div>
      </section>
    );
  }
}

// Connect our Container to State
// @ deps -> App, (User in future)
// ===========================================================================
const mapStateToProps = () => {
  const selector = makeWorkspaceSelector();
  return (state, props) => selector(state, props);
};

const mapDispatchToProps = (dispatch) => (bindActionCreators({ logout }, dispatch));

export default connect(mapStateToProps(), mapDispatchToProps)(Workspace);