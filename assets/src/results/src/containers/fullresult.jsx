// Import helper stuff
// ===========================================================================
import { bindAll } from 'lodash';
import classNames from 'classnames';

// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';
import { defaultInterface } from '../defaults';

// Import Redux related stuff
// ===========================================================================
import { connect } from 'react-redux';
import { makeResultSelector } from '../selectors';
import { refreshResult, favoriteResult, ignoreResult, getGraphMeasurements } from '../actions';

// Import child Components
// ===========================================================================
import Modal from 'common/components/modal';
import ResultActions from '../components/result-actions';
import FullResultTable from '../components/full/table';

// description
// ===========================================================================
class FullResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: 1
    };
    bindAll(this, 'switchTab');
  }

  switchTab(tab) {
    return () => this.setState({ tab });
  }

  render() {
    const { close, title, payload, className } = this.props;
    return (
      <Modal title={title} className={className} close={close}>
        <main>
          <nav>
            <div className='tab-bar'>
              <a onClick={this.switchTab(1)} className={classNames({ active: this.state.tab === 1 })}>Result data</a>
              <a onClick={this.switchTab(2)} className={classNames({ active: this.state.tab === 2 })}>Popularity graphs</a>
            </div>
            <ResultActions
              className='actions'
              hash={payload.hash}
              favorite={payload.favorite}
              ignore={payload.ignore}
              favoriteResult={this.props.favoriteResult}
              ignoreResult={this.props.ignoreResult}
              refreshResult={this.props.refreshResult}
            />
          </nav>
          {(this.state.tab === 1) ? (
            <div className='tab-content tab'>
              <FullResultTable />
            </div>
          ) : null}
        </main>
      </Modal>
    );
  }
}

FullResult.defaultProps = {
  className: 'popup mod-full-result'
};

FullResult.propTypes = {
  close: PropTypes.func.isRequired,
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  payload: PropTypes.shape(defaultInterface),
  refreshResult: PropTypes.func,
  favoriteResult: PropTypes.func,
  ignoreResult: PropTypes.func
};

export default connect(makeResultSelector, { refreshResult, favoriteResult, ignoreResult, getGraphMeasurements })(FullResult);
