// Import helper stuff
// ===========================================================================
import { } from 'lodash';

// Import React related stuff
// ===========================================================================
import React from 'react';
import { AutoSizer } from 'react-virtualized';

// Import selectors and typecheck
// ===========================================================================
import PropTypes from 'prop-types';
import { stateNum } from 'common/typecheck';

// Import connection
// ===========================================================================
import { connect } from 'react-redux';
import { makeContainerSelector } from './selectors';
import * as actions from './actions';

// Import child Components
// ===========================================================================
import GraphError from './components/error';
import GraphLoading from './components/loading';
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line } from 'recharts';

// description
// ===========================================================================
class GraphsContainer extends React.Component {

  componentWillMount() {
    this.props.getResultMeasurements({
      hash: this.props.hash, type: this.props.type.join(',')
    }, { notification: false }).catch(this.props.graphError);
  }

  componentWillReceiveProps(newProps) {

  }

  render() {
    if (this.props.error) {
      return <GraphError>{this.props.error}</GraphError>;
    } else if (this.props.state === 3) {
      return <GraphLoading>Graph data is being loaded</GraphLoading>;
    } else if (this.props.payload.length) {
      return (
        <AutoSizer>
          {({ height, width }) => (
            <LineChart width={width - 8} height={height - 8} margin={{ top: 0, right: 0, left: 0, bottom: 0 }} data={this.props.payload}>
              <XAxis dataKey='date' />
              <YAxis />
              <CartesianGrid strokeDasharray='3 3' />
              <Tooltip />
              <Legend verticalAlign='top' />
              {Object.keys(this.props.payload[0])
                .filter(key => key !== 'date' && key !== 'last')
                .map(key => <Line key={key} connectNulls={true} name={key} type='monotone' dataKey={key} stroke='#82ca9d' />)
              }
            </LineChart>
          )}
        </AutoSizer>
      );
    }
    return <span>No graphs can be shown</span>;
  }

  componentWillUnmount() {
    if (this.props.clearGraphData) {
      this.props.clearGraphData();
    }
  }
}

GraphsContainer.defaultProps = {
  state: 1,
  error: null
};

GraphsContainer.propTypes = {
  state: stateNum.isRequired,
  payload: PropTypes.arrayOf(PropTypes.object).isRequired,
  hash: PropTypes.string.isRequired,
  type: PropTypes.arrayOf(PropTypes.string).isRequired,
  error: PropTypes.string,
  graphError: PropTypes.func.isRequired,
  clearGraphData: PropTypes.func.isRequired,
  getResultMeasurements: PropTypes.func.isRequired
};

export default connect(makeContainerSelector, { ...actions })(GraphsContainer);
