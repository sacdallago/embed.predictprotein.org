import FeatureShape from "protvista-track/src/FeatureShape";
import createDomainPath from "./ShapeBuilder";

const symbolSize = 10;

export default class FeatureCustomSvgShape extends FeatureShape {
  getFeatureShape(aaWidth, ftHeight, ftLength, shape) {
    this._ftLength = ftLength;
    this._ftHeight = ftHeight;
    this._ftWidth = aaWidth * ftLength;

    if (shape.rlShape || shape.tShape || shape.bShape) {
      return this._proteomicsdbShapes(shape);
    }

    if (typeof this["_" + shape] !== "function") {
      shape = "rectangle";
    }
    return this["_" + shape]();
  }

  _triangleTop() {
    return this._triangle();
  }

  _triangleBottom() {
    const centerx = symbolSize / 2;
    const m = this._ftWidth / 2;
    const shape =
      "M" + (-centerx + m) + " 0" + "L" + m + " " + symbolSize + "L" + (centerx + m) + " 0 M " + m + " " + symbolSize;
    return this._ftLength !== 1
      ? shape + "L" + m + " 0" + this._getMiddleLine(centerx, this._ftWidth) + "Z"
      : shape + "Z";
  }

  _triangleRight() {
    const centerx = symbolSize / 2;
    const centery = symbolSize / 2;
    const m = this._ftWidth / 2;
    const shape =
      "M" + (-centerx + m) + " 0" + "L" + (m + centerx) + " " + centery + "L" + (-centerx + m) + " " + symbolSize;
    return this._ftLength !== 1
      ? shape + this._getMiddleLine(centerx, this._ftWidth) + "Z"
      : shape + "Z";
  }

  _triangleLeft() {
    const centerx = symbolSize / 2;
    const centery = symbolSize / 2;
    const m = this._ftWidth / 2;
    const shape =
      "M" + (centerx + m) + " 0" + "L" + (m - centerx) + " " + centery + "L" + (centerx + m) + " " + symbolSize;
    return this._ftLength !== 1
      ? shape + this._getMiddleLine(centerx, this._ftWidth) + "Z"
      : shape + "Z";
  }

  _proteomicsdbShapes({
    rlShape,
    tShape,
    bShape,
    scalingFactor = 1.2
  }) {
    const size = this._ftHeight * scalingFactor;
    return createDomainPath(
      rlShape,
      tShape,
      bShape,
      size,
      this._ftWidth
    ) + this._getMiddleLine(size / 2);
  }
}
