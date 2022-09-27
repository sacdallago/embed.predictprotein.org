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
function Spinner(props) {
    return <img {...props} src={Helix} alt="spinning protein logo"></img>;
}

const StyledSpinner = styled(Spinner)`
    display: inline-block;
    animation: ${rotate} 2s linear infinite;
    with: ${(props) => props.size || "1em"};
    height: ${(props) => props.size || "1em"};
`;

export default StyledSpinner;
