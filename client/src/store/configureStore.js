import { createStore } from "redux";
import mainUiReducer from "../reducers/mainUi";

export default function configureStore() {
  return createStore(
    mainUiReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );
}
