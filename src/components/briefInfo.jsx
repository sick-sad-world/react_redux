import React from 'React';

export default function UserBlock (props) {
    return (
      <div className='mod-user-block' id='funHeaderUser'>
        <img src={ '/'+props.image } alt={ props.fullname } />
        <div className='t-ellipsis'>
          <h2>{ props.fullname }</h2>
          <small>{ props.position }</small>
        </div>
      </div>
    );
}

