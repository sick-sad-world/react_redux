import { SERVER_ERROR } from '../actions/types';
import Push from 'push.js';
import config from '../app-config';

export default store => next => action => {
  let messageType;
  if (action.type === SERVER_ERROR) {
    messageType = 'error';
  } else if (action.payload) {
    config.messageTypes.forEach(type => {
      if (action.payload.hasOwnProperty(type)) {
        messageType = type;
      }
    });
  }

  if (messageType) {
    Push.create(messageType, {
      body: action.payload[messageType],
      icon: config.messageIcons[messageType],
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