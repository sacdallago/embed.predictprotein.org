import React from "react";

import { Button } from "react-bootstrap";
import Spinner from "./Spinner";

export default function LoadingButton({ loading, children, ...props }) {
    let btn_disabled = (props.disabled ?? false) || loading;
    if (props.hasOwnProperty("disabled")) delete props.disabled;
    return (
        <Button disabled={btn_disabled} {...props}>
            {loading && <Spinner className="me-1" />}
            {children}
        </Button>
    );
}
