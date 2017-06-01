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
import { variable, colours } from './defaults';

// Import child Components
// ===========================================================================
import GraphError from './components/error';
import GraphLoading from './components/loading';
import CustomToolTip from './components/tooltip';
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line } from 'recharts';


// description
// ===========================================================================
class GraphsContainer extends React.Component {

  componentWillMount() {
    this.props.getResultMeasurements({
      hash: this.props.hash,
      type: this.props.type.join(',')
    }, { entity: this.props.type, notification: false }).catch(this.props.graphError);
  }

  renderLines() {
    return this.props.config.reduce((acc, item, i) => {
      this.props.variable.forEach((v) => {
        const key = (v === 'value') ? item : `${item}_${v}`;
        acc.push(<Line key={key} name={key} dataKey={key} stroke={this.props.colours[v][i]} {...this.props.lineProps} />);
      });
      return acc;
    }, []);
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
              <YAxis type='number' domain={['auto', 'auto']} />
              <CartesianGrid strokeDasharray='3 3' />
              <Tooltip content={<CustomToolTip config={this.props.config} variable={this.props.variable}/>} />
              <Legend verticalAlign='top' />
              <Line key='found' name='found' dataKey='found' stroke={this.props.colours.found[0]} {...this.props.lineProps} />
              {this.renderLines()}
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
  error: null,
  colours,
  variable,
  lineProps: {
    connectNulls: true,
    type: 'monotone',
    'stroke-width': 4
  }
};

GraphsContainer.propTypes = {
  state: stateNum.isRequired,
  config: PropTypes.arrayOf(PropTypes.string),
  variable: PropTypes.arrayOf(PropTypes.string).isRequired,
  colours: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  payload: PropTypes.arrayOf(PropTypes.object).isRequired,
  lineProps: PropTypes.object.isRequired,
  hash: PropTypes.string.isRequired,
  type: PropTypes.arrayOf(PropTypes.string).isRequired,
  error: PropTypes.string,
  graphError: PropTypes.func.isRequired,
  clearGraphData: PropTypes.func.isRequired,
  getResultMeasurements: PropTypes.func.isRequired
};

export default connect(makeContainerSelector, { ...actions })(GraphsContainer);
