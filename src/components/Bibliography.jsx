import React from "react";
import styled from "styled-components";
import Cite from "citation-js";

import { BsBoxArrowInUpRight } from "react-icons/bs";
import {
    HiOutlineClipboardCopy,
    HiOutlineClipboardCheck,
} from "react-icons/hi";
import { useCitations } from "../hooks/useCitations";
import HelixSpinner from "./Spinner";
import { Button } from "react-bootstrap";

Cite.plugins.output.add("url", (data) => data[0]["URL"]);

const BibContainer = styled.div``;

const BibEntry = styled.div``;

function CopyLink({ data, text, citeKey }) {
    const [copied, setCopied] = React.useState(false);

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            if (copied) setCopied(false);
        }, 1000);

        return () => clearTimeout(timeout);
    }, [copied]);

    async function copy() {
        if ("clipboard" in navigator) {
            return await navigator.clipboard.writeText(data);
        } else {
            return document.execCommand("copy", true, data);
        }
    }

    const handler = async () => {
        var state = await copy();
        setCopied(true);
        return state;
    };

    return (
        <Button variant="link" className="link-dark" onClick={handler}>
            <HiOutlineClipboardCopy className={copied ? "d-none" : ""} />
            <HiOutlineClipboardCheck className={!copied ? "d-none" : ""} />
            {text}
        </Button>
    );
}

function citation_entry(cite, index) {
    return (
        <BibEntry key={index}>
            {cite.format("bibliography", { template: "apa", lang: "en-US" })}
            <CopyLink
                data={cite.format("bibliography", {
                    template: "apa",
                    lang: "en-US",
                })}
                citeKey={cite.format("citation")}
                text="APA"
            />
            <CopyLink
                data={cite.format("ris")}
                text="RIS"
                citeKey={cite.format("citation")}
            />
            <CopyLink
                data={cite.format("bibtex")}
                text="bibtex"
                citeKey={cite.format("citation")}
            />
            <a
                href={cite.format("url")}
                className="link-dark"
                target="_blank"
                rel="noreferrer"
            >
                <BsBoxArrowInUpRight /> open
            </a>
        </BibEntry>
    );
}

function BibliographyLoaded({ data }) {
    return data.map(citation_entry);
}

function BiblographyError() {
    return "Could not fetch paper information";
}

function BibliographyLoading() {
    return (
        <>
            <HelixSpinner /> Loading Citation Data...
        </>
    );
}

export default function Bibliography({ citations }) {
    const [isLoading, isError, data] = useCitations(citations);

    var container = undefined;
    if (isLoading) container = <BibliographyLoading />;
    else if (isError) container = <BiblographyError />;
    else container = <BibliographyLoaded data={data} />;

    return <BibContainer>{container}</BibContainer>;
}
