import isFunction from 'lodash/isFunction';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { classNameShape, childrenShape } from 'shared/typings';
import './styles.scss';
import Icon from '../Icon';
import Dropdown from '../Dropdown';
import Button from '../Button';

/** Search field simple component */
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
  /** Type of text field */
  type: PropTypes.string,
  /** Placeholder that will be displayed */
  placeholder: PropTypes.string,
  /** Current value of a field */
  value: PropTypes.string.isRequired,
  /** Change handler to notify parent component of Updates */
  onChange: PropTypes.func
}

Search.propTypes = SearchShape;

/** Page header component, Holds Title, Descroption, and Controls for page */
export default function PageHeader({title, subtitle, className, search, children, sort, onCreate, rootClassName, ...props}) {
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
  /** Main title of a Page */
  title: PropTypes.string.isRequired,
  /** Subtitle/brief description of page */
  subtitle: PropTypes.string,
  /** Classnames applied to root component */
  className: classNameShape,
  /** Additional filters/control elements for related DataList */
  children: childrenShape,
  /** Function  */
  onCreate: PropTypes.func,
  /** Props for search component */
  search: PropTypes.shape(SearchShape),
  /** Props passed to Sort component which is [Dropdown], See docs for [Dropdown] */
  sort: PropTypes.object // eslint-disable-line
}