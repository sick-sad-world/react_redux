export default store => next => action => {
  if (Array.isArray(action.payload)) {

  }
  return next(action);
}