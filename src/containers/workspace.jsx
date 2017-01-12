// Import utility stuff
// ===========================================================================
import { bindAll } from 'lodash';
import classNames from 'classnames';

// Import React related stuff
// ===========================================================================
import React from 'React';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Import actions
// ===========================================================================
import { createAction, throwError } from '../actions/actions';

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

    // Create bound actions for a container
    // ===========================================================================
    this.actions = bindActionCreators({
      logout: createAction('logout', 8),
      throwError: throwError
    }, this.props.dispatch);

    // Bind handlers to our component
    // ===========================================================================
    bindAll(this, ['handlerSidebar', 'handlerLogout']);
  }

  // Redirect to auth if user is unauthentificated
  // ===========================================================================
  componentWillMount() {
    !this.props.userState && this.props.router.push('/auth');
  }

  // Redirect to auth if user is unauthentificated
  // ===========================================================================
  componentWillUpdate() {
    !this.props.userState && this.props.router.push('/auth');
  }

  // Handler for toggling sidebar state
  // ===========================================================================
  handlerSidebar(e) {
    e.preventDefault();
    this.setState({ sidebar: !this.state.sidebar });
    e.target.blur();
  }

  // Handler for logout operation
  // ===========================================================================
  handlerLogout(e) {
    e.preventDefault();
    this.actions.logout().catch(this.actions.throwError);
  }

  // Render our screen
  // ===========================================================================
  render() {
    if (!this.props.userState) return null;
    
    // Get our display components
    // ===========================================================================
    let { list, main, additional } = this.props;

    // Create classList for sidebar
    // ===========================================================================
    let sidebarClass = classNames({
      'sidebar': true,
      'is-expanded': this.state.sidebar
    });

    let paceClass = classNames({
      'pace': true,
      'is-running': this.props.state !== 2
    })

    // Return JSX layout of a component
    // ===========================================================================
    return (
      <section className='screen-main mod-screen-main'>
        <aside className={sidebarClass}>
          <span className={paceClass}>{this.props.actionState}</span>
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
    );
  }
}

// Connect our Container to State
// @ deps -> App, (User in future)
// ===========================================================================
export default connect(({app}) =>({...app, sidebar: true}))(Workspace);