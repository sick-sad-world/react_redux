export default store => next => action => {
  //console.log("dispatching", action);
  let result = next(action);
  console.log("next state after", action.type, store.getState());
  return result;
}