import React from "react";
import styled from "styled-components";

import { BsBoxArrowInDown, BsBoxArrowDownRight } from "react-icons/bs";

import Bibliography from "./Bibliography";

const Details = styled.details`
    border: 2px solid var(--bs-gray-300);
`;

const Summary = styled.summary`
    list-style: none;
    font-size: 1.2em;
    background-color: var(--bs-gray-300);
`;

const Children = styled.div`
    padding: 7px 7px 4px;
`;

export default function MethodDetails({ citations = [], children }) {
    const [isOpen, setOpen] = React.useState(false);

    const Marker = () =>
        isOpen ? <BsBoxArrowInDown /> : <BsBoxArrowDownRight />;

    return (
        <>
            <Details className="mb-5" open={isOpen}>
                <Summary
                    onClick={(e) => {
                        e.preventDefault();
                        setOpen(!isOpen);
                    }}
                >
                    {Marker()}
                    <span className="ms-3">Method Details</span>
                </Summary>
                <Children>
                    {children}
                    <hr />
                    <Bibliography citations={citations} />
                </Children>
            </Details>
        </>
    );
}
