import React from "react";
import { createRoot } from "react-dom/client";

import { Route, Routes, BrowserRouter } from "react-router-dom";

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

import "./styles/index.css";
import "./styles/App.css";

import Overview from "./pages/Overview";
import Interactive from "./pages/Interactive";
import PrintPage from "./pages/PrintPage";
import Imprint from "./pages/imprint";
import Footer from "./components/Footer";
import Cite from "./pages/Cite";
import Input from "./pages/Input";
import Glossary from "./pages/Glossary";
import Notifications from "./components/Notifications";
import Header from "./components/Header";
import { QueryClient, QueryClientProvider } from "react-query";

const container = document.getElementById("root");
const root = createRoot(container);

const queryClient = new QueryClient();

root.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Header />
                <Notifications />
                <Routes>
                    <Route path="/" element={<Input />} />
                    <Route path="/imprint" element={<Imprint />} />
                    <Route path="/cite" element={<Cite />} />
                    <Route path="/glossary" element={<Glossary />} />
                    <Route path="/i/:sequence" element={<Interactive />} />
                    <Route path="/i" element={<Interactive />} />
                    <Route path="/p/:sequence" element={<PrintPage />} />
                    <Route path="/p" element={<PrintPage />} />
                    <Route path="/o/:sequence" element={<Overview />} />
                    <Route path="/o" element={<Overview />} />
                </Routes>
                <Footer />
            </BrowserRouter>
        </QueryClientProvider>
    </React.StrictMode>
);
