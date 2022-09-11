import React from "react";

import Stack from "react-bootstrap/Stack";

export const Imprint = () => {
    return (
        <Stack gap={1}>
            <div>
                <h1>Imprint</h1>
            </div>
            <div>
                <h3> Adress </h3>
                <p className="imprint-adress">
                    I12 - Department for Bioinformatics and Computational
                    Biology <br />
                    School of Computation, Information and Technology <br />
                    Boltzmannstraße 3 <br />
                    85748 Garching <br />
                    Germany
                </p>
            </div>
            <div>
                <h3>Authorized representative</h3>
                <p>
                    Technical University of Munich is a statutory body under
                    public law (Art. 11 Abs. 1 BayHSchG). It is legally
                    represented by the President, Prof. Dr. Thomas F. Hofmann.
                </p>
            </div>
            <div>
                <h3>Supervisory Authority</h3>
                <p>
                    Bavarian State Ministry of Science and the Arts (Bayerisches
                    Staatsministerium für Wissenschaft und Kunst)
                </p>
            </div>
            <div>
                <h3>VAT ID</h3>
                <p>DE811193231 (§27a UStG)</p>
            </div>
            <div>
                <h3>Responsible for Content</h3>
                <p className="imprint-adress">
                    Prof. Dr. Burkhard Rost <br />
                    Boltzmannstraße 3 <br />
                    85748 Garching <br />
                    assistant. (at) .rostlab.org <br />
                    Tel: +49 (89) 289-17811 <br />
                    Fax: +49 (89) 289-19414
                </p>
            </div>
            <div>
                <h3>Legal disclaimer</h3>
                <p>
                    In spite of regularily monitoring the linked resources with
                    great care, we do not accept any responsibility for the
                    content of external links. The operators of these websites
                    are solely responsible for their content.
                </p>
            </div>
        </Stack>
    );
};

export default Imprint;
