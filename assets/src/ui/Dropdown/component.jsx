import bindAll from 'lodash/bindAll';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Select, { Creatable } from 'react-select';
import 'node_modules/react-select/dist/react-select.css';

import { classNameShape, errorShape, optionShape } from '../../shared/typings';

import './override.scss';
import './styles.scss';
import IconButton from '../IconButton';

export default class Dropdown extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      options: null
    }
    bindAll(this, 'toggleLoading');
  }


  componentWillMount() {
    if (this.props.loadOptions) {
      this.toggleLoading(this.runLoadOptions);
    }
  }

  runLoadOptions() {
    this.props.loadOptions()
      .then((options) => this.setState(() => ({options})))
      .then(this.toggleLoading)
  }
  
  toggleLoading(cb) {
    return this.setState(({isLoading}) => ({isLoading: !isLoading}), cb)
  }

  valueRenderer({label}) {
    return <span title={label}>{label}</span>
  }

  arrowRenderer({ onMouseDown, isOpen }) {
    return <IconButton onMouseDown={onMouseDown} g={(isOpen) ? 'chevron-up' : 'chevron-down'} />
  }

  render() {
    const {label, name, focus, error, className, descr, prefix, suffix, options, loadingPlaceholder, creatable, ...props} = this.props;
    const { isLoading } = this.state;

    const classes = {
      'state--error': !!error,
      'state--focus': !!focus
    };

    const controlProps = {
      placeholder: (isLoading) ? loadingPlaceholder : undefined,
      ...props,
      isLoading: this.state.isLoading,
      options: this.state.options || options,
      valueRenderer: this.valueRenderer,
      arrowRenderer: this.arrowRenderer,
      openOnFocus: true
    }
  
    return (
      <div className={classNames('Dropdown--root', classes, className)}>
        {prefix && <span className='prefix'>{prefix}</span>}
        <div className='control'>
          <label>
            {(creatable) ? (
              <Creatable {...controlProps} />
            ) : (
              <Select {...controlProps} />
            )}
            {label && <span className='label'>{label}</span>}
          </label>
          {(error || descr) ? (
            <span className='subtext'>{error || descr}</span>
          ) : null}
        </div>
        {suffix && <span className='suffix'>{suffix}</span>}
      </div>
    );
  }
}

Dropdown.defaultProps = {
};

Dropdown.propTypes = {
  /** Options for dropdown */
  options: optionShape('any'),
  /** Function used to get options from remote, [options] will be taken from internal state */
  loadOptions: PropTypes.func,
  /** HTML Class will be applied to container */
  className: classNameShape,
  /** Bool: Allow creation of new Options */
  creatable: PropTypes.bool,
  /** Customizable placeholder while [loadOptions] is in progress */
  loadingPlaceholder: PropTypes.string,
  /** Name property for input */
  name: PropTypes.string.isRequired,
  /** Label text for input */
  label: PropTypes.string,
  /** Small description text under the input */
  descr: PropTypes.string,
  /** Whatever field is focused or not */
  focus: PropTypes.bool.isRequired,
  /** Field validation state mark it as valid [true] or invalid [Array[String]] */
  error: errorShape.isRequired,
  /** Elements placed BEFORE dropdown (icons, buttons) */
  prefix: PropTypes.element,
  /** Elements placed AFTER dropdown (icons, buttons) */
  suffix: PropTypes.element
};