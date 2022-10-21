import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import { useFeatures } from "../../hooks/useFeatures";
import { EffectPredictor } from "../../lib/effect";

export default function VariantEffectPrediction() {
    const { isSuccess, isLoading, isError, data } = useFeatures();

    if (isLoading) return <VariantEffectPredictionLoading />;
    if (isError) return <VariantEffectPredictionError />;
    if (isSuccess)
        return <VariantEffectPredictionLoaded data={data.predictedVariation} />;
}
function VariantEffectPredictionLoading() {}
function VariantEffectPredictionError() {}

function VariantEffectPredictionLoaded({ data }) {
    const containerRef = useRef(null);
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
    useLayoutEffect(() => {
        const data_map = new EffectPredictor(containerRef.current);

        if (effectData) data_map.draw(effectData);

        return () => data_map.teardown();
    }, [effectData, containerRef]);

    return <div className="w-100" ref={containerRef} />;
}
