import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { classNameShape } from 'shared/typings';
import { configColumnShape, configActionShape } from './Row';

/** Header for DataList, With column labels, and some additional controls */
export default function ListHeader({config, template, sortable, rootClassName, className}) {
  const rootClasses = cn(rootClassName, className, {
    'is-sortable': sortable,
    'is-subdata': !!config.subdata,
    'is-actions': !!config.actions
  });
  return (
    <div key='list-header' className={rootClasses}>
      <div className='container' style={{gridTemplateColumns: template}}>
        {config.columns.map(({id, label}) => (<h5 key={id}>{label}</h5>))}
      </div>
    </div>
  );
}

ListHeader.defaultProps = {
  sotrable: true,
  rootClassName: 'DataList--header'
}

ListHeader.propTypes = {
  /** Classname all styles bound to */
  rootClassName: PropTypes.string.isRequired,
  /** Config for top level column, this will able Header to match list items */
  config: PropTypes.shape({
    columns: configColumnShape.isRequired,
    actions: configActionShape,
    subdata: PropTypes.shape({
      columns: configColumnShape.isRequired,
      actions: configActionShape
    })
  }).isRequired,
  /** ClassNames that will be added to root component */
  className: classNameShape,
  /** CSS Grid template value */
  template: PropTypes.string.isRequired,
  /** Defines whatever Parend List is sortable */
  sortable: PropTypes.bool.isRequired
}