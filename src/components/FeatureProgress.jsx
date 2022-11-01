import React from "react";

import { Alert, ProgressBar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useFeatures } from "../hooks/useFeatures";
import StyledSpinner from "./Spinner";

const DEFAULT_REQUEST_TIME_SEC = 12;

export default function FeatureProgress() {
    const [counter, setCounter] = React.useState(DEFAULT_REQUEST_TIME_SEC);
    const [delayed, setDelayed] = React.useState(false);
    const { isSuccess, isLoading, isError, isPaused } = useFeatures();

    React.useEffect(() => {
        if (!delayed && isLoading && counter > 0)
            setTimeout(() => setCounter(counter - 1), 1000);
        else if (counter <= 0) {
            setDelayed(true);
            setCounter(DEFAULT_REQUEST_TIME_SEC);
        } else if (!isLoading) {
            setCounter(DEFAULT_REQUEST_TIME_SEC);
        }
    }, [isLoading, delayed, counter]);

    if (isPaused) {
        return (
            <Alert variant="danger" className="col-md-8">
                There seems to be an issue with your network connection.
            </Alert>
        );
    }

    if (isError) {
        return (
            <Alert variant="danger" className="col-md-8">
                Apologies! Something went wrong.{" "}
                <Link to="/">Please try again.</Link>
            </Alert>
        );
    }
    if (isSuccess) {
        return <></>;
    }
    if (isLoading) {
        if (!delayed) {
            let progress =
                ((DEFAULT_REQUEST_TIME_SEC - counter) /
                    DEFAULT_REQUEST_TIME_SEC) *
                100;
            return (
                <Alert variant="info" className="col-md-8">
                    <StyledSpinner size="1.5em" /> We are beaming the results
                    from our server to your computer...
                    <ProgressBar
                        striped
                        now={progress}
                        label={`${progress}%`}
                        visuallyHidden
                    />
                </Alert>
            );
        } else {
            return (
                <Alert variant="warning" className="col-md-8">
                    <StyledSpinner size="1.5em" /> Apologies! Getting the
                    results takes longer than usual...
                </Alert>
            );
        }
    }
}
