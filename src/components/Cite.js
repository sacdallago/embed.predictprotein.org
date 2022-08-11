import React from "react";

class Cite extends React.Component {
    render() {
        return (
            <div>
                <h3>Cite</h3>
                <div style={{textAlign: "justify"}}>
                    <span><strong>LambdaPP: Fast and accessible protein-specific phenotype predictions</strong></span>
                    <span> Tobias Olenyi, Céline Marquet, Michael Heinzinger, Benjamin Kröger, Tiha Nikolova, Michael Bernhofer, Philip Sändig, Konstantin Schütze, Maria Littmann, Milot Mirdita, Martin Steinegger, Christian Dallago, Burkhard Rost. </span>
                </div>
                <span>bioRxiv 2022.08.04.502750; doi: <a target={"_blank"} href={"https://doi.org/10.1101/2022.08.04.502750"}>https://doi.org/10.1101/2022.08.04.502750</a></span>
            </div>
        );
    }
}

export default Cite;
