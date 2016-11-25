import { SERVER_ERROR, MESSAGE, HTML_ERROR } from '../actions/types';
import Push from 'push.js';


export default store => next => action => {
  
  let push = (title, icon, text) => Push.create(title, {
    body: text,
    icon: icon,
    timeout: 5000,
    onClick: function () {
      window.focus();
      this.close();
    }
  });

  switch (action.type) {
    case MESSAGE:
      push('Message:', 'success.png', action.text);
      break;
    case SERVER_ERROR:
      push('Error:', 'error.png', action.text);
      break;
    case HTML_ERROR:
      push('HTML error:', 'error.png', action.text);
      break;
    default:
      return next(action);
  }
}