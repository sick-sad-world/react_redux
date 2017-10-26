// Import utility stuff
// ===========================================================================
import { bindAll, get } from 'lodash';

// Import React related stuff
// ===========================================================================
import React from 'react';
import PropTypes from 'prop-types';

export const injectedProps = {
  search: PropTypes.string,
  bindSearch: PropTypes.shape({
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
  }).isRequired
};

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
      const { treshold, ...props } = this.props;
      const { search } = this.state;

      return (
        <Component
          search={(search.length >= treshold) ? search : null}
          bindSearch={{
            value: this.state.search,
            onChange: this.updateSearch
          }}
          {...props}
        />
      );
    }
  }

  SearchForm.defaultProps = {
    treshold: 3
  };

  SearchForm.propTypes = {
    treshold: PropTypes.number.isRequired
  };

  return SearchForm;
}
