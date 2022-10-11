import React, { useState } from "react";
import { Placeholder } from "react-bootstrap";

import styled from "styled-components";

import { useFeatures } from "../../hooks/useFeatures";

const LetterComponent = styled.pre`
    display: inline;
    margin: 0px;
    font-size: 1.2rem;
    border-style: none;
    background-color: ${((props) => props.background) ?? "transparent"};
    color: ${((props) => props.color) ?? "black"};
`;

const NumberComponent = styled.div`
    position: relative;

    &::before {
        margin: 0px;
        color: black;
        position: absolute;
        top: -0.8em;
        right: 0px;
        font-size: 0.6em;
        content: attr(data-text);
    }
`;

const SequenceContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 0.15em 0.7em;
    flex-wrap: wrap;
`;

function sequence2kmer(sequence, chunk = 10) {
    const re_split = new RegExp(`(.{${chunk}})`, "gm");
    return (
        sequence
            // Remove spaces
            .replace(/\s/g, "")
            // Make upper case
            .toUpperCase()
            // Split in k-emers composed by letters
            .split(re_split)
            // Filter only populated k-emers
            .filter(Boolean)
    );
}

function kmer2component(sequence, displayStyle, chunk = 10) {
    const kmers = sequence2kmer(sequence, chunk);

    return kmers.map((kmer, block_idx) => {
        let seq_pos = block_idx * chunk + Math.min(10, kmer.length);
        return (
            <NumberComponent data-text={seq_pos} key={`row-${seq_pos}`}>
                {[...kmer].map((letter, position) => {
                    return (
                        <LetterComponent
                            background={displayStyle["contrast"][letter]}
                            color={displayStyle["primary"][letter]}
                            key={position}
                        >
                            {letter}
                        </LetterComponent>
                    );
                })}
            </NumberComponent>
        );
    });
}

export default function Highlighter({ dataFn, displayStyle }) {
    const { isSuccess, isLoading, isError, data } = useFeatures();

    const [setState, sequenceState] = useState({
        selected: undefined,
        region: [0, 0],
        highlightOnClick: false,
    });

    if (isLoading) return <LoadedHighlighter />;
    if (isError) return <ErroredHighlighter />;
    if (isSuccess) {
        return (
            <LoadedHighlighter
                sequence={dataFn(data)}
                displayStyle={displayStyle}
            />
        );
    }
}

function LoadingHighlighter() {
    <SequenceContainer>
        <Placeholder animation="glow"></Placeholder>
    </SequenceContainer>;
}

function ErroredHighlighter() {}

function LoadedHighlighter({ sequence, displayStyle }) {
    return (
        <SequenceContainer>
            {kmer2component(sequence, displayStyle)}
        </SequenceContainer>
    );
}
