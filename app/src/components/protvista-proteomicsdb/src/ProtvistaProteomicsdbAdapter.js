import ProtvistaFeatureAdapter from "protvista-feature-adapter";

const formatTooltip = feature => {
  return `
    ${
      feature.short_name
        ? `<h5>Short Name</h5><p>${feature.short_name}</p>`
        : ""
    }
    ${
      feature.definition
        ? `<h5>Definition</h5><p>${feature.definition}</p>`
        : ""
    }
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
    ${
      feature.accession
        ? `<h5>Accession</h5><p>${feature.accession}</p>`
        : ""
    }
    ${
      feature.residue
        ? `<h5>Residue</h5><p>${feature.residue}</p>`
        : ""
    }
    ${
      feature.q_value
        ? `<h5>Q-Value</h5><p>${Number.parseFloat(feature.q_value).toFixed(6)}</p>`
        : ""
    }
    ${
      feature.e_value
        ? `<h5>E-Value</h5><p>${Number.parseFloat(feature.e_value).toFixed(6)}</p>`
        : ""
    }
    ${
      feature.pep
        ? `<h5>Pep</h5><p>${Number.parseFloat(feature.pep).toFixed(3)}</p>`
        : ""
    }
    ${
      feature.peptide_id
        ? `<h5>Peptid ID</h5><a href=${feature.peptide_id} style="color:#FFF" target="_blank">Link</a>`
        : ""
    }
  `;
};

export const transformData = data => {
  let adaptedData = [];
  if (data && data.length !== 0) {
    adaptedData = data.features.map(feature => {
      return Object.assign(feature, {
        tooltipContent: formatTooltip(feature),
        start: feature.start || feature.begin,
        shape: feature.shape || {
          rlShape: feature.rl_shape,
          tShape: feature.t_shape,
          bShape: feature.b_shape
        }
      });
    });
  }
  return adaptedData;
};

class ProtvistaProteomicsdbAdapter extends ProtvistaFeatureAdapter {
  parseEntry(data) {
    this._adaptedData = transformData(data);
    return this._adaptedData;
  }
}

export default ProtvistaProteomicsdbAdapter;
