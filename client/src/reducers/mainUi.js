const INITIAL_STATE = {
  // selectedClass: "EECS 485"
  selectedClass: null
};

export const selectAClass = className => ({
  type: "SELECT_A_CLASS",
  className
});

const mainUiReducer = (state = INITIAL_STATE, action) => {
  // let newState;
  switch (action.type) {
    case "SELECT_A_CLASS":
      console.log("select a class: ", action.className);
      return {
        ...state,
        selectedClass: action.className
      };
    default:
      return state;
  }
};

export default mainUiReducer;
