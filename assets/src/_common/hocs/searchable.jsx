// Import utility stuff
// ===========================================================================
import { bindAll, get } from 'lodash';

// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';

export default function makeSearchable(Component) {
  class SearchForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        search: ''
      };
      bindAll(this, 'updateSearch');
    }

    updateSearch(e) {
      this.setState({ search: get(e, 'target.value', '') });
    }

    render() {
      const { className, placeholder, treshold, ...props } = this.props;
      const { search } = this.state;
      return (
        <div className={className}>
          <div className='header'>
            <input type='text' name='search' value={this.state.search} onChange={this.updateSearch} placeholder={placeholder} />
          </div>
          <Component
            search={(search.length >= treshold) ? search : null}
            {...props}
          />
        </div>
      );
    }
  }

  SearchForm.defaultProps = {
    placeholder: 'Search for...',
    treshold: 3
  };

  SearchForm.propTypes = {
    treshold: PropTypes.number.isRequired,
    className: PropTypes.string,
    placeholder: PropTypes.string.isRequired
  };
}
