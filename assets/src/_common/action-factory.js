import fetch from '../communication';

export default function createAction({ call, action }) {
  return (data, options) => async (dispatch, getState, { notification, clientError }) => {
    const { entity, ...opts } = options || {};

    try {
      const result = await (typeof call === 'string' ? fetch(call, data, opts) : call(data, opts));

      result.success = undefined;
      result.message = undefined;
      if (result.error) throw { error: result.error };
      return dispatch({ type: action, payload: result, entity });
    } catch (error) {
      console.error(error);
      if (error instanceof Error && clientError) {
        // Dispatch global app Error
        // ===========================================================================
        return dispatch(clientError(error));
      } else if (error && notification && !opts.silent) {
        // Dispatch error notification
        // ===========================================================================
        return dispatch(notification({
          id: Date.now(),
          type: 'error',
          text: (error.event) ? `Network error: ${error.url}` : error.error
        }));
      }
      throw error;
    }
  };
}
