import ReactDOM from "react-dom/client";
import { render } from "react-dom";
import { Provider } from "react-redux";

import App from "./App";
import { store } from "./store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

render(<App />, document.getElementById("root"));
