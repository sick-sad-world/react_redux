import React from 'react';

// Error component -> Display criticat JS erros on client
// ===========================================================================
export default function ClientError (props) {
  return (
    <div className='global-error'>
      <h3>Oops! Error encountered</h3>
      <p>{props.error}</p>
      <small>Please contact us and provide details. So we able to fix it.</small>
    </div>
  );
}