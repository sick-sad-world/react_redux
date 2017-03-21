import React from 'react';
import { numOrString } from '../helpers/functions';
import { Link } from 'react-router';
import Icon from '../icon';
import Sorting from '../forms/sorting';
import Toggler from '../forms/toggler';

// Column quick settings on Dashboard
// ===========================================================================
export default class QuickSettings extends React.Component {
  constructor(props) {
    super(props)
    this.state = this.mapDataToState(this.props.data);
  }

  componentWillRecieveProps (newProps) {
    this.setState(this.mapDataToState(newProps.data))
  }

  mapDataToState(data) {

  }

  updateValue(name) {
    return (e) => {
      let newState = undefined;
      if (name === 'sorting' && e.sort) {
        newState = e;
      } else if (e.target) {
        newState = {[name]: numOrString(e.target.value)};
      }
      if (newState === undefined) return;
      return this.setState(newState, () => {
        return this.props.onChange({
          id: this.props.id,
          data: { ...this.props.data, ...newState }
        });
      })
    }
  }

  render () {
    return (
      <form className='column-settings'>
        <Sorting
          className='row-flex'
          value={this.state.sort}
          direction={this.state.direction}
          disabled={this.props.running}
          onChange={this.updateValue('sorting')}
        />
        <Toggler
          disabled={this.props.running}
          label='Infinite scroll'
          className='row-flex'
          name='infinite'
          options={{
            'Yes': 1,
            'No': 0
          }}
          onChange={this.updateValue('infinite')}
          value={this.state.infinite}
        />
        <Toggler
          disabled={this.props.running}
          label='Autoreloading'
          className='row-flex'
          name='autoreload'
          options={{
            'On': this.state.autoreload || 30,
            'Off': 0
          }}
          onChange={this.updateValue('autoreload')}
          value={this.state.autoreload}
        />
        <div className='column-subnav'>
          <a onClick={this.hideColumn} title='Hide this column'><Icon icon='eye-with-line'/>Hide</a>
          <Link to={`/columns/${this.props.id}`} title='Column setting screen'><Icon icon='cog'/>Settings</Link>
          <a onClick={this.makeDeleteToggler(this.props.id)} title='Delete this column'><Icon icon='trash'/>Delete</a>
        </div>
      </form>
    );
  }
}