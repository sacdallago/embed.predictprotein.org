import {
    scaleLinear,
    scaleSequential,
    scaleBand,
    range,
    interpolateReds,
} from "d3";
import { axisRight, axisLeft, axisBottom } from "d3";
import { select } from "d3";
import { brushX } from "d3";

// Fix importing errors in wrong module

export const d3 = Object.assign(
    {},
    {
        brushX,
        scaleSequential,
        scaleLinear,
        scaleBand,
        range,
        interpolateReds,
        axisRight,
        axisLeft,
        axisBottom,
        select,
    }
);
