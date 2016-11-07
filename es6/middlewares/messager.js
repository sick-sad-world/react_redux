import Push from 'push.js';
import config from '../app-config';

export default store => next => action => {
  let messageType;

  config.messageTypes.forEach(type => {
    if (action.payload.hasOwnProperty(type)) {
      messageType = type;
    }
  });

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
  } else {
    return next(action);
  }
}