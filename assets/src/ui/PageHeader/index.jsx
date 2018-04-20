import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { classNameShape, childrenShape, valueShape } from 'shared/typings';
import './styles.scss';
import Dropdown from '../Dropdown';
import Button from '../Button';

function Search({ onChange, ...props}) {
  return (
    <div className='search'>
      <input {...props} onChange={({target}) => onChange({search: target.value})} />
    </div>
  );
}

Search.defaultProps = {
  type: 'text',
  placeholder: 'Type to search',
  value: ''
}

Search.propTypes = {
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: valueShape,
  onChange: PropTypes.func
}

export default function PageHeader({title, subtitle, className, search, children, sort, createItem, ...props}) {
  console.log(search.value, search.onChange);
  return (
    <header {...props} className={classNames('PageHeader--root', className)}>
      <h1>{title}</h1>
      {subtitle && <h2>{subtitle}</h2>}
      {createItem && <Button onClick={createItem}>Add</Button>}
      <form>
        {(typeof search.value === 'string' && !!search.onChange) && <Search {...search} />}
        {children}
        {(sort.options && sort.options.length && sort.onChange && sort.value) && <Dropdown name='sort' placeholder='Sort/Group by' {...sort} />}
      </form>
    </header>
  );
}

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  className: classNameShape,
  children: childrenShape,
  createItem: PropTypes.func,
  search: PropTypes.shape(Search.propTypes),
  sort: PropTypes.object
}