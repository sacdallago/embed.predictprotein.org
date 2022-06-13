/*
Modifies the Javascript code in ProteomicsDB (https://www.proteomicsdb.org/proteomicsdb/js/viz/DomainDrawing.js)
that is responsible for creating custom svg shapes for domains and modifications.
Minor changes were neccessary due to different layouts etc.
*/

export const OSHAPE_SIDE_ID = {
  RIGHT: 0,
  LEFT: 1,
  TOP: 2,
  BOTTOM: 3
};

export const OSHAPE_SIDE_TYPE = {
  LINE: 0,
  CURVE_I: 1,
  CURVE_O: 2,
  ONE_EDGE_I: 3,
  ONE_EDGE_O: 4,
  TWO_EDGE_I: 5,
  TWO_EDGE_O: 6
};

const getMargin = (iSize) => {
  return getCircumscribedRadius(iSize) - iSize / 2;
};

const getCircumscribedRadius = (iSize) => {
  return iSize * Math.sqrt(2) / 2;
};

const lineSide = (iSideNum, iSize, iCoord0x, iCoord0y) => {
  var sPath;
  switch (iSideNum) {
    case OSHAPE_SIDE_ID.LEFT:
      sPath = " M" + iCoord0x + " " + (iCoord0y + iSize) + " V" + iCoord0y;
      break;
    case OSHAPE_SIDE_ID.RIGHT:
      sPath = " V" + (iCoord0y + iSize);
      break;
    case OSHAPE_SIDE_ID.TOP:
      sPath = " H" + (iCoord0x + iSize);
      break;
    case OSHAPE_SIDE_ID.BOTTOM:
      sPath = " Z";
      break;
    default:
      throw new RangeError("Error DomainDrawing.lineSide() - sideNum should be between 0 and 3. sideNum=" + iSideNum);
  }
  return sPath;
};

/**
 * Create the SVG curve-path for one side of the shape
 * @param {int} iSideNum the side for which we create the points
 * @param {boolean} bOutward if true curve outward, else curve inward
 * @param {int} iSize the length of each side
 * @param {int} iRadius the radius of the circle used to define the arc
 * @param {int} iCoord0 the coordinate of the top left corner of the square shape (iCoord0 = xMin = yMin)
 * @return {String} the svg path defining one side
 */
const curveSide = (iSideNum, bOutward, iSize, iRadius, iCoord0x, iCoord0y) => {
  var sPath;
  switch (iSideNum) {
    case OSHAPE_SIDE_ID.LEFT:
      sPath = " M" + iCoord0x + " " + (iCoord0y + iSize) + " A" + iRadius + " " + iRadius + " 0 0 " + +bOutward + " " + iCoord0x + " " + iCoord0y;
      break;
    case OSHAPE_SIDE_ID.RIGHT:
      sPath = " A" + iRadius + " " + iRadius + " 0 0 " + +bOutward + " " + (iCoord0x + iSize) + " " + (iCoord0y + iSize);
      break;
    case OSHAPE_SIDE_ID.TOP:
      sPath = " A" + iRadius + " " + iRadius + " 0 0 " + +bOutward + " " + (iCoord0x + iSize) + " " + iCoord0y;
      break;
    case OSHAPE_SIDE_ID.BOTTOM:
      sPath = " A" + iRadius + " " + iRadius + " 0 0 " + +bOutward + " " + iCoord0x + " " + (iCoord0y + iSize);
      break;
    default:
      throw new RangeError("Error DomainDrawing.curveSide() - sideNum should be between 0 and 3. sideNum=" + iSideNum);
  }
  return sPath;
};

/**
 * Create the SVG one-edge path for one side of the shape
 * @param {int} iSideNum the side for which we create the points
 * @param {boolean} bOutward if true curve outward, else curve inward
 * @param {int} iSize the length of each side
 * @param {int} iCoord0 the coordinate of the top left corner of the square shape (iCoord0 = xMin = yMin)
 * @param {int} iMargin the interval between the side and the edge
 * @return {String} the svg path defining one side
 */
const oneEdgeSide = (iSideNum, bOutward, iSize, iCoord0x, iCoord0y, iMargin) => {
  var sPath;
  var iCenterY = iCoord0y + iSize / 2;
  var iCenterX = iCoord0x + iSize / 2;
  var iCoordMaxY = iCoord0y + iSize;
  var iCoordMinEdgeX;
  var iCoordMinEdgeY;
  var iCoordMaxEdgeX;
  var iCoordMaxEdgeY;
  if (bOutward) {
    iCoordMinEdgeX = iCoord0x - iMargin; // TODO CHECK
    iCoordMinEdgeY = iCoord0y - iMargin;
    iCoordMaxEdgeX = iCoord0x + iSize + iMargin;
    iCoordMaxEdgeY = iCoord0y + iSize + iMargin;
  } else {
    iCoordMinEdgeX = iCoord0x + iMargin; // TODO CHECK
    iCoordMinEdgeY = iCoord0y + iMargin;
    iCoordMaxEdgeX = iCoord0x + iSize - iMargin;
    iCoordMaxEdgeY = iCoord0y + iSize - iMargin;
  }

  switch (iSideNum) {
    case OSHAPE_SIDE_ID.LEFT:
      sPath = " M" + iCoord0x + " " + iCoordMaxY + " L" + iCoordMinEdgeX + " " + iCenterY + " L" + iCoord0x + " " + iCoord0y;
      break;
    case OSHAPE_SIDE_ID.RIGHT:
      sPath = " L" + iCoordMaxEdgeX + " " + iCenterY + " L" + (iCoord0x + iSize) + " " + iCoordMaxY;
      break;
    case OSHAPE_SIDE_ID.TOP:
      sPath = " L" + iCenterX + " " + iCoordMinEdgeY + " L" + (iCoord0x + iSize) + " " + iCoord0y;
      break;
    case OSHAPE_SIDE_ID.BOTTOM:
      sPath = " L" + iCenterX + " " + iCoordMaxEdgeY + " Z";
      break;
    default:
      throw new RangeError("Error DomainDrawing.oneEdgeSide() - sideNum should be between 0 and 3. sideNum=" + iSideNum);
  }
  return sPath;
};

/**
 * Create the SVG two-edges path for one side of the shape
 * @param {int} iSideNum the side for which we create the points
 * @param {boolean} bOutward if true curve outward, else curve inward
 * @param {int} iSize the length of each side
 * @param {int} iCoord0 the coordinate of the top left corner of the square shape (iCoord0 = xMin = yMin)
 * @param {int} iMargin the interval between the side and the edges
 * @returns {String}the svg path defining one side
 */
const twoEdgeSide = (iSideNum, bOutward, iSize, iCoord0x, iCoord0y, iMargin) => {
  var sPath;
  var iCoordMaxX = iCoord0x + iSize;
  var iCoordMaxY = iCoord0y + iSize;
  var iCoordMinEdgeX;
  var iCoordMinEdgeY;
  var iCoordMaxEdgeX;
  var iCoordMaxEdgeY;
  if (bOutward) {
    iCoordMinEdgeX = iCoord0x - iMargin;
    iCoordMinEdgeY = iCoord0y - iMargin;
    iCoordMaxEdgeX = iCoordMaxX + iMargin;
    iCoordMaxEdgeY = iCoordMaxY + iMargin;
  } else {
    iCoordMinEdgeX = iCoord0x + iMargin;
    iCoordMinEdgeY = iCoord0y + iMargin;
    iCoordMaxEdgeX = iCoordMaxX - iMargin;
    iCoordMaxEdgeY = iCoordMaxY - iMargin;
  }

  var iCoordEdge1X = iCoord0x + iSize / 4;
  var iCoordEdge1Y = iCoord0y + iSize / 4;
  var iCoordEdge2X = iCoordMaxX - iSize / 4;
  var iCoordEdge2Y = iCoordMaxY - iSize / 4;

  switch (iSideNum) {
    case OSHAPE_SIDE_ID.LEFT:
      sPath = " M" + iCoord0x + " " + iCoordMaxY + " L" + iCoordMinEdgeX + " " + iCoordEdge2Y + " V" + iCoordEdge1Y + " L" + iCoord0x + " " + iCoord0y;
      break;
    case OSHAPE_SIDE_ID.RIGHT:
      sPath = " L" + iCoordMaxEdgeX + " " + iCoordEdge1Y + " V" + iCoordEdge2Y + " L" + iCoordMaxX + " " + iCoordMaxY;
      break;
    case OSHAPE_SIDE_ID.TOP:
      sPath = " L" + iCoordEdge1X + " " + iCoordMinEdgeY + " H" + iCoordEdge2X + " L" + iCoordMaxX + " " + iCoord0y;
      break;
    case OSHAPE_SIDE_ID.BOTTOM:
      sPath = " L" + iCoordEdge2X + " " + iCoordMaxEdgeY + " H" + iCoordEdge1X + " Z";
      break;
    default:
      throw new RangeError("Error DomainDrawing.twoEdgeSide() - sideNum should be between 0 and 3. sideNum=" + iSideNum);
  }
  return sPath;
};

const createPoints = (iSideNum, iShapeNum, iSize, ftWidth) => {
  var iRadius = getCircumscribedRadius(iSize);
  var iMargin = getMargin(iSize);
  var iCoord0x = ftWidth / 2;
  var iCoord0y = 0;
  var sPath;
  switch (iShapeNum) {
    case OSHAPE_SIDE_TYPE.LINE:
      sPath = lineSide(iSideNum, iSize, iCoord0x, iCoord0y);
      break;
    case OSHAPE_SIDE_TYPE.CURVE_I:
      sPath = curveSide(iSideNum, false, iSize, iRadius, iCoord0x, iCoord0y);
      break;
    case OSHAPE_SIDE_TYPE.CURVE_O:
      sPath = curveSide(iSideNum, true, iSize, iRadius, iCoord0x, iCoord0y);
      break;
    case OSHAPE_SIDE_TYPE.ONE_EDGE_I:
      sPath = oneEdgeSide(iSideNum, false, iSize, iCoord0x, iCoord0y, iMargin);
      break;
    case OSHAPE_SIDE_TYPE.ONE_EDGE_O:
      sPath = oneEdgeSide(iSideNum, true, iSize, iCoord0x, iCoord0y, iMargin);
      break;
    case OSHAPE_SIDE_TYPE.TWO_EDGE_I:
      sPath = twoEdgeSide(iSideNum, false, iSize, iCoord0x, iCoord0y, iMargin);
      break;
    case OSHAPE_SIDE_TYPE.TWO_EDGE_O:
      sPath = twoEdgeSide(iSideNum, true, iSize, iCoord0x, iCoord0y, iMargin);
      break;
    default:
      throw new RangeError("Error DomainDrawing.createPoints() - shapeNum should be between 0 and 6. numShape=" + iShapeNum);
  }
  return sPath;
};

const createDomainPath = function(iShapeRL, iShapeT, iShapeB, iSize, ftWidth) {
  var sPointsR = createPoints(OSHAPE_SIDE_ID.RIGHT, iShapeRL, iSize, ftWidth);
  var sPointsT = createPoints(OSHAPE_SIDE_ID.TOP, iShapeT, iSize, ftWidth);
  var sPointsL = createPoints(OSHAPE_SIDE_ID.LEFT, iShapeRL, iSize, ftWidth);
  var sPointsB = createPoints(OSHAPE_SIDE_ID.BOTTOM, iShapeB, iSize, ftWidth);
  return sPointsL.concat(sPointsT, sPointsR, sPointsB);
};

export default createDomainPath;
