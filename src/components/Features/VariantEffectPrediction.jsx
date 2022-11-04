import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import { Placeholder } from "react-bootstrap";
import { useFeatures } from "../../hooks/useFeatures";
import { EffectPredictor } from "../../lib/effect";
import MethodDetails from "../MethodDetails";

export default function VariantEffectPrediction() {
    const { isSuccess, isLoading, isError, data } = useFeatures();

    const renderAction = () => {
        if (isLoading) {
            return <VariantEffectPredictionLoading />;
        }
        if (isError) {
            return <VariantEffectPredictionError />;
        }
        if (isSuccess) {
            return (
                <VariantEffectPredictionLoaded data={data.predictedVariation} />
            );
        }
    };

    return (
        <>
            <MethodDetails citations={["10.1007/s00439-021-02411-y"]}>
                <p>
                    The following visualization displays the effect of
                    substituting the residue at position X on the x-axis with
                    amino acid Y on the y-axis. Darker color / higher value
                    indicates more significant effect in performing said
                    substitution, while a lighter color / lower value indicates
                    a more tolerable substitution. The hatched squares indicate
                    the wild-type residue at the given position, for which the
                    substitution effect score is null. SAV effect was computed
                    using the VESPAl method.
                </p>
            </MethodDetails>
            {renderAction()}
        </>
    );
}
function VariantEffectPredictionLoading() {
    return (
        <>
            <Placeholder animation="glow">
                <Placeholder
                    style={{ width: "100%", height: "75px" }}
                    className="mb-2"
                />
                <Placeholder
                    style={{
                        width: "95%",
                        height: "440px",
                        marginLeft: "20px",
                        marginTop: "30px",
                    }}
                />
            </Placeholder>
        </>
    );
}
function VariantEffectPredictionError() {}

function VariantEffectPredictionLoaded({ data }) {
    const containerRef = useRef(null);
    const predictor = useRef(null);
    const [effectData, setEffectData] = useState(undefined);

    // Cleanup data and prepare for d3
    useEffect(() => {
        let tmpData = {};
        tmpData.x_axis = data.x_axis;
        tmpData.y_axis = data.y_axis;
        var values = [];
        for (
            var residue_idx = 0;
            residue_idx < data.values[0].length;
            residue_idx++
        ) {
            values.push(
                // eslint-disable-next-line no-loop-func
                ...data.values.map((row, yIdx) => {
                    return {
                        x: residue_idx,
                        y: data.y_axis[yIdx],
                        score: row[residue_idx],
                    };
                })
            );
        }
        tmpData.values = values;
        setEffectData(tmpData);
    }, [data]);

    // Draw chart
    useEffect(() => {
        predictor.current = new EffectPredictor(containerRef.current);

        if (effectData) predictor.current.data(effectData).draw();

        return () => {
            if (predictor.current !== null) {
                predictor.current.teardown();
                predictor.current = null;
            }
        };
    }, [effectData]);

    return <div className="w-100" ref={containerRef} />;
}
