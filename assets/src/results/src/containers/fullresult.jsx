// Import helper stuff
// ===========================================================================
import { bindAll, pickBy } from 'lodash';
import classNames from 'classnames';

// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';
import { defaultInterface } from '../defaults';
import DisplaySettings from 'src/display-settings';

// Import Redux related stuff
// ===========================================================================
import { connect } from 'react-redux';
import { makeResultSelector } from '../selectors';
import { refreshResult, favoriteResult, ignoreResult } from '../actions';
import { GraphsContainer } from 'src/graphs';

// Import child Components
// ===========================================================================
import Modal from 'common/components/modal';
import ResultActions from '../components/actions';
import FullResultTable from '../components/full/table';
import ResultMedia from '../components/result/image';

// description
// ===========================================================================
class FullResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: (props.initial) ? 2 : 1,
      initial: props.initial
    };
    bindAll(this, 'switchTab', 'pickResultType', 'toGraphs');
  }

  switchTab(tab) {
    return () => this.setState({ tab });
  }

  pickTableData() {
    const payload = this.props.payload;
    return (this.props.tableStats.length) ? this.props.tableStats.reduce((acc, stat) => {
      acc.push({
        title: stat,
        normal: payload[stat] || 0,
        rate: payload[`rate_${stat}`] || 0,
        maxrate: payload[`maxrate_${stat}`] || 0,
        hotness: payload[`hotness_${stat}`] || 0,
        acc: payload[`acc_${stat}`] || 0,
        first: payload[`${stat}_first`] || 0
      });
      return acc;
    }, []) : null;
  }

  pickResultType() {
    return Object.keys(this.props.payload).reduce((acc, k) => {
      if (k.indexOf('is_') === 0 && this.props.payload[k] === 1) {
        acc = k.replace('is_', '');
      }
      return acc;
    }, 'undefined');
  }

  toGraphs(type) {
    return () => this.setState({
      tab: 2,
      initial: type.toLowerCase()
    });
  }

  render() {
    const { close, title, payload, className, id } = this.props;
    return (
      <Modal title={title} className={className} close={close}>
        <main>
          <nav>
            {(window.google && window.google.charts) ? (
              <div className='tab-bar'>
                <a onClick={this.switchTab(1)} className={classNames({ active: this.state.tab === 1 })}>Result data</a>
                <a onClick={this.switchTab(2)} className={classNames({ active: this.state.tab === 2 })}>Popularity graphs</a>
              </div>
            ) : null}
            <ResultActions
              className='actions'
              url={payload.url}
              hash={payload.hash}
              favorite={payload.favorite}
              ignore={payload.ignore}
              refreshResult={this.props.refreshResult({ entity: id, state: false })}
              favoriteResult={this.props.favoriteResult({ entity: id, state: false })}
              ignoreResult={this.props.ignoreResult({ entity: id, state: false })}
            />
          </nav>
          {(this.state.tab === 1) ? (
            <div className='tab-content tab'>
              <div className='alongside'>
                <div className='feature media'>
                  <h4>Media:</h4>
                  <figure>
                    <img src={payload.image} alt={payload.title} className='with-fallback' />
                  </figure>
                </div>
                <div className='feature data'>
                  <h4>General data:</h4>
                  <ul>
                    <li><b>Domain</b> <span>{payload.domain}</span></li>
                    <li><b>Found</b> <time dateTime={payload.found}>{payload.found}</time></li>
                    <li><b>Author</b> <span>{payload.author}</span></li>
                    <li><b>FirstMeasured</b> <time dateTime={payload.firstmeasured}>{payload.firstmeasured}</time></li>
                    <li><b>Language</b> <span>{payload.language}</span></li>
                    <li><b>Type</b> <span>{this.pickResultType()}</span></li>
                  </ul>
                </div>
              </div>
              {(payload.description.length) ? (
                <div className='feature description'>
                  <h4>Description:</h4>
                  {payload.description} {payload.additional}
                </div>
              ) : null}
              <div className='feature stats'>
                <h4>Stats:</h4>
                <FullResultTable onClick={this.toGraphs} graph={this.props.graphStats} data={this.pickTableData()} />
              </div>
            </div>
          ) : null}
          {(window.google && window.google.charts && this.state.tab === 2) ? (
            <div className='tab-graph tab'>
              <GraphsContainer config={this.props.graphStats} initial={this.state.initial} hash={this.props.payload.hash}/>
            </div>
          ) : null}
        </main>
      </Modal>
    );
  }
}

FullResult.defaultProps = {
  initial: null,
  className: 'popup mod-full-result',
  tableStats: DisplaySettings.getTable(),
  graphStats: DisplaySettings.getGraphs()
};

FullResult.propTypes = {
  id: PropTypes.number.isRequired,
  close: PropTypes.func.isRequired,
  initial: PropTypes.string,
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  payload: PropTypes.shape(defaultInterface),
  refreshResult: PropTypes.func,
  favoriteResult: PropTypes.func,
  ignoreResult: PropTypes.func,
  graphStats: PropTypes.arrayOf(PropTypes.string).isRequired,
  tableStats: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default connect(makeResultSelector, dispatch => ({
  favoriteResult(opts) {
    return params => dispatch(favoriteResult(params, opts));
  },
  ignoreResult(opts) {
    return params => dispatch(ignoreResult(params, opts));
  },
  refreshResult(opts) {
    return params => dispatch(refreshResult(params, opts));
  }
}))(FullResult);
