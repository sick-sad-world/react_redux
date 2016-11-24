import { bindAll } from 'lodash';
import classNames from 'classnames';
import React from 'React';
import { connect } from 'react-redux';
import { logout } from '../actions/util';
import MainNav from '../components/mainNav';
import UserBlock from '../components/userBlock';



class Workspace extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sidebar: this.props.sidebar || true
    };

    bindAll(this, ['toggleSidebar', 'logoutHandler']);
  }

  toggleSidebar(e) {
    e.preventDefault();
    this.setState({ sidebar: !this.state.sidebar });
    e.target.blur();
    e.target.parentNode.blur();
  }

  logoutHandler(e) {
    e.preventDefault();
    this.props.dispatch(logout());
  }

  checkAuthState(auth) {
    !auth && this.props.router.push('/auth')
  }

  componentWillMount() {
    this.checkAuthState(this.props.userState);
  }

  componentWillUpdate(newProps) {
    this.checkAuthState(newProps.userState);
  }

  render() {
    let { list, main, additional } = this.props;
    let sidebarClass = classNames({
      'sidebar': true,
      'is-expanded': this.state.sidebar
    });

    return (this.props.userState && this.props.appState >= 2) ? (
      <section className='screen-main mod-screen-main'>
        <aside className={sidebarClass}>
          <UserBlock />
          <MainNav toggle={this.toggleSidebar} logout={this.logoutHandler} />
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

function mapStateToProps({app}) {
  return {
    userState: app.userState,
    appState: app.appState,
    sidebar: true
  };
}

export default connect(mapStateToProps)(Workspace);