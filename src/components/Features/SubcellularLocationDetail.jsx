import React from "react";

import MethodDetails from "../MethodDetails";

export default function SubcellularLocationDetail() {
    return (
        <MethodDetails citations={["10.1093/bioadv/vbab035"]}>
            <p>
                LA ProtT5 predicts the sub-cellular localization of proteins in
                ten classes (nucleus, cytoplasm, extracellular space,
                mitochondrion, cell membrane, endoplasmatic reticulum, plastid,
                Golgi apparatus, lysosome/vacuole and peroxisome). {""}
                The method was trained and evaluated on eukaryotic proteins.
            </p>
        </MethodDetails>
    );
}
