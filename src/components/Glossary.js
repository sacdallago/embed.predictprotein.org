import React from "react";

class Glossary extends React.Component {
  render() {
    return (
        <div>
          <h3>Glossary</h3>
          <p>
            <strong>bio-embeddings:</strong> hosts the backend to this webserver and all prediction models featured on EMPP. <a target={"_blank"} ref={"author"} href={"https://doi.org/10.1002/cpz1.113"}>10.1002/cpz1.113</a>
          </p>
          <p>
            <strong>ProtT5:</strong> computes protein embeddings used as inputs for downstream prediction tasks. <a target={"_blank"} ref={"author"} href={"https://ieeexplore.ieee.org/document/9477085"}>10.1109/TPAMI.2021.3095381</a>
          </p>
          <p>
            <strong>ProtT5Cons:</strong> predicts the conservation score for each residue in a sequence. <a href="https://link.springer.com/article/10.1007/s00439-021-02411-y" target={"blank"}>10.1007/s00439-021-02411-y</a>
          </p>
          <p>
            <strong>ProtT5Sec:</strong> predicts the secondary structure assignment of each residue in a sequence. <a target={"_blank"} ref={"author"} href={"https://ieeexplore.ieee.org/document/9477085"}>10.1109/TPAMI.2021.3095381</a>
          </p>
          <p>
            <strong>Light Attention (LA):</strong> predicts protein sub-cellular location in ten classes. <a href="https://doi.org/10.1093/bioadv/vbab035" target={"blank"}>10.1093/bioadv/vbab035</a>
          </p>
          <p>
            <strong>VESPAi:</strong> predicts the effect of varying each residue in a sequence to all other possible amino acids. <a href="https://link.springer.com/article/10.1007/s00439-021-02411-y" target={"blank"}>10.1007/s00439-021-02411-y</a>
          </p>
          <p>
            <strong>TMbed:</strong> predicts signal peptides and transmembrane regions. <a href="https://doi.org/10.1101/2022.06.12.495804" target={"blank"}>10.1101/2022.06.12.495804</a>
          </p>
          <p>
            <strong>GoPredSim:</strong> predictions Gene Ontology (GO) terms. <a href="https://doi.org/10.1101/2022.06.12.495804" target={"blank"}>10.1101/2022.06.12.495804</a>
          </p>
          <p>
            <strong>BindEmbedDL:</strong> predictions of ligand binding residues in three classes. <a href="https://www.nature.com/articles/s41598-021-03431-4" target={"blank"}>10.1038/s41598-021-03431-4</a>
          </p>
          <p>
            <strong>ColabFold:</strong> predicts protein 3D structure from an input sequence based on AlphaFold. <a href="https://www.nature.com/articles/s41592-022-01488-1" target={"blank"}>10.1038/s41592-022-01488-1</a>
          </p>
          <p>
            <strong>AlphaFold Database (AFDB):</strong> a large collection of pre-computed predicted AlphaFold structures. <a href="https://academic.oup.com/nar/article/50/D1/D439/6430488" target={"blank"}>10.1093/nar/gkab1061</a>
          </p>
        </div>
    );
  }
}

export default Glossary;
