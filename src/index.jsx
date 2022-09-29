import React from "react";
import { createRoot } from "react-dom/client";

import { Route, Routes, BrowserRouter } from "react-router-dom";

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

import "./styles/index.css";

import Overview from "./pages/Overview";
import Interactive from "./pages/Interactive";
import PrintPage from "./pages/PrintPage";
import Imprint from "./pages/imprint";
import Footer from "./components/Footer";
import Cite from "./pages/Cite";
import Input from "./pages/Input";
import Glossary from "./pages/Glossary";
import Notifications from "./components/Notifications";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Notifications />
            <Routes>
                <Route path="/" element={<Input />} />
                <Route path="/imprint" element={<Imprint />} />
                <Route path="/cite" element={<Cite />} />
                <Route path="/glossary" element={<Glossary />} />
                <Route path="/i/:sequence" element={<Interactive />} />
                <Route path="/p/:sequence" element={<PrintPage />} />
                <Route path="/o/:sequence" element={<Overview />} />
            </Routes>
            <Footer />
        </BrowserRouter>
    </React.StrictMode>
);
