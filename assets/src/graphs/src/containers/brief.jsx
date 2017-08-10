// Import utility stuff
// ===========================================================================
import { bindAll } from 'lodash';
import moment from 'moment';
import { variable, colours, movWindow, limit, cacheDur } from '../defaults';
import classNames from 'classnames';

// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';
import { stateNum } from 'common/typecheck';
import { connect } from 'react-redux';
import { makeBriefSelector } from '../selectors';
import { getBriefMeasurements } from '../actions';


// Brief graphs
// ===========================================================================
class BriefGraphs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    const { hash, type, id, payload, timestamp } = this.props;
    const now = moment().unix();
    if (!payload || now >= timestamp + this.props.cacheDur) {
      this.props.getBriefMeasurements({ hash, type }, {
        entity: {
          types: [type],
          id,
          timestamp: now,
          opts: {
            limit,
            movWindow
          }
        },
        notification: false
      });
    }
  }

  drawChart() {
    this.chart.draw(this.props.payload, {
      ...this.props.chartOptions,
      width: this.refs.chartContainer.parentElement.clientWidth,
      height: this.refs.chartContainer.parentElement.clientHeight
    });
  }

  render() {
    return (
      <div className='brief-graph' ref='chartContainer'></div>
    );
  }

  componentDidUpdate() {
    if (this.chart && this.props.payload) {
      this.drawChart();
    }
  }

  componentDidMount() {
    if (!this.chart && this.refs.chartContainer) {
      this.chart = new window.google.visualization.LineChart(this.refs.chartContainer);
    }
    if (this.chart && this.props.payload) {
      this.drawChart();
    }
  }
}

BriefGraphs.defaultProps = {
  cacheDur,
  chartOptions: {
    interpolateNulls: true,
    backgroundColor: 'transparent',
    theme: 'material',
    explorer: null,
    annotation: {
      style: 'line'
    },
    curveType: 'function',
    chartArea: {
      top: 10,
      left: '15%',
      height: '85%',
      width: '90%'
    },
    hAxis: { textPosition: 'none' },
    pointSize: 3,
    legend: { position: 'none' }
  }
};

BriefGraphs.propTypes = {
  id: PropTypes.number.isRequired,
  hash: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  timestamp: PropTypes.number,
  cacheDur: PropTypes.number.isRequired,
  state: stateNum.isRequired,
  chartOptions: PropTypes.object.isRequired,
  payload: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
  getBriefMeasurements: PropTypes.func.isRequired
};

export default connect(makeBriefSelector, { getBriefMeasurements })(BriefGraphs);
