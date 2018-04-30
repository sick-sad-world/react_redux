import bindAll from 'lodash/bindAll';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { classNameShape, optionShape } from 'shared/typings';
import './styles.scss';
import Icon from '../Icon';
import Dropdown from '../Dropdown';
import Button from '../Button';

/** Page header component, Holds Title, Descroption, and Controls for page */
export default class PageHeader extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      search: '',
      sort: null,
      group: null
    }
    bindAll(this, 'onSearch', 'onSort', 'sendUpdates')
  }

  onSearch({target}) {
    this.setState(() => ({search: target.value}), this.sendUpdates);
  }

  onSort(data) {
    this.setState(() => data, this.sendUpdates);
  }

  sendUpdates() {
    const isGroup = this.state.sort.indexOf('group') > -1;
    const data = {
      search: this.state.search.split(' ').map((substr) => substr.split(':')).reduce((acc, [prop, val]) => {
        acc[(val) ? prop : 'name'] = (val) ? val : prop;
        return acc;
      }, {})
    }

    if (isGroup) {
      data.group = this.state.sort.replace('group:', '')
    } else {
      data.sort = this.state.sort
    }
    
    this.props.onChange(data);
  }

  render() {
    const {title, subtitle, className, sort, placeholder, onCreate, rootClassName, ...props} = this.props;
    return (
      <header {...props} className={classNames(rootClassName, className)}>
        <div className='container'>
          <h1>{title}</h1>
          {subtitle && <h2>{subtitle}</h2>}
          {onCreate && <Button className='create' theme='raised' onClick={onCreate} value='Add' />}
          <form>
            <div className='search'>
              <input type='text' placeholder={placeholder} value={this.state.search} onChange={this.onSearch} />
              <Icon g='search' />
            </div>
            {(sort && sort.length) && <Dropdown clearable={false} className='sort' name='sort' placeholder='Sort/Group by' value={this.state.sort} options={sort} />}
          </form>
        </div>
      </header>
    );
  }
}

PageHeader.defaultProps = {
  rootClassName: 'PageHeader--root',
  placeholder: 'Type to search by name, or other prop:value'
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
  /** Function invoked when ADD button clicked, if Function not provided  */
  onCreate: PropTypes.func,
  /** Onchange */
  onChange: PropTypes.func.isRequired,
  /** Placeholder for search field */
  placeholder: PropTypes.string,
  /** Options for sort/group dropdown */
  sort: PropTypes.arrayOf(optionShape)
}