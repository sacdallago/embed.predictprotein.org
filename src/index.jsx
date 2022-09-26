import React from "react";
import { createRoot } from "react-dom/client";

import { Route, Routes, BrowserRouter } from "react-router-dom";

import ReactGA from "react-ga";

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

import "./styles/index.css";

import * as serviceWorker from "./utils/serviceWorker";

import Overview from "./pages/Overview";
import Interactive from "./pages/Interactive";
import PrintPage from "./pages/PrintPage";
import Imprint from "./pages/imprint";
import Footer from "./components/Footer";
import Cite from "./pages/Cite";

// FIXME transition to React18 https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html
ReactGA.initialize(process.env.REACT_GA || "UA-137257046-2");

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Overview />} />
                <Route path="/imprint" element={<Imprint />} />
                <Route path="/cite" element={<Cite />} />
                <Route path="/i/:sequence" element={<Interactive />} />
                <Route path="/p/:sequence" element={<PrintPage />} />
                <Route path="/o/:sequence" element={<Overview />} />
            </Routes>
            <Footer />
        </BrowserRouter>
    </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
