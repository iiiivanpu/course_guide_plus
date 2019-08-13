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

const mainUiReducer = (state = INITIAL_STATE, action) => {
  // let newState;
  switch (action.type) {
    case 'SELECT_A_CLASS':
      console.log('select a class: ', action.className);
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

export default mainUiReducer;
