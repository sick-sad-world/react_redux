// Import utility stuff
// ===========================================================================
import { bindAll } from 'lodash';
import classNames from 'classnames';

// Import React related stuff
// ===========================================================================
import React from 'React';
import { connect } from 'react-redux';

// Import actions
// ===========================================================================
import { logout, throwError } from '../actions/actions';

// Import Child components
// ===========================================================================
import MainNav from '../components/mainNav';
import UserBlock from '../components/userBlock';


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
    bindAll(this, ['handlerSidebar', 'handlerLogout']);
  }

  // Handler for toggling sidebar state
  // ===========================================================================
  handlerSidebar(e) {
    e.preventDefault();
    this.setState({ sidebar: !this.state.sidebar });
    e.target.blur();
    e.target.parentNode.blur();
  }

  // Handler for logout operation
  // ===========================================================================
  handlerLogout(e) {
    e.preventDefault();
    this.props.dispatch(logout()).catch((error) => this.props.dispatch(throwError(error)));
  }

  // Redirect us to [Auth] if user is unauthentificated
  // ===========================================================================
  checkAuthState(auth) {
    !auth && this.props.router.push('/auth')
  }

  // Check authentification on component mount
  // ===========================================================================
  componentWillMount() {
    this.checkAuthState(this.props.userState);
  }

  // Check it also on component update
  // ===========================================================================
  componentWillUpdate(newProps) {
    this.checkAuthState(newProps.userState);
  }

  // Render our screen
  // ===========================================================================
  render() {
    // Get our display components
    // ===========================================================================
    let { list, main, additional } = this.props;

    // Create classList for sidebar
    // ===========================================================================
    let sidebarClass = classNames({
      'sidebar': true,
      'is-expanded': this.state.sidebar
    });

    // Return JSX layout of a component
    // ===========================================================================
    return (this.props.userState) ? (
      <section className='screen-main mod-screen-main'>
        <aside className={sidebarClass}>
          <UserBlock />
          <MainNav toggle={this.handlerSidebar} logout={this.handlerLogout} />
        </aside>
        <div className='screen-content'>
          <div className='mod-page'>
            {list}
            {main}
            {additional}
          </div>
        </div>
      </section>
    ) : null;
  }
}

// Transform app state to component props
// @ deps -> App, (User in future)
// ===========================================================================
function mapStateToProps({app}) {
  return {
    userState: app.userState,
    appState: app.appState,
    sidebar: true
  };
}

// Connect our Container to State
// ===========================================================================
export default connect(mapStateToProps)(Workspace);