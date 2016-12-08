import React from 'react';
import Icon from './icon';

export default function Loading (props) {
  let className = 'loading-cogs';
  if (props.run) {
    className += ' is-running'
  }
  return (
    <div className={className}>
      <Icon className='cog-1' icon='cog' />
      <Icon className='cog-2' icon='cog' />
      <Icon className='cog-3' icon='cog' />
      <Icon className='cog-4' icon='cog' />
    </div>
  );
} 