import React from "react";

import MethodDetails from "../MethodDetails";

export default function VariantEffectPredictionDetail() {
    return (
        <MethodDetails citations={["10.1007/s00439-021-02411-y"]}>
            <p>
                The following visualization displays the effect of substituting
                the residue at position X on the x-axis with amino acid Y on the
                y-axis. Darker color / higher value indicates more significant
                effect in performing said substitution, while a lighter color /
                lower value indicates a more tolerable substitution. The hatched
                squares indicate the wild-type residue at the given position,
                for which the substitution effect score is null. SAV effect was
                computed using the VESPAl method.
            </p>
        </MethodDetails>
    );
}
