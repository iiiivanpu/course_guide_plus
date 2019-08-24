const INITIAL_STATE = {
  selectedClass: 'EECS 485',
  // selectedClass: null,
  isMobile: null,
};

export const selectAClass = className => ({
  type: 'SELECT_A_CLASS',
  className,
});

export const updateIsMobile = isMobile => ({
  type: 'UPDATE_IS_MOBILE',
  isMobile,
});

let firstCall = true;

const initialUrlSync = state => {
  firstCall = false;
  const params = new URLSearchParams(window.location.search);
  const type = params.get('type');
  const number = params.get('number');
  type && number
    ? (state.selectedClass = `${type.toUpperCase()} ${number}`)
    : (state.selectedClass = null);
  return state;
};

const mainUiReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SELECT_A_CLASS':
      return {
        ...state,
        selectedClass: action.className,
      };
    case 'UPDATE_IS_MOBILE':
      return {
        ...state,
        isMobile: action.isMobile,
      };
    default:
      return state;
  }
};

const globalReducer = (state = INITIAL_STATE, action) => {
  if (!firstCall) return mainUiReducer(state, action);
  return initialUrlSync(state);
};

export default globalReducer;
