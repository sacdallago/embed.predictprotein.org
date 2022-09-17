import React from "react";

import { keyframes } from "styled-components";
import styled from "styled-components";
import Helix from "../assets/helix.svg";

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;
function _Spinner(props) {
    return (
        <img
            className={props.className}
            src={Helix}
            alt="spinning protein logo"
        ></img>
    );
}

export const Spinner = styled(_Spinner)`
    display: inline-block;
    animation: ${rotate} 2s linear infinite;
    with: ${(props) => props.size || "1em"};
    height: ${(props) => props.size || "1em"};
`;
