import React from "react";
import { createRoot } from "react-dom/client";

import { Route, Routes, BrowserRouter } from "react-router-dom";
import { MatomoProvider, createInstance } from "@jonkoops/matomo-tracker-react";

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

import "./styles/index.css";
import "./styles/App.css";

import Imprint from "./pages/imprint";
import Footer from "./components/Footer";
import Cite from "./pages/Cite";
import Input from "./pages/Input";
import Glossary from "./pages/Glossary";
import Notifications from "./components/Notifications";
import Header from "./components/Header";
import { QueryCache, QueryClient, QueryClientProvider } from "react-query";
import { Followup } from "./pages/Followup";
import { handleQueryError } from "./lib/error";
import { PAGES } from "./lib/pages";
import { Legal } from "./pages/Legal";

const container = document.getElementById("root");
const root = createRoot(container);

const queryClient = new QueryClient({
    queryCache: new QueryCache({
        onError: (error, query) => handleQueryError(error, query),
    }),
});

const instance = createInstance({
    urlBase: "https://embed.predictprotein.org",
    siteId: 4,
    trackerUrl: "https://predictprotein.org/piwik/piwik.php", // optional, default value: `${urlBase}matomo.php`
    disabled: false, // optional, false by default. Makes all tracking calls no-ops if set to true.
    heartBeat: {
        // optional, enabled by default
        active: true, // optional, default value: true
        seconds: 15, // optional, default value: `15
    },
    linkTracking: true, // optional, default value: true
    configurations: {
        // optional, default value: {}
        // any valid matomo configuration, all below are optional
        disableCookies: false,
        setSecureCookie: true,
        setRequestMethod: "POST",
    },
});

root.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <MatomoProvider value={instance}>
                <BrowserRouter>
                    <Header />
                    <Routes>
                        <Route path="/" element={<Input />} />
                        <Route path="/imprint" element={<Imprint />} />
                        <Route path="/cite" element={<Cite />} />
                        <Route path="/glossary" element={<Glossary />} />
                        <Route path="/legal" element={<Legal />} />
                        <Route
                            path="/i/:sequence"
                            element={<Followup page={PAGES.interactive} />}
                        />
                        <Route
                            path="/i"
                            element={<Followup page={PAGES.interactive} />}
                        />
                        <Route
                            path="/p/:sequence"
                            element={<Followup page={PAGES.print} />}
                        />
                        <Route
                            path="/p"
                            element={<Followup page={PAGES.print} />}
                        />
                        <Route
                            path="/o/:sequence"
                            element={<Followup page={PAGES.overview} />}
                        />
                        <Route
                            path="/o"
                            element={<Followup page={PAGES.overview} />}
                        />
                    </Routes>
                    <Footer />
                    <Notifications />
                    {/*NOTE: Leave as last element so it is rendered above all.*/}
                </BrowserRouter>
            </MatomoProvider>
        </QueryClientProvider>
    </React.StrictMode>
);
