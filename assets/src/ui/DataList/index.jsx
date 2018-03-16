import React from 'react';
import PropTypes from 'prop-types';
import DataListRow from './row';

export default class DataList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    }
  }

  componentWillReceiveProps({ data }) {
    this.setState(() => {data});
  }

  renderRowActions() {

  }

  render() {
    const { config, actions } = this.props;
    const { data } = this.props;
    return (
      <div>
        <ul>
          {data.map((item) => (
            <DataListRow key={item.id} data={item} config={config}>
              {actions && this.renderRowActions()}
            </DataListRow>
          ))}
        </ul>
      </div>
    );
  }
}

DataList.propTypes = {
  config: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string,
    size: PropTypes.string,
    render: PropTypes.func
  })).isRequired,
  actions: PropTypes.arrayOf(),
  data: PropTypes.arrayOf(PropTypes.object).isRequired
}