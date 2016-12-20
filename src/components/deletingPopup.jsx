import React from 'react';

export default function DeletingPopup (props) {
  return (
    <div style={props.dialogPos} className='small-popup delete-confirmation'>
      <span className='text'>Are you sure about that?</span>
      <p>
        <a href='' onClick={props.handlerDelete} className='button'>Delete</a>
        <span onClick={props.handlerCancel} className='button is-accent'>Cancel</span>
      </p>
    </div>
  );
}