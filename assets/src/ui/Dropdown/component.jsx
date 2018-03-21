import bindAll from 'lodash/bindAll';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Select, { Creatable } from 'react-select';
import 'node_modules/react-select/dist/react-select.css';

import { classNameShape, validationMessageShape, optionShape, valueShape } from 'shared/typings';

import './override.scss';
import './styles.scss';
import Icon from '../Icon';
import { ProgressRadial } from '../Progress';

export default class Dropdown extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      options: null
    }
    bindAll(this, 'toggleLoading', 'arrowRenderer');
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
    return (!this.state.isLoading) ? (
      <Icon onMouseDown={onMouseDown} g={(isOpen) ? 'chevron-up' : 'chevron-down'} />
    ) : (
      <ProgressRadial />
    );
  }

  clearRenderer() {
    return <Icon g='cross' />;
  }

  render() {
    const {label, name, focus, error, className, descr, prefix, suffix, options, loadingPlaceholder, creatable, rootClassName, ...props} = this.props;
    const { isLoading } = this.state;

    const controlProps = {
      noResultsText: (isLoading) ? this.props.loadingPlaceholder : undefined,
      openOnFocus: true,
      ...props,
      isLoading: this.state.isLoading,
      options: this.state.options || options,
      clearRenderer: this.clearRenderer,
      valueRenderer: this.valueRenderer,
      arrowRenderer: this.arrowRenderer
    }
  
    return (
      <div className={classNames(rootClassName, className)}>
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
  rootClassName: 'Dropdown--root',
  loadingPlaceholder: 'Data is being loaded'
};

Dropdown.propTypes = {
  rootClassName: PropTypes.string.isRequired,
  /** Change handler as all Form components interface require */
  onChange: PropTypes.func.isRequired,
  /** Options for dropdown */
  options: optionShape,
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
  /** Dropdown value */
  value: valueShape,
  /** Label text for input */
  label: PropTypes.string,
  /** Small description text under the input */
  descr: PropTypes.string,
  /** Whatever field is focused or not */
  focus: PropTypes.bool.isRequired,
  /** Field validation state mark it as valid [true] or invalid [Array[String]] */
  error: validationMessageShape.isRequired,
  /** Elements placed BEFORE dropdown (icons, buttons) */
  prefix: PropTypes.element,
  /** Elements placed AFTER dropdown (icons, buttons) */
  suffix: PropTypes.element
};