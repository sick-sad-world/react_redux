const tFunc = 'cubic-bezier(.4,0,.2,1)'

export default {
  fade: {
    default: {
      transitionProperty: 'opacity',
      transitionTimingFunction: tFunc
    },
    entering: {
      opacity: '0.01'
    },
    entered: {
      opacity: '1'
    },
    exiting: {
      opacity: '0.01'
    },
    exited: {
    }
  },
  fadeDown: {
    default: {
      transitionProperty: 'opacity, transform',
      transitionTimingFunction: tFunc
    },
    entering: {
      transform: 'translate3d(0,-25%,0)',
      opacity: '0.01'
    },
    entered: {
      transform: 'translate3d(0,0,0)',
      opacity: '1'
    },
    exiting: {
      transform: 'translate3d(0,-25%,0)',
      opacity: '0.01'
    },
    exited: {
    }
  },
  zoomIn: {
    default: {
      transformOrigin: 'top center',
      transitionProperty: 'opacity, transform',
      transitionTimingFunction: tFunc
    },
    entering: {
      transform: 'scale(.75, .75)',
      opacity: '0.01'
    },
    entered: {
      transform: 'scale(1, 1)',
      opacity: '1'
    },
    exiting: {
      transform: 'scale(.75, .75)',
      opacity: '0.01'
    },
    exited: {
    }
  }
}