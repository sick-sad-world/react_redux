import { SERVER_ERROR, SUCCESS_MESSAGE, INFO_MESSAGE, WARNING_MESSAGE, HTML_ERROR, CLIENT_ERROR } from '../actions/types';
import Push from 'push.js';


export default store => next => action => {
  
  let push = (title, icon, text) => Push.create(title, {
    body: text,
    icon: `/img/notifications/${icon}.png`,
    timeout: 5000,
    onClick: function () {
      window.focus();
      this.close();
    }
  });
  if (!action.silent) {
    switch (action.type) {
      case SUCCESS_MESSAGE:
        push('Success:', 'success', action.text);
        break;
      case CLIENT_ERROR:
        console.error(action.text);
        push('Client Error:', 'error', action.text);
        break;
      case SERVER_ERROR:
        push('Error:', 'error', action.text);
        break;
      case HTML_ERROR:
        push('HTML error:', 'error', action.text);
        break;
      case WARNING_MESSAGE:
        push('Warning:', 'warning', action.text);
        break;  
      case INFO_MESSAGE:
        push('Information:', 'info', action.text);
        break;
      default:
        return next(action);
    }
  } else {
    return next(action);
  }
  
}