// Import utility stuff
// ===========================================================================
import { bindAll, pick } from 'lodash';
import classNames from 'classnames';

// Import React related stuff
// ===========================================================================
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Import actions
// ===========================================================================
import { errorHandler, logout } from '../redux/app';

// Import Child components
// ===========================================================================
import MainNav from '../components/main-nav';
import UserBlock from '../components/briefInfo';
import Dashboard from './dashboard';

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
      sidebar: this.props.sidebar || true
    };

    // Bind handlers to our component
    // ===========================================================================
    bindAll(this, 'handlerSidebar', 'handlerLogout');
  }

  // Redirect to auth if user is unauthentificated
  // ===========================================================================
  componentWillMount() {
    !this.props.userAuthenticated && this.props.router.push('/auth');
  }

  // Redirect to auth if user is unauthentificated
  // ===========================================================================
  componentWillUpdate(newProps) {
    !newProps.userAuthenticated && this.props.router.push('/auth');
  }

  // Handler for toggling sidebar state
  // ===========================================================================
  handlerSidebar() {
    this.setState({ sidebar: !this.state.sidebar });
  }

  // Handler for logout operation
  // ===========================================================================
  handlerLogout() {
    this.props.logout().catch(this.props.errorHandler);
  }

  // Render our screen
  // ===========================================================================
  render() {
    if (!this.props.userAuthenticated) return null;

    let routes = this.props.route.childRoutes.map(({label, path, icon}) => ({label, path, icon}));

    // Return JSX layout of a component
    // ===========================================================================
    return (
      <section className='screen-main mod-screen-main'>
        <aside className={classNames({
          'sidebar': true,
          'is-expanded': this.state.sidebar
        })}>
          <UserBlock {...this.props.user} />
          <MainNav routes={routes} toggle={this.handlerSidebar} logout={this.handlerLogout} />
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
const mapStateToProps = ({app, user}) =>({
  ...app,
  sidebar: true,
  user: pick(user.payload, ['fullname', 'image', 'position'])
});

const mapDispatchToProps = (dispatch) => (bindActionCreators({
  logout,
  errorHandler
}, dispatch));

export default connect(mapStateToProps, mapDispatchToProps)(Workspace);