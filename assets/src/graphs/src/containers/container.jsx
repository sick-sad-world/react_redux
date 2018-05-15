// Import helper stuff
// ===========================================================================
import bindAll from 'lodash/bindAll';
import { updateArrayWithValue } from 'functions';

// Import React related stuff
// ===========================================================================
import React from 'react';
import { AutoSizer } from 'react-virtualized';

// Import selectors and typecheck
// ===========================================================================
import PropTypes from 'prop-types';

// Import connection
// ===========================================================================
import { connect } from 'react-redux';
import { makeContainerSelector } from '../selectors';
import * as actions from '../actions';
import { variable, colours, movWindow, limit } from '../defaults';

// Import child Components
// ===========================================================================
import GraphError from '../components/error';
import GraphLoading from '../components/loading';

// description
// ===========================================================================
class GraphsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.chart = null;
    this.state = {
      loading: false,
      error: null,
      config: this.mapPropsToState(props)
    };
    bindAll(this, 'mapPropsToState');
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
    this.setState({ loading: true });
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
      }
    }).catch(error => this.setState({ error })).then(() => this.setState({ loading: false }));
  }

  render() {
    if (this.state.error) {
      return <GraphError>{this.state.error}</GraphError>;
    } else if (this.state.loading) {
      return <GraphLoading>Graph data is being loaded</GraphLoading>;
    } else if (this.props.payload) {
      return <div id='chartContainer' ref='chartContainer'/>;
    }
  }

  componentDidUpdate() {
    if (!this.chart && this.refs.chartContainer) {
      this.chart = new window.google.visualization.LineChart(this.refs.chartContainer);
    }
    if (this.chart && this.props.payload) {
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
  colours,
  variable,
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
  initial: PropTypes.string,
  config: PropTypes.arrayOf(PropTypes.string),
  variable: PropTypes.arrayOf(PropTypes.string).isRequired,
  colours: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  payload: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
  hash: PropTypes.string.isRequired,
  clearGraphData: PropTypes.func.isRequired,
  getResultMeasurements: PropTypes.func.isRequired,
  chartOptions: PropTypes.object.isRequired
};

export default connect(makeContainerSelector, { ...actions })(GraphsContainer);
