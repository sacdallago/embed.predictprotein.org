import ProtvistaFeatureAdapter from "protvista-feature-adapter";
import { getEvidenceFromCodes } from "./tooltipHelpers";

const formatTooltip = feature => {
  return `
    ${
      feature.description
        ? `<h5>Description</h5><p>${feature.description}</p>`
        : ""
    }
    ${
      feature.sequence
        ? `<h5>Sequence</h5><p>${feature.sequence}</p>`
        : ""
    }
    `;
};

// Tiha - here we take the start/end positions of the feature, the color and the description
export const transformData = data => {
  let adaptedData = [];
  if (data.features && data.features.length > 0) {
    adaptedData = data.features.map(feature => {
      return Object.assign(feature, {
        tooltipContent: formatTooltip(feature),
        start: feature.begin,
        color: feature.color
      });
    });
  }
  return adaptedData;
};

class ProtvistaPredictProteinAdapter extends ProtvistaFeatureAdapter {
  parseEntry(data) {
    this._adaptedData = transformData(data);
    return this._adaptedData;
  }
}

export default ProtvistaPredictProteinAdapter;
