/*
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
*/

import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import { Provider } from "react-redux";
import { store } from "./stores/index";
import ReactGA from "react-ga";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Switch,
  HashRouter
} from "react-router-dom";
import { PrintPage } from "./components";
import { createBrowserHistory } from "history";
import { Nav, Navbar, NavLink, Container } from "react-bootstrap";

ReactGA.initialize(process.env.REACT_GA || "UA-137257046-2");
const history = createBrowserHistory();

ReactDOM.render(
  <Provider store={store}>
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="#home"> </Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="https://github.com/sacdallago/bio_embeddings" target="_blank" rel="noopener noreferrer">
            Code
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
    <React.StrictMode>
      <HashRouter history={history}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route
            path="/printpage/:sequence"
            element={<PrintPage/>}
            render={(features) => (
              <PrintPage
              {...features}
              />
              )
            }
          />
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
