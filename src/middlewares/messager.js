import { SERVER_ERROR } from '../actions/types';
import Push from 'push.js';


export default store => next => action => {
  let messageType;
  let messageIcons = {};
  if (action.type === SERVER_ERROR) {
    messageType = 'error';
  } else if (action.payload) {
    ['error', 'success', 'message'].forEach(type => {
      if (action.payload.hasOwnProperty(type)) {
        messageType = type;
      }
    });
  }
console.log(action);
  if (messageType && !action.silent && action.payload[messageType].length) {
    Push.create(messageType, {
      body: action.payload[messageType],
      icon: messageIcons[messageType],
      timeout: 5000,
      onClick: function () {
        window.focus();
        this.close();
      }
    });
  }

  if (messageType !== 'error') {
    return next(action);
  }
}