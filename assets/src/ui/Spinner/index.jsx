import { Component } from 'react';
import './styles.scss';

export default function SvgSpinner() {
  return (
    <svg className='spinner' width='65px' height='65px' viewBox='0 0 66 66'>
      <circle className='path' fill='none' strokeWidth='6' strokeLinecap='round' cx='33' cy='33' r='30' />
    </svg>
  );
}