// Import helper stuff
// ===========================================================================
import { bindAll } from 'lodash';
import { updateArrayWithValue } from 'functions';

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
import { variable, colours, movWindow, limit } from './defaults';

// Import child Components
// ===========================================================================
import GraphError from './components/error';
import GraphLoading from './components/loading';
import CustomToolTip from './components/tooltip';
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line } from 'recharts';


// description
// ===========================================================================
class GraphsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.chart = null;
    this.state = {
      dTypes: [],
      dVars: [],
      config: this.mapPropsToState(props)
    };
    bindAll(this, 'mapPropsToState', 'legendClickHandler');
  }

  mapPropsToState(props) {
    return props.config.reduce((acc, item, i) => {
      props.variable.forEach((v) => {
        if (v === 'found') return;
        acc.push({
          key: (v === 'value') ? item : `${item}_${v}`,
          enabled: (props.initial) ? (item.indexOf(props.initial) > -1) : true,
          val: props.colours[v][i]
        });
      });
      return acc;
    }, []);
  }


  componentWillMount() {
    this.props.getResultMeasurements({
      hash: this.props.hash,
      type: (window.google && this.props.initial) ? this.props.initial : this.props.config.join(',')
    }, {
      entity: {
        types: (window.google && this.props.initial) ? [this.props.initial] : this.props.config,
        opts: {
          limit,
          movWindow
        }
      },
      notification: false
    }).catch(this.props.graphError);
  }

  renderLines() {
    return this.state.config.filter(({ enabled }) => enabled).map(({ key, val }) => (
      <Line key={key} name={key} dataKey={key} stroke={val} {...this.props.lineProps} />
    ));
  }

  legendClickHandler({ dataKey }) {
    const dTypes = updateArrayWithValue(this.state.dTypes, dataKey);
    const dVars = updateArrayWithValue(this.state.dVars, dataKey);
    this.setState({
      dTypes,
      dVars,
      config: this.state.config.map(({ key, val }) => ({
        key,
        val,
        enabled: !dTypes.find(t => key.indexOf(t) > -1) && !dVars.find(t => key.indexOf(t) > -1)
      }))
    });
  }

  makeLegend(source, color) {
    return source.map((item, i) => ({
      id: i,
      dataKey: item,
      value: item,
      color: color || this.props.colours.value[i],
      type: 'line'
    }));
  }

  render() {
    if (this.props.error) {
      return <GraphError>{this.props.error}</GraphError>;
    } else if (this.props.state === 3) {
      return <GraphLoading>Graph data is being loaded</GraphLoading>;
    } else if (this.props.payload) {
      return (window.google && window.google.charts) ? (
        <div id='chartContainer' ref='chartContainer'/>
      ) : (
        <AutoSizer>
          {({ height, width }) => (
            <LineChart width={width - 8} height={height - 8} margin={{ top: 0, right: 0, left: 0, bottom: 0 }} data={this.props.payload}>
              <XAxis dataKey='date' />
              <YAxis type='number' domain={['auto', 'auto']} />
              <CartesianGrid strokeDasharray='3 3' />
              <Tooltip content={<CustomToolTip config={this.props.config} variable={this.props.variable} />} />
              <Legend
                verticalAlign='top'
                onClick={this.legendClickHandler}
                payload={
                  this.makeLegend(this.props.config).concat(
                    this.makeLegend([...this.props.variable].splice(1), this.props.colours.found[0])
                  )
                }
              />
              <Line key='found' name='found' dataKey='found' legendType='none' stroke={this.props.colours.found[0]} {...this.props.lineProps} />
              {(this.state.config.length) ? this.renderLines() : null}
            </LineChart>
          )}
        </AutoSizer>
      );
    }
    return <span>No graphs can be shown</span>;
  }

  componentDidUpdate() {
    if (!this.chart && this.refs.chartContainer) {
      this.chart = new window.google.visualization.LineChart(this.refs.chartContainer);
    }
    if (this.chart) {
      this.chart.draw(this.props.payload, {
        ...this.props.chartOptions,
        width: this.refs.chartContainer.parentElement.clientWidth,
        height: this.refs.chartContainer.parentElement.clientHeight
      });
    }
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
  },
  chartOptions: {
    interpolateNulls: true,
    backgroundColor: 'transparent',
    theme: 'material',
    explorer: {
      actions: ['dragToZoom', 'rightClickToReset'],
      maxZoomIn: 0.01
    },
    annotation: {
      style: 'line'
    },
    curveType: 'function',
    chartArea: {
      top: 'auto',
      left: 80,
      height: '90%',
      width: 'auto'
    },
    pointSize: 3,
    legend: {
      position: 'right'
    }
  }
};

GraphsContainer.propTypes = {
  state: stateNum.isRequired,
  initial: PropTypes.string,
  config: PropTypes.arrayOf(PropTypes.string),
  variable: PropTypes.arrayOf(PropTypes.string).isRequired,
  colours: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  payload: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
  lineProps: PropTypes.object.isRequired,
  hash: PropTypes.string.isRequired,
  error: PropTypes.string,
  graphError: PropTypes.func.isRequired,
  clearGraphData: PropTypes.func.isRequired,
  getResultMeasurements: PropTypes.func.isRequired,
  chartOptions: PropTypes.object.isRequired
};

export default connect(makeContainerSelector, { ...actions })(GraphsContainer);
