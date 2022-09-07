import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import Interactive from "./Interactive";
import "./styles/index.css";
import * as serviceWorker from "./utils/serviceWorker";
import { Provider } from "react-redux";
import { store } from "./stores/index";
import ReactGA from "react-ga";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { Route, Routes, HashRouter } from "react-router-dom";
import { PrintPage } from "./components";
import { createBrowserHistory } from "history";

// FIXME transition to React18 https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html
ReactGA.initialize(process.env.REACT_GA || "UA-137257046-2");
const history = createBrowserHistory();

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <HashRouter history={history}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/interactive/:sequence" element={<Interactive />} />
          <Route path="/printpage/:sequence" element={<PrintPage />} />
          <Route path="/:sequence" element={<App />} />
        </Routes>
      </HashRouter>
    </React.StrictMode>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
