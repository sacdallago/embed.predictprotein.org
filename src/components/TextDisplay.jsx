import React from "react";

import styled from "styled-components";

export const TextDisplay = styled.div`
    display: inline-block;
    margin: 0;
    padding: 0.2em;
    width: 100%;
    max-width: 100%;
    word-wrap: break-word;
    line-height: 1.5em;
    height: 7.8em;
    min-height: 7.8em;
    border: 1px solid var(--bs-gray-400);
    cursor: text;
    background-color: var(--bs-gray-200);
    overflow: auto;
    resize: vertical;
    border-radius: 5px;
    font-size: 1rem;
    font-weight: 400;

    &:focus,
    &:focus-within,
    &:active {
        outline: 4px solid #9eeaf9;
    }
`;

export default TextDisplay;
