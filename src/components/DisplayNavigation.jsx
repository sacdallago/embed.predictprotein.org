import React from "react";

import { Nav, Tooltip, OverlayTrigger } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { PageToURL, PAGES } from "../utils/pages";

export default function DisplayNavigation({ page }) {
    const navigate = useNavigate();
    const handleNav = (key, event) => {
        navigate(PageToURL[key]);
    };
    return (
        <Nav
            fill
            variant="pills"
            defaultActiveKey={page}
            onSelect={(key, event) => handleNav(key, event)}
        >
            <Nav.Item>
                <OverlayTrigger
                    overlay={
                        <Tooltip id="tooltip-overview">
                            Overview over predicted features + explanations.
                        </Tooltip>
                    }
                >
                    <Nav.Link eventKey={PAGES.overview}>Overview</Nav.Link>
                </OverlayTrigger>
            </Nav.Item>
            <Nav.Item>
                <OverlayTrigger
                    overlay={
                        <Tooltip id="tooltip-interactive">
                            Features with minimal explanation; good for
                            exploration and analysis.
                        </Tooltip>
                    }
                >
                    <Nav.Link eventKey={PAGES.interactive}>
                        Interactive
                    </Nav.Link>
                </OverlayTrigger>
            </Nav.Item>
            <Nav.Item>
                <OverlayTrigger
                    overlay={
                        <Tooltip id="tooltip-print">
                            Print-friendly display of predicted features.
                        </Tooltip>
                    }
                >
                    <Nav.Link eventKey={PAGES.print}>Print</Nav.Link>
                </OverlayTrigger>
            </Nav.Item>
        </Nav>
    );
}
