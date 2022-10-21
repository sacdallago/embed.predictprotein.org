import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

import styled from "styled-components";
import useAPIStatus from "../hooks/useServiceStatus";

import Spinner from "./Spinner";

const Circle = styled.span.attrs((props) => ({
    color: props.color || "red",
}))`
    height: 1em;
    width: 1em;
    background-color: ${(props) => props.color};
    border-radius: 50%;
    display: inline-block;
    position: relative;
    bottom: -3px;
`;

const MenuItem = styled.div`
    &:focus,
    &:active {
        background-color: var(--bs-dropdown-link-hover-bg);
    }
    cursor: default;
`;

const get_circle = (isLoading, isError) => {
    if (isLoading) return <Spinner />;
    if (isError) return <Circle color="red" />;
    return <Circle color="green" />;
};

const get_display_for_status = (worker, isLoading, isError) => {
    let element = get_circle(isLoading, isError);

    let text = "Available";
    if (isError) text = "Unavailable";
    if (isLoading) text = "Loading Status...";

    return (
        <OverlayTrigger
            key={worker}
            placement="left"
            overlay={
                <Tooltip id={`tooltip-${worker}`}>
                    <strong>{text}</strong>.
                </Tooltip>
            }
        >
            <Dropdown.Item as={MenuItem}>
                {element} {worker}
            </Dropdown.Item>
        </OverlayTrigger>
    );
};

export default function ServiceStatus(props) {
    const [globalLoading, globalError, serviceStatus] = useAPIStatus();

    return (
        <Dropdown {...props}>
            <Dropdown.Toggle size="sm" variant="dark" id="dropdown-worker">
                {get_circle(globalLoading, globalError)}
            </Dropdown.Toggle>

            <Dropdown.Menu variant="dark">
                {serviceStatus.map((query) =>
                    get_display_for_status(
                        query.name,
                        query.isError,
                        query.isLoading
                    )
                )}
            </Dropdown.Menu>
        </Dropdown>
    );
}
