import React from 'react';
import Loading from './loading';

// Unificated Edit form header
// @ used on all edit forms
// ===========================================================================
export default function EditFormHeader (props) {
  return (
    <header className='subsection-header'>
      <div className='text'>
        <h1>{`${props.title} ${(props.name) ? ": '"+props.name+"'" : ''}`}</h1>
        <p>{props.description}</p>
      </div>
      <Loading run={props.running} />
    </header>
  )
}