import React from "react";
import PropTypes from "prop-types";
import { MDBTypography } from "mdb-react-ui-kit";
import { proteinStatus } from "../stores/JobParameters";
import { resultStatus } from "../stores/JobResults";
import SequenceHighlighter from "./SequenceHighlither";
import { proteinColorSchemes } from "../utils/Graphics";
import storeComponentWrapper from "../stores/jobDispatcher";
import FeatureGrabber from "./FeatureGrabber";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { Spinner, Card } from "react-bootstrap";
import StructurePrediction from "./StructurePrediction";

import {
  Tabs,
  Tab,
  Table,
  ListGroup,
  Accordion,
  NavLink,
  Alert,
} from "react-bootstrap";
import FeatureViewer from "./FeatureViewer";

// subcell location images
import nucleus from "../assets/nucleus.PNG";
import mitochondrion from "../assets/mitochondrion.PNG";
import cytoplasm from "../assets/cytoplasm.PNG";
import plasmaMembrane from "../assets/plasmaMembrane.PNG";
import endoplasmicReticulum from "../assets/endoplasmicReticulum.PNG";
import golgiApparatus from "../assets/golgiApparatus.PNG";
import vacuole from "../assets/vacuole.PNG";
import peroxisome from "../assets/peroxisome.PNG";
import plastid from "../assets/plastid.PNG";
import secreted from "../assets/secreted.PNG";

import { Container } from "react-bootstrap";
import VariationPrediction from "./VariationPrediction";
import { Link } from "react-router-dom";
import { Button } from "bootstrap";

const locations_mapping = {
  Cytoplasm: cytoplasm,
  "Cell-Membrane": plasmaMembrane,
  "Endoplasmic reticulum'": endoplasmicReticulum,
  "Golgi - Apparatus": golgiApparatus,
  "Lysosome / Vacuole": vacuole,
  Mitochondrion: mitochondrion,
  Nucleus: nucleus,
  Peroxisome: peroxisome,
  Plastid: plastid,
  "Extra - cellular": secreted,
};

const placeholder = {
  sequence:
    "+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++",
  predictedSubcellularLocalizations: " ",
  predictedMembrane: " ",

  predictedBPO: {},
  predictedBPOGraphDataString: "",
  predictedCCO: {},
  predictedCCOGraphDataString: "",
  predictedMFO: {},
  predictedMFOGraphDataString: "",

  predictedDSSP3: " ",
  predictedDSSP8: " ",
  predictedDisorder: " ",
};

const pointMutationData = {
  values: [
    [
      1, 92, 17, 40, 44, 89, 82, 27, 47, 16, 14, 98, 54, 36, 34, 67, 12, 28, 34,
      84, 27, 86, 9, 81, 85, 20, 93, 72, 19, 1, 47, 99, 62, 95, 35, 7, 59, 68,
      7, 24, 93, 2, 27, 61, 42, 60, 96, 57, 17, 30, 1, 14, 12, 9, 13, 53, 65,
      29, 32, 78, 62, 39, 9, 48, 17, 53, 86, 10, 46, 78, 63, 97, 45, 7, 52, 25,
      16, 33, 91, 16, 30, 21, 67, 4, 60, 28, 29, 67, 79, 33, 83, 51, 1, 7, 4,
      33, 33, 23, 97, 8,
    ],
    [
      18, 70, 24, 34, 43, 91, 34, 54, 75, 19, 47, 43, 84, 43, 17, 9, 21, 36, 6,
      6, 13, 51, 72, 45, 9, 81, 76, 78, 24, 70, 64, 7, 49, 11, 26, 69, 21, 73,
      33, 50, 19, 47, 55, 72, 76, 52, 83, 20, 83, 98, 91, 4, 33, 78, 47, 18, 87,
      12, 42, 74, 80, 40, 10, 16, 64, 14, 5, 54, 24, 47, 54, 61, 62, 96, 29, 43,
      13, 94, 95, 89, 80, 85, 48, 42, 67, 49, 91, 28, 37, 25, 37, 98, 59, 50, 1,
      92, 76, 37, 92, 89,
    ],
    [
      40, 44, 46, 60, 55, 24, 10, 32, 65, 5, 86, 65, 51, 12, 38, 34, 99, 51, 33,
      99, 92, 79, 7, 19, 56, 1, 16, 60, 3, 20, 56, 99, 14, 63, 87, 44, 22, 60,
      13, 88, 10, 65, 22, 24, 85, 17, 20, 93, 89, 58, 14, 18, 98, 31, 79, 95,
      67, 46, 9, 10, 11, 19, 1, 36, 49, 40, 26, 61, 70, 3, 47, 67, 69, 11, 74,
      40, 13, 7, 84, 69, 25, 3, 88, 51, 19, 39, 5, 64, 11, 61, 86, 90, 20, 40,
      1, 56, 78, 66, 5, 11,
    ],
    [
      83, 8, 45, 67, 1, 96, 63, 81, 83, 50, 44, 15, 82, 17, 23, 20, 92, 53, 32,
      91, 65, 25, 63, 68, 20, 91, 50, 24, 62, 87, 92, 5, 43, 46, 34, 11, 34, 79,
      85, 27, 5, 24, 33, 10, 19, 27, 36, 35, 68, 18, 79, 41, 72, 26, 32, 99, 88,
      66, 6, 52, 55, 52, 9, 76, 13, 11, 75, 1, 87, 37, 78, 26, 51, 19, 18, 95,
      87, 36, 69, 70, 78, 74, 82, 41, 91, 41, 81, 81, 92, 50, 34, 44, 72, 82,
      14, 20, 27, 36, 85, 42,
    ],
    [
      93, 96, 96, 61, 36, 41, 5, 11, 89, 50, 94, 61, 46, 36, 2, 30, 80, 49, 29,
      99, 75, 18, 34, 49, 95, 74, 74, 62, 13, 29, 41, 71, 98, 77, 37, 24, 52, 4,
      53, 60, 44, 39, 62, 65, 80, 67, 21, 2, 58, 88, 70, 90, 7, 29, 35, 38, 16,
      53, 25, 39, 46, 52, 40, 41, 6, 17, 74, 81, 16, 99, 41, 60, 84, 58, 86, 81,
      71, 80, 44, 76, 85, 29, 82, 0, 56, 48, 33, 9, 78, 46, 55, 27, 65, 77, 47,
      79, 96, 59, 81, 90,
    ],
    [
      78, 22, 8, 40, 38, 24, 76, 25, 3, 27, 43, 83, 36, 18, 24, 80, 29, 29, 4,
      85, 93, 22, 31, 82, 17, 64, 98, 54, 99, 67, 47, 53, 11, 77, 32, 59, 6, 94,
      72, 10, 20, 56, 34, 76, 5, 35, 74, 32, 3, 65, 31, 37, 62, 67, 64, 9, 3, 0,
      37, 13, 38, 65, 57, 47, 78, 75, 94, 8, 12, 15, 98, 70, 25, 34, 84, 48, 42,
      29, 0, 49, 84, 0, 13, 24, 30, 50, 41, 2, 98, 86, 40, 11, 74, 29, 92, 63,
      25, 7, 64, 27,
    ],
    [
      66, 86, 64, 26, 5, 95, 77, 38, 78, 25, 6, 59, 73, 41, 97, 86, 4, 13, 20,
      23, 5, 54, 0, 12, 59, 89, 89, 59, 58, 90, 37, 16, 19, 62, 84, 82, 56, 8,
      86, 62, 15, 40, 57, 98, 69, 57, 24, 25, 23, 64, 25, 75, 45, 48, 92, 74,
      99, 65, 50, 81, 30, 91, 24, 18, 73, 7, 96, 68, 25, 28, 18, 78, 68, 55, 64,
      17, 5, 53, 74, 62, 24, 11, 47, 50, 7, 34, 13, 15, 7, 34, 69, 10, 31, 59,
      37, 66, 61, 13, 61, 50,
    ],
    [
      77, 96, 32, 58, 73, 86, 85, 67, 88, 68, 62, 64, 14, 44, 64, 94, 85, 59,
      55, 98, 58, 54, 74, 19, 61, 8, 71, 64, 59, 84, 84, 28, 34, 65, 28, 17, 81,
      43, 52, 58, 47, 74, 71, 46, 36, 98, 51, 68, 99, 23, 17, 40, 6, 57, 89, 33,
      4, 47, 28, 70, 74, 96, 27, 55, 55, 11, 32, 92, 89, 40, 45, 64, 24, 43, 32,
      79, 42, 99, 42, 91, 24, 86, 46, 32, 69, 95, 80, 15, 69, 79, 23, 93, 34,
      26, 81, 40, 2, 79, 90, 9,
    ],
    [
      11, 58, 92, 88, 54, 87, 49, 23, 43, 70, 19, 72, 56, 29, 30, 9, 29, 74, 62,
      24, 28, 0, 75, 69, 53, 65, 43, 67, 82, 4, 64, 45, 99, 1, 85, 56, 46, 54,
      81, 89, 89, 47, 60, 44, 29, 80, 49, 99, 95, 70, 58, 72, 7, 64, 31, 3, 29,
      63, 72, 92, 77, 78, 48, 91, 0, 82, 45, 80, 66, 12, 58, 26, 19, 42, 66, 38,
      46, 76, 16, 44, 94, 61, 84, 9, 80, 67, 50, 15, 27, 3, 0, 44, 13, 91, 0,
      35, 39, 66, 28, 59,
    ],
    [
      4, 30, 10, 29, 83, 37, 62, 56, 14, 75, 25, 84, 59, 58, 46, 51, 76, 70, 29,
      83, 3, 75, 45, 73, 5, 92, 48, 5, 25, 71, 74, 43, 90, 73, 70, 59, 16, 89,
      0, 26, 37, 98, 0, 53, 16, 9, 30, 42, 92, 81, 62, 48, 29, 11, 50, 24, 50,
      89, 24, 9, 48, 12, 76, 11, 74, 97, 27, 1, 56, 30, 62, 80, 82, 65, 16, 87,
      68, 39, 24, 15, 32, 74, 4, 84, 65, 21, 20, 82, 42, 10, 93, 8, 63, 24, 20,
      46, 52, 4, 73, 99,
    ],
    [
      27, 0, 59, 24, 50, 93, 33, 55, 24, 82, 9, 36, 1, 72, 22, 7, 62, 4, 77, 39,
      96, 58, 18, 15, 59, 87, 42, 99, 95, 28, 50, 76, 65, 61, 27, 28, 87, 55,
      45, 66, 89, 98, 81, 53, 98, 96, 15, 85, 52, 14, 79, 78, 27, 45, 20, 69, 9,
      67, 43, 40, 74, 3, 92, 78, 0, 57, 77, 42, 75, 19, 36, 27, 60, 11, 58, 19,
      66, 36, 10, 97, 81, 9, 37, 72, 80, 78, 58, 75, 44, 68, 42, 52, 47, 65, 96,
      66, 83, 70, 37, 44,
    ],
    [
      4, 34, 26, 26, 13, 3, 30, 44, 60, 53, 2, 84, 8, 16, 45, 31, 67, 31, 26,
      78, 42, 34, 79, 2, 43, 96, 54, 81, 67, 16, 85, 12, 9, 42, 76, 49, 14, 88,
      29, 82, 58, 12, 60, 89, 33, 68, 84, 68, 87, 16, 49, 24, 84, 63, 49, 40, 1,
      42, 52, 73, 51, 39, 94, 97, 79, 57, 50, 1, 59, 59, 15, 37, 35, 98, 69, 87,
      22, 58, 68, 91, 57, 64, 60, 95, 93, 66, 4, 24, 18, 52, 58, 45, 29, 79, 96,
      98, 85, 69, 2, 21,
    ],
    [
      28, 67, 43, 44, 6, 25, 53, 19, 64, 36, 59, 44, 29, 45, 5, 34, 47, 70, 51,
      24, 45, 65, 33, 0, 19, 33, 46, 84, 65, 70, 82, 87, 82, 38, 16, 98, 44, 75,
      75, 17, 44, 21, 72, 81, 24, 55, 41, 34, 9, 62, 21, 44, 57, 56, 94, 87, 31,
      69, 17, 16, 64, 98, 14, 29, 4, 30, 26, 19, 87, 5, 30, 31, 86, 82, 65, 9,
      23, 20, 89, 72, 53, 94, 93, 24, 98, 16, 1, 75, 85, 60, 71, 39, 90, 22, 26,
      30, 16, 51, 39, 49,
    ],
    [
      23, 25, 11, 45, 85, 68, 6, 1, 22, 5, 85, 9, 26, 23, 87, 0, 68, 8, 92, 58,
      37, 99, 15, 89, 8, 78, 0, 60, 67, 53, 94, 46, 95, 56, 99, 6, 26, 90, 21,
      87, 60, 12, 74, 50, 87, 44, 33, 83, 95, 24, 90, 73, 63, 80, 20, 74, 3, 14,
      17, 92, 21, 56, 3, 83, 76, 32, 20, 20, 45, 43, 97, 86, 24, 32, 49, 77, 88,
      2, 56, 65, 38, 1, 97, 63, 8, 74, 5, 73, 61, 58, 34, 82, 99, 97, 77, 72,
      12, 72, 11, 3,
    ],
    [
      44, 18, 24, 94, 50, 41, 94, 94, 88, 99, 1, 81, 40, 80, 47, 27, 29, 38, 24,
      39, 39, 0, 49, 45, 67, 98, 49, 27, 4, 62, 98, 97, 3, 96, 35, 91, 84, 41,
      64, 22, 18, 62, 3, 49, 15, 9, 27, 10, 81, 9, 72, 80, 49, 55, 19, 85, 7,
      11, 23, 72, 44, 38, 57, 31, 58, 76, 55, 35, 57, 37, 45, 70, 4, 57, 80, 82,
      98, 2, 87, 84, 26, 56, 62, 6, 45, 91, 33, 39, 62, 86, 81, 55, 98, 29, 26,
      98, 58, 19, 94, 51,
    ],
    [
      21, 18, 53, 77, 40, 25, 40, 44, 86, 60, 32, 13, 77, 73, 35, 64, 24, 73,
      16, 40, 45, 3, 69, 40, 82, 53, 4, 34, 25, 72, 60, 15, 3, 62, 91, 38, 0,
      20, 6, 34, 12, 31, 10, 49, 86, 17, 95, 7, 43, 84, 63, 3, 72, 73, 79, 53,
      82, 88, 12, 81, 69, 4, 51, 10, 85, 57, 68, 66, 64, 67, 87, 20, 3, 92, 49,
      26, 60, 85, 9, 84, 40, 85, 54, 26, 68, 39, 59, 1, 56, 51, 44, 77, 72, 64,
      80, 61, 51, 29, 43, 98,
    ],
    [
      85, 64, 82, 90, 16, 67, 11, 75, 45, 80, 69, 41, 45, 5, 19, 9, 82, 95, 64,
      47, 79, 34, 94, 56, 17, 87, 4, 51, 15, 42, 69, 42, 95, 95, 88, 95, 24, 84,
      66, 39, 85, 99, 18, 41, 8, 13, 23, 90, 60, 84, 84, 33, 33, 89, 40, 39, 68,
      7, 69, 17, 93, 2, 93, 5, 41, 75, 82, 87, 11, 12, 46, 50, 24, 36, 18, 6,
      33, 88, 90, 45, 77, 68, 50, 33, 57, 13, 27, 37, 42, 50, 9, 79, 13, 99, 82,
      82, 80, 95, 77, 36,
    ],
    [
      99, 87, 13, 58, 83, 88, 43, 93, 60, 63, 52, 15, 73, 67, 16, 5, 62, 99, 70,
      74, 68, 91, 39, 22, 21, 51, 10, 59, 77, 57, 83, 8, 12, 16, 40, 70, 27, 25,
      48, 55, 0, 93, 79, 7, 68, 52, 59, 45, 8, 95, 45, 96, 86, 13, 52, 92, 50,
      96, 66, 65, 21, 50, 74, 73, 83, 33, 31, 99, 50, 45, 29, 67, 22, 35, 68,
      75, 48, 73, 85, 89, 88, 22, 20, 73, 54, 87, 50, 92, 87, 89, 82, 57, 26,
      65, 1, 94, 34, 22, 77, 1,
    ],
    [
      34, 45, 23, 40, 19, 58, 89, 43, 21, 49, 94, 8, 8, 29, 42, 45, 46, 63, 77,
      86, 34, 89, 96, 99, 24, 26, 50, 32, 49, 90, 96, 50, 45, 77, 27, 85, 39,
      25, 83, 62, 27, 13, 57, 31, 53, 97, 62, 54, 24, 94, 60, 58, 35, 85, 55, 9,
      78, 21, 75, 8, 27, 20, 82, 62, 12, 12, 34, 2, 49, 32, 61, 78, 37, 22, 1,
      33, 11, 42, 8, 28, 20, 54, 96, 99, 82, 39, 63, 2, 43, 99, 60, 59, 2, 65,
      11, 78, 66, 21, 61, 52,
    ],
    [
      28, 43, 26, 95, 17, 46, 10, 24, 8, 75, 1, 74, 7, 88, 86, 70, 99, 70, 74,
      97, 0, 29, 1, 44, 16, 34, 79, 86, 5, 27, 86, 78, 37, 75, 49, 91, 39, 12,
      11, 87, 24, 78, 42, 52, 17, 96, 90, 42, 55, 32, 1, 19, 64, 96, 68, 79, 73,
      2, 34, 61, 61, 42, 86, 67, 2, 54, 49, 0, 0, 60, 72, 48, 15, 8, 61, 28, 86,
      73, 29, 12, 65, 61, 12, 58, 46, 50, 75, 46, 8, 59, 40, 83, 86, 75, 74, 96,
      37, 13, 31, 48,
    ],
  ],
  y_axis: [
    "C",
    "N",
    "B",
    "M",
    "N",
    "H",
    "U",
    "H",
    "T",
    "S",
    "H",
    "A",
    "E",
    "U",
    "M",
    "C",
    "T",
    "T",
    "P",
    "R",
  ],
  x_axis: [
    "O",
    "C",
    "M",
    "Q",
    "J",
    "A",
    "O",
    "M",
    "S",
    "E",
    "L",
    "R",
    "A",
    "K",
    "C",
    "A",
    "M",
    "K",
    "J",
    "U",
    "G",
    "J",
    "A",
    "U",
    "M",
    "C",
    "A",
    "I",
    "L",
    "M",
    "D",
    "Q",
    "K",
    "S",
    "Q",
    "Q",
    "T",
    "A",
    "S",
    "C",
    "K",
    "S",
    "N",
    "R",
    "D",
    "Q",
    "B",
    "M",
    "U",
    "K",
    "I",
    "O",
    "J",
    "G",
    "U",
    "B",
    "I",
    "E",
    "B",
    "C",
    "K",
    "O",
    "G",
    "P",
    "L",
    "G",
    "I",
    "G",
    "E",
    "B",
    "R",
    "J",
    "E",
    "B",
    "M",
    "E",
    "D",
    "P",
    "U",
    "H",
    "A",
    "S",
    "R",
    "C",
    "Q",
    "R",
    "K",
    "H",
    "H",
    "G",
    "P",
    "R",
    "S",
    "K",
    "B",
    "D",
    "D",
    "R",
    "A",
    "B",
  ],
};
const structurePredictionData = require("../colabfold_structure_response.json");

class Features extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      proteinStatus:
        this.props.jobParameters.proteinStatus || proteinStatus.NULL,
      embedder: this.props.jobParameters.embedder || "seqvec",
      sequence: null,
      features: null,
      loading: null,
    };
  }

  setFeatures = (embedder, results) => {
    // Base off of ProtT5
    let features = { ...results["prottrans_t5_xl_u50"] };

    return this.setState({
      loading: results["prottrans_t5_xl_u50"].status !== resultStatus.DONE,
      features: features,
    });
  };

  componentWillReceiveProps(nextProps) {
    let jobParameters = nextProps.jobParameters;
    let jobResults = nextProps.jobResults;

    if (jobParameters.proteinStatus !== proteinStatus.NULL) {
      this.setState(
        {
          proteinStatus: jobParameters.proteinStatus,
          sequence: jobParameters.protein && jobParameters.protein.sequence,
          embedder: jobParameters.embedder,
          loading: true,
        },
        () => {
          this.setFeatures(jobParameters.embedder, jobResults);
        }
      );
    }
  }

  redirectFunction = () => {
    console.log("redirecting");
    const navigate = useNavigate();
    navigate("/printpage", { state: { name: "Xyz" } });
  };

  render() {
    let features =
      this.state.loading || this.state.features === null
        ? placeholder
        : this.state.features;

    return (
      <div>
        {console.log(this.state)}
        {this.state.loading !== null &&
          this.state.proteinStatus != 0 &&
          "predictedBPOGraphDataString" in features && (
            <div>
              <Container style={{ textAlign: "center" }}>
                <Card>
                  <Card.Body>
                    <span>
                      <h5>Getting the results...</h5>
                    </span>
                    <Spinner
                      animation="border"
                      variant="primary"
                      role="status"
                    ></Spinner>
                  </Card.Body>
                </Card>
                <div className="row mb-5"></div>
              </Container>
            </div>
          )}
        <Container>
        {this.state.loading !== null && (
              <div> </div>
              /*
            <div className="col-lg-12">
              <Container style={{ textAlign: "center" }}>
                <Alert key="secondary" variant="secondary">
                  <Link
                    to={{
                      pathname: `/printpage/${this.state.sequence}`,
                      state: { foo: 'bar'}
                    }}
                    reloadDocument={false}
                    state={{ test: "test" }}
                    onClick={() => useNavigate(`/printpage/${this.state.sequence}`)}
                  >
                    Press here to get the printed output.
                  </Link>
                 
                </Alert>
              </Container>
              <div className="row mb-5"></div>
            </div>
            */
            )}
 
          <div>
            
          </div>
          {this.state.loading !== null && this.state.proteinStatus != 0 && (
            <div className="row mb-5">
              <div className="col-lg-12">
                <MDBTypography tag="h4">Protein-Level Features</MDBTypography>
              </div>

              <Tabs defaultActiveKey="ml" className="mb-3">
                <Tab eventKey="ml" title="Subcellular Location">
                  <div class="row">
                    <div className="col-md-7">
                      <img
                        src={
                          locations_mapping[
                            features.predictedSubcellularLocalizations
                          ]
                        }
                        alt="Subcell Location"
                        height={390}
                      />
                    </div>
                    <div className="col-md-5">
                      <ListGroup variant="flush">
                        <ListGroup.Item>
                          Subcellular location:{" "}
                          <b> {features.predictedSubcellularLocalizations} </b>
                        </ListGroup.Item>
                        <ListGroup.Item>
                          Membrane bound: <b>{features.predictedMembrane}</b>
                        </ListGroup.Item>
                      </ListGroup>
                    </div>
                  </div>
                  <div className="row mb-5"> </div>
                  <Accordion>
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>Help</Accordion.Header>
                      <Accordion.Body>
                        <br />
                        <MDBTypography variant={"body2"}>
                          <h5>What is predicted?</h5>
                        </MDBTypography>
                        <br />
                        <MDBTypography>
                          The output of goPredSim is a list of Gene Ontology
                          (GO) terms. GO thrives to capture the complexity of
                          protein function and standardize the vocabulary used
                          to describe those in a human- and machine-readable
                          manner. GO separates different aspects of function
                          into three hierarchies: MFO (Molecular Function
                          Ontology), BPO (biological process ontology), and CCO
                          (cellular component(s) or subcellular localization(s)
                          in which the protein acts). Each ontology is a rooted
                          graph in which each node represents a GO term and each
                          link a functional relationship. Thus, the prediction
                          of our method can be seen as three subgraphs of the
                          full ontologies. These three subgraphs are displayed
                          below the tabular result. Often, the tabular result
                          only contain very specific functional terms not
                          reflecting the more general role of the protein that
                          can be inferred by going to the root of the ontology.
                          The graphical results show such terms (predicted:
                          yellow boxes, inferred: white boxes).
                        </MDBTypography>

                        <br />
                    <MDBTypography variant={"body2"}>
                      <h5>Cite</h5>
                    </MDBTypography>
                    <br />
                    <MDBTypography>
                    Light-Attention:{" "}
                            {
                              <a
                                href={
                                  "https://academic.oup.com/bioinformaticsadvances/article/1/1/vbab035/6432029"
                                }
                                target={"_blank"}
                                ref={"author"}
                              >
                                 https://academic.oup.com/bioinformaticsadvances/article/1/1/vbab035/6432029
                              </a>
                            }
                    </MDBTypography>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </Tab>
                <Tab eventKey="es" title="Gene Ontology Terms">
                  <div class="row">
                    <div className="col-md-6">
                      {Object.keys(features.predictedBPO).length > 0 &&
                        Object.keys(features.predictedCCO).length > 0 &&
                        Object.keys(features.predictedMFO).length > 0 && (
                          <Table striped bordered hover>
                            <thead>
                              <tr>
                                <th colSpan="3">Biological process (BPO)</th>
                              </tr>
                              <tr>
                                <th>Reference Seq.</th>
                                <th>GO Name</th>
                                <th>Reliability Index</th>
                              </tr>
                            </thead>
                            <tbody>
                              {features.predictedBPO.map((value, index) => {
                                return (
                                  <tr>
                                    <td>
                                      <a
                                        href={
                                          "https://www.uniprot.org/uniprot/" +
                                          features.predictedBPO[index]
                                            ?.identifier
                                        }
                                      >
                                        <div>
                                          {
                                            features.predictedBPO[index]
                                              ?.identifier
                                          }
                                        </div>
                                      </a>
                                    </td>

                                    <td>
                                      <a
                                        href={
                                          "http://amigo.geneontology.org/amigo/term/" +
                                          features.predictedBPO[index]?.GO_Term
                                        }
                                      >
                                        <div>
                                          {
                                            features.predictedBPO[index]
                                              ?.GO_Name
                                          }
                                        </div>
                                      </a>
                                    </td>

                                    <td>
                                      {features.predictedBPO[index]?.RI.toFixed(
                                        2
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </Table>
                        )}
                    </div>
                    <div className="col-md-6">
                      {Object.keys(features.predictedBPO).length > 0 &&
                        Object.keys(features.predictedCCO).length > 0 &&
                        Object.keys(features.predictedMFO).length > 0 && (
                          <Table striped bordered hover>
                            <thead>
                              <tr>
                                <th colSpan="3">Molecular function (MFO)</th>
                              </tr>
                              <tr>
                                <th>Reference Seq.</th>
                                <th>GO Name</th>
                                <th>Reliability Index</th>
                              </tr>
                            </thead>
                            <tbody>
                              {features.predictedMFO.map((value, index) => {
                                return (
                                  <tr>
                                    <td>
                                      <a
                                        href={
                                          "https://www.uniprot.org/uniprot/" +
                                          features.predictedMFO[index]
                                            ?.identifier
                                        }
                                      >
                                        <div>
                                          {
                                            features.predictedMFO[index]
                                              ?.identifier
                                          }
                                        </div>
                                      </a>
                                    </td>

                                    <td>
                                      <a
                                        href={
                                          "http://amigo.geneontology.org/amigo/term/" +
                                          features.predictedMFO[index]?.GO_Term
                                        }
                                      >
                                        <div>
                                          {
                                            features.predictedMFO[index]
                                              ?.GO_Name
                                          }
                                        </div>
                                      </a>
                                    </td>

                                    <td>
                                      {features.predictedMFO[index]?.RI.toFixed(
                                        2
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </Table>
                        )}
                    </div>
                  </div>
                  <div class="center">
                    <div className="row mb-5"></div>
                    {Object.keys(features.predictedBPO).length > 0 &&
                      Object.keys(features.predictedCCO).length > 0 &&
                      Object.keys(features.predictedMFO).length > 0 && (
                        <Table striped bordered hover>
                          <thead>
                            <tr>
                              <th colSpan="3">Cellular Component (CCO)</th>
                            </tr>
                            <tr>
                              <th>Reference Seq.</th>
                              <th>GO Name</th>
                              <th>Reliability Index</th>
                            </tr>
                          </thead>
                          <tbody>
                            {features.predictedCCO.map((value, index) => {
                              return (
                                <tr>
                                  <td>
                                    <a
                                      href={
                                        "https://www.uniprot.org/uniprot/" +
                                        features.predictedCCO[index]?.identifier
                                      }
                                    >
                                      <div>
                                        {
                                          features.predictedCCO[index]
                                            ?.identifier
                                        }
                                      </div>
                                    </a>
                                  </td>

                                  <td>
                                    <a
                                      href={
                                        "http://amigo.geneontology.org/amigo/term/" +
                                        features.predictedCCO[index]?.GO_Term
                                      }
                                    >
                                      <div>
                                        {features.predictedCCO[index]?.GO_Name}
                                      </div>
                                    </a>
                                  </td>

                                  <td>
                                    {features.predictedCCO[index]?.RI.toFixed(
                                      2
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </Table>
                      )}
                  </div>
                  <div className="row mb-5"> </div>
                  <div className="row mb-5">
                    <Accordion>
                      <Accordion.Item eventKey="0">
                        <Accordion.Header>Help</Accordion.Header>
                        <Accordion.Body>
                          <br />
                          <MDBTypography variant={"body2"}>
                            <h5>What is predicted?</h5>
                          </MDBTypography>
                          <br />
                          <MDBTypography>
                            The output of goPredSim is a list of Gene Ontology
                            (GO) terms. GO thrives to capture the complexity of
                            protein function and standardize the vocabulary used
                            to describe those in a human- and machine-readable
                            manner. GO separates different aspects of function
                            into three hierarchies: MFO (Molecular Function
                            Ontology), BPO (biological process ontology), and
                            CCO (cellular component(s) or subcellular
                            localization(s) in which the protein acts). Each
                            ontology is a rooted graph in which each node
                            represents a GO term and each link a functional
                            relationship. Thus, the prediction of our method can
                            be seen as three subgraphs of the full ontologies.
                            These three subgraphs are displayed below the
                            tabular result. Often, the tabular result only
                            contain very specific functional terms not
                            reflecting the more general role of the protein that
                            can be inferred by going to the root of the
                            ontology. The graphical results show such terms
                            (predicted: yellow boxes, inferred: white boxes).
                          </MDBTypography>
                          <br />
                          <MDBTypography variant={"body2"}>
                            <h5>
                              What can you expect from GO term predictions?
                            </h5>
                          </MDBTypography>
                          <br />
                          <MDBTypography>
                            Replicating the conditions of CAFA3 which allows a
                            comparison of our method to other state-of-the-art
                            approaches showed that our method would have been
                            competitive with the top 10 CAFA3 competitors and
                            clearly outperformed homology-based inference
                            achieving Fmax(BPO)=37±2%, Fmax(MFO)=50±2%,
                            Fmax(CCO)=58±2%. Applying a new dataset not
                            available during method development and preliminary
                            results from CAFA4 support those results. For each
                            prediction a reliability score is provided which is
                            derived based on the distance of the query protein
                            and the closest annotated protein in SeqVec
                            embedding space. If this score is {">"}0.5 we expect
                            a precision and recall of ~50% for BPO and MFO and
                            ~60% for CCO.
                          </MDBTypography>

                          <br />
                          <MDBTypography variant={"body2"}>
                            <h5>Computational details</h5>
                          </MDBTypography>
                          <br />
                          <MDBTypography>
                            Our method consists of three steps: first, the
                            language model SeqVec is used to represent the query
                            protein as vectors (embeddings). That is used to
                            compute the pairwise Euclidean distance to each
                            embedding of a set of annotated proteins (this
                            lookup set is pre-computed). As not all proteins
                            hold annotations to all three ontologies, we pick
                            the most similar protein for each of the three
                            ontologies separately. Then, the annotation of the
                            most similar protein for each ontology is
                            transferred to the query protein.
                          </MDBTypography>

                          <br />
                          <MDBTypography variant={"body2"}>
                            <h5>Cite</h5>
                          </MDBTypography>
                          <br />
                          <MDBTypography>
                            goPredSim:{" "}
                            {
                              <a
                                href={
                                  "https://www.nature.com/articles/s41598-020-80786-0"
                                }
                                target={"_blank"}
                                ref={"author"}
                              >
                                https://www.nature.com/articles/s41598-020-80786-0
                              </a>
                            }
                          </MDBTypography>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                  </div>
                </Tab>
              </Tabs>
            </div>
          )}
        </Container>
        {this.state.loading !== null && this.state.proteinStatus != 0 && (
          <Container>
            <div className="col-lg-12">
              <MDBTypography style={{ textAlign: "center" }} tag="h4">
                Sequence Structure
              </MDBTypography>
            </div>
            <div className="row mb-5"></div>
            <div>
              <StructurePrediction data={structurePredictionData} />
            </div>
            <div className="row mb-5"></div>
          </Container>
        )}
         {this.state.loading !== null && this.state.proteinStatus != 0 && (
          <div>
            <Container style={{ textAlign: "justify" }}>
        <FeatureViewer data={this.state.features} />
              <div className="row mb-5"> </div>
              </Container>
              </div>
              )}
        {this.state.loading !== null && this.state.proteinStatus != 0 && (
          <Container style={{ textAlign: "justify" }}>
            <div className="row mb-5">
              <div className="col-lg-12">
                <div className="row mb-5"></div>
                <MDBTypography style={{ textAlign: "center" }} tag="h4">
                  Residue-Landscape Features
                </MDBTypography>
              </div>

              
              

              <Tabs
                defaultActiveKey="variationPrediction"
                id="uncontrolled-tab-example"
                className="mb-3"
              >
                {features.predictedDSSP3 && (
                  <div></div>
                  /*
                    <div className="row mb-5">
                      <div className="col-lg-12">
                        <div>
                          <SequenceHighlighter
                            string={features.predictedDSSP3}
                            proteinColorScheme={proteinColorSchemes["dssp8"]}
                          />
                        </div>
                      </div>
                    </div>
                    */
                )}

                {features.predictedDSSP8 && (
                  <div></div>
                  /*
                    <div className="row mb-5">
                      <div className="col-lg-12">
                        <div>
                          <SequenceHighlighter
                            string={features.predictedDSSP8}
                            proteinColorScheme={proteinColorSchemes["dssp8"]}
                          />
                        </div>
                      </div>
                    </div>
                    */
                )}

                {features.predictedDisorder && (
                  <div></div>
                  /*
                    <div className="row mb-5">
                      <div className="col-lg-12">
                        <div>
                          <SequenceHighlighter
                            string={features.predictedDisorder}
                            proteinColorScheme={proteinColorSchemes["disorder"]}
                          />
                        </div>
                      </div>
                    </div>
                    */
                )}
                <Tab
                  eventKey="variationPrediction"
                  title="Variant Effect Prediction"
                >
                  <Container style={{ textAlign: "center" }}>
                    <VariationPrediction data={pointMutationData} />
                  </Container>
                </Tab>

                <Tab
                  eventKey="conservationPrediction"
                  title="Conservation Prediction"
                >
                  <div className="row mb-5"></div>
                </Tab>
              </Tabs>
              <Accordion>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Help</Accordion.Header>
                  <Accordion.Body>
                    <br />
                    <MDBTypography variant={"body2"}>
                      <h5>What is predicted?</h5>
                    </MDBTypography>
                    <br />
                    <MDBTypography>
                      RePROF and ProtT5-sec predict secondary structure
                      elements, i.e. Helix, Strand and Other (details in "How Do
                      We Predict Secondary Structure?"). Furthermore, RePROF
                      also predicts solvent accessibility of protein residues
                      for 10 states of relative accessibility. These are grouped
                      into two states: buried and exposed.
                    </MDBTypography>

                    <br />
                    <MDBTypography variant={"body2"}>
                      <h5>
                        What Can You Expect From Secondary Structure Prediction?
                      </h5>
                    </MDBTypography>
                    <br />
                    <MDBTypography>
                      The expected levels of accuracy (RePROF secondary
                      structure = 72±11% (three state per-residue accuracy, Q3)
                      and RePROF solvent accessibility = 75±7% (two-state
                      per-residue accuracy)) are valid for typical globular,
                      water-soluble proteins when the multiple sequence
                      alignment (MSA) contains many and diverse sequences. High
                      values for the reliability indices indicate more accurate
                      predictions (although: for alignments with little
                      variation in the sequences, the reliability indices adopt
                      misleadingly high values). An expected accuracy of 70%
                      does not imply that for your protein 70% of all residues
                      are correctly predicted. Instead, this number is
                      calculated as an average of many hard to predict proteins.
                      An expected accuracy of 70±10% (one standard deviation)
                      implies that, on average, for two thirds of all proteins
                      between 60 and 80% of the residues will be predicted
                      correctly (expected accuracy of PHDsec). Thus, prediction
                      accuracy can be higher than 80% or lower than 60% for your
                      protein. Few methods supply well tested indices for the
                      reliability of predictions. Such indices can help to
                      reduce or increase your trust in a particular prediction.
                      Secondary structure predictions from RePROF (as well as
                      other methods) focus on predicting hydrogen bonds.
                      Consequently, occasionally strongly predicted (high
                      reliability index) helices are observed as strands and
                      vice versa. Secondary structure prediction of RePROF
                      treats N- and C-terminal ends of proteins as solvent
                      molecules. The size of the input window for predicting 1D
                      structure is up to 17 residues. Thus, the first and the
                      last 17 residues of your sequence will 'see solvent'.
                      Especially for short fragments you did cut out from large
                      proteins, this may result in false predictions. ProtT5-sec
                      is a novel secondary structure prediction method which
                      achieves a Q3 of 81-87% (CASP12=81%, TS115=87%) using a
                      two-layer convolutional neural network. The advantage of
                      this method is that it does not rely on the number or the
                      diversity of sequences in the MSAs. Instead, the method
                      learned the "language of protein sequences", and can be
                      leveraged to create representations from single protein
                      sequences, i.e. your query sequence. These representations
                      can then be used to train machine learning devices to
                      predict protein features, in this case: secondary
                      structure.
                    </MDBTypography>

                    <br />
                    <MDBTypography variant={"body2"}>
                      <h5>Cite</h5>
                    </MDBTypography>
                    <br />
                    <MDBTypography>
                    ProtTrans:{" "}
                            {
                              <a
                                href={
                                  "https://ieeexplore.ieee.org/document/9477085"
                                }
                                target={"_blank"}
                                ref={"author"}
                              >
                                https://ieeexplore.ieee.org/document/9477085
                              </a>
                            }
                          <MDBTypography>
                          VESPA: {" "}
                            {
                              <a
                                href={
                                  "https://doi.org/10.1007/s00439-021-02411-y"
                                }
                                target={"_blank"}
                                ref={"author"}
                              >
                                https://doi.org/10.1007/s00439-021-02411-y
                              </a>
                            }
                          </MDBTypography>
                      
                    </MDBTypography>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
              <div className="row mb-5"> </div>
            </div>
          </Container>
        )}
        <FeatureGrabber />
      </div>
    );
  }
}

Features.propTypes = {
  classes: PropTypes.object.isRequired,
  jobParameters: PropTypes.object,
  jobResults: PropTypes.object,
};

export default storeComponentWrapper(Features);
