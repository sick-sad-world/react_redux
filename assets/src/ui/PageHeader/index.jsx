import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { classNameShape, childrenShape } from 'shared/typings';
import './styles.scss';
import Dropdown from '../Dropdown';

export default function PageHeader({title, subtitle, className, search, children, createItem, ...props}) {
  return (
    <header {...props} className={classNames('PageHeader--root', className)}>
      <h1>{title}</h1>
      {subtitle && <h2>{subtitle}</h2>}
      {createItem && <Button onClick={createItem}>Add</Button>}
      <form>
        <div className='search'>
          <input type='text' {...{...defaultSearch, ...search}} />
        </div>
        {children}
        <Dropdown name='sorting' /> 
      </form>
    </header>
  );
}

PageHeader.propTypes = {
  title: ,
  subtitle: ,
  classNmae: ,
  children: ,
  createItem: ,
  search: PropTypes.shape({
    placeholder: ,
    value: ,
    onChange:
  })
}