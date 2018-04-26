import isFunction from 'lodash/isFunction';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { classNameShape, childrenShape } from 'shared/typings';
import './styles.scss';
import { configShape, getRowStyles } from '../DataList/row';
import Icon from '../Icon';
import Dropdown from '../Dropdown';
import Button from '../Button';

function Search({ onChange, ...props}) {
  return (
    <div className='search'>
      <input {...props} onChange={({target}) => onChange({search: target.value})} />
      <Icon g='search' />
    </div>
  );
}

Search.defaultProps = {
  type: 'text',
  placeholder: 'Type to search',
  value: ''
}

const SearchShape = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func
}

Search.propTypes = SearchShape;

export default function PageHeader({title, subtitle, className, search, children, sort, onCreate, config, rootClassName, ...props}) {
  return (
    <header {...props} className={classNames(rootClassName, className)}>
      <div className='container'>
        <h1>{title}</h1>
        {subtitle && <h2>{subtitle}</h2>}
        {onCreate && <Button className='create' theme='raised' onClick={onCreate} value='Add' />}
        <form>
          {(typeof search.value === 'string' && isFunction(search.onChange)) && <Search {...search} />}
          {children}
          {(sort.options && sort.options.length && isFunction(sort.onChange) && typeof sort.value === 'string') && <Dropdown clearable={false} className='sort' name='sort' placeholder='Sort/Group by' {...sort} />}
        </form>
        {config && (
          <ul className='list-header'>
            {config.map(({id, label, size}) => (<li key={id} style={getRowStyles(size)}>{label}</li>))}
          </ul>
        )}
      </div>
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
  onCreate: PropTypes.func,
  config: PropTypes.arrayOf(configShape),
  search: PropTypes.shape(SearchShape),
  sort: PropTypes.object // eslint-disable-line
}