import React from 'react';
import PropTypes from 'prop-types';
import Icon from './icon';

export default function DragHandle({ handler }) {
  return <Icon className='drag-handle' icon='dots-three-vertical' handler={handler} />;
}
DragHandle.propTypes = {
  handler: PropTypes.func
};
