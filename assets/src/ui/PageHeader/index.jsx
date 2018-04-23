import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { classNameShape, childrenShape, valueShape, optionShape } from 'shared/typings';
import './styles.scss';
import Dropdown from '../Dropdown';
import Button from '../Button';

function Search({ options, value, onChange, ...props}) {
  return (options && options.length && onChange && value) ? (
    <div className='search'>
      <input {...props} onChange={({target}) => onChange({search: target.value})} />
    </div>
  ) : null;
}

Search.defaultProps = {
  type: 'text',
  placeholder: 'Type to search',
  value: ''
}

Search.propTypes = {
  options: optionShape,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: valueShape,
  onChange: PropTypes.func
}

export default function PageHeader({title, subtitle, className, search, children, sort, createItem,  rootClassName, ...props}) {
  return (
    <header {...props} className={classNames(rootClassName, className)}>
      <h1>{title}</h1>
      {subtitle && <h2>{subtitle}</h2>}
      {createItem && <Button onClick={createItem} value='Add' />}
      <form>
        {(typeof search.value === 'string' && !!search.onChange) && <Search {...search} />}
        {children}
        {<Dropdown name='sort' placeholder='Sort/Group by' {...sort} />}
      </form>
    </header>
  );
}

PageHeader.defaultProps = {
  rootClassName: 'PageHeader--root'
}

PageHeader.propTypes = {
  /** Classname all styles bound to */
  rootClassName: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  className: classNameShape,
  children: childrenShape,
  createItem: PropTypes.func,
  search: PropTypes.shape(Search.propTypes),
  sort: PropTypes.object // eslint-disable-line
}