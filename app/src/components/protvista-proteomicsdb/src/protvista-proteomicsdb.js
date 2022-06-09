import { sleep, frame } from "timing-functions";
import { load } from "data-loader";

import ProtvistaNavigation from "protvista-navigation";
import ProtvistaTooltip from "protvista-tooltip";
import ProtvistaInterproTrack from "protvista-interpro-track";
import ProtvistaSequence from "protvista-sequence";
import ProtvistaVariation from "protvista-variation";
import ProtvistaVariationGraph from "protvista-variation-graph";
import ProtvistaFilter from "protvista-filter";
import ProtvistaManager from "protvista-manager";

// Overwrite Protvista Track
import ProtvistaTrack from "./protvista-track/ProtvistaTrack";
import { transformData as _transformDataPredictProteinAdapter } from "./ProtvistaPredictProteinAdapter";
export const transformDataPredictProteinAdapter = _transformDataPredictProteinAdapter;

const adapters = {
  "protvista-predictprotein-adapter": transformDataPredictProteinAdapter,
};

const components = {
  protvista_navigation: ProtvistaNavigation,
  protvista_tooltip: ProtvistaTooltip,
  protvista_track: ProtvistaTrack,
  protvista_interpro_track: ProtvistaInterproTrack,
  protvista_sequence: ProtvistaSequence,
  protvista_variation: ProtvistaVariation,
  protvista_variation_graph: ProtvistaVariationGraph,
  protvista_filter: ProtvistaFilter,
  protvista_manager: ProtvistaManager,
};

// Tiha - we need this in order to load the protvista package
var Protvista = require("ProtVista");

class ProtvistaProteomicsdb extends Protvista {
  
  constructor() {
    super(
      {
        adapters,
        components,
      }
    );
    this.hash = '';
    this.page = '';
    this.sequence = '';
    this.adapters = adapters
  }

  

  static get properties() {
    return {
      hash: { type: String },
      page: { type: String },
    };
  }

  connectedCallback() {
    this.getConfig = this.PPConfig;
    // In order to avoid overriding every function that uses this.accession in the extended (Protvista) class,
    // I've just assigned the the ppc hash value to the accession variable. As you will see here, I've had to,
    // nevertheless, override some functions from the extended class.
    
    //this.accession = this.hash;
    console.log('IN THE CONNECTED CALLBACK METHOD')
    super.connectedCallback();
  }

  // Here is where the configs for the Protvista feature viewer go for displaying on the PredictProtein website.
  // Refer also to: `pp-results/view/ppres.view.js` of the pp-results project
  // https://git.rostlab.org/predictprotein/pp-results, in function `drawPPProtvistaProteomics`. `ppres.view.js` sets
  // the `page` property via an html attribute in this component when the page is being rendered.
  async PPConfig(hash) {
    let config = "";
    /*
     * In class Protvista, method _loadData, if the curly-braces '{}' are not specified in the URL, designating the
     * position of the accession number, the accession number will be, by default, placed at the end of URL!
     */

    // 2020-10-16 TAK
    // getConfig is NOT called directly in this file, it's passed to `protvista.js`, which calls it,
    // using the accession as the only parameter. Refer also to: `pp-results/view/ppres.view.js` of
    // the pp-results project https://git.rostlab.org/predictprotein/pp-results, in function `drawPPProtvistaProteomics`
    config = {
      "categories": [ {
        "name": "BIO_EMBEDDINGS",
        "label": "Secondary Structure (ProtT5-sec)",
        "adapter": "protvista-predictprotein-adapter",
        "url": "https://api.bioembeddings.com/api/annotations?model=prottrans_t5_xl_u50&format=protvista-predictprotein&sequence={sequence}",
        "trackType": "protvista-track",
        "filter" : "SECONDARY_STRUCTURE_3_STATES_(prottrans_t5_xl_u50)",
        "tracks": [{
          "filter": "SECONDARY_STRUCTURE_3_STATES_(prottrans_t5_xl_u50)",
          "filterDescription": "α-helix",
          "label": "Helix",
          "name": "Helix",
          "trackType": "protvista-track"
        },{
          "filter": "SECONDARY_STRUCTURE_3_STATES_(prottrans_t5_xl_u50)",
          "filterDescription": "Extended strand, participates in β ladder",
          "label": "Strand",
          "name": "Strand",
          "trackType": "protvista-track"
        },{
          "filter": "SECONDARY_STRUCTURE_3_STATES_(prottrans_t5_xl_u50)",
          "filterDescription": "Loop/Irregular",
          "label": "Other",
          "name": "Other",
          "trackType": "protvista-track"
        }]
      }, {"separateCategory": true}]
    };
    return config;
  }

   _init() {
    console.log('stage 2')

    // Tiha - I have hardcoded everything (hash and config) to see if it works like this

    /*
    if (!this.config) {
      this.config = await this._loadConfig();
    }
    */
    this.config = {
      "categories": [ {
        "name": "BIO_EMBEDDINGS",
        "label": "Secondary Structure (ProtT5-sec)",
        "adapter": "protvista-predictprotein-adapter",
        "url": "https://api.bioembeddings.com/api/annotations?model=prottrans_t5_xl_u50&format=protvista-predictprotein&sequence={sequence}",
        "trackType": "protvista-track",
        "filter" : "SECONDARY_STRUCTURE_3_STATES_(prottrans_t5_xl_u50)",
        "tracks": [{
          "filter": "SECONDARY_STRUCTURE_3_STATES_(prottrans_t5_xl_u50)",
          "filterDescription": "α-helix",
          "label": "Helix",
          "name": "Helix",
          "trackType": "protvista-track"
        },{
          "filter": "SECONDARY_STRUCTURE_3_STATES_(prottrans_t5_xl_u50)",
          "filterDescription": "Extended strand, participates in β ladder",
          "label": "Strand",
          "name": "Strand",
          "trackType": "protvista-track"
        },{
          "filter": "SECONDARY_STRUCTURE_3_STATES_(prottrans_t5_xl_u50)",
          "filterDescription": "Loop/Irregular",
          "label": "Other",
          "name": "Other",
          "trackType": "protvista-track"
        }]
      }, {"separateCategory": true}]
    };
    this.hash = 'P62988'
    //debugger;
    //if (!this.hash) return;
    
    // Tiha - hier wird das output aus dem pred-prot API geladen, set sequence
    this.loadEntry().then((entryData) => {
      this.sequence = entryData.sequence;
      this.displayCoordinates = { start: 1, end: this.sequence.length };
      console.log('stage 4')
      // We need to get the length of the protein before rendering it
    }).then(() => this._loadData());
  }

  // Tiha -  Hier wird das API von predictprotein angesprochen und das Response wird in JSON Format zurueckgegeben
  // Tiha - hash is needed so that we can fetch the right URL
  // Tiha - I have to change it to the bio embeddings api !!!
  async loadEntry() {
    console.log('stage 3')
    try {
      return await (
          await fetch("https://api.bioembeddings.com/api/annotations?model=prottrans_t5_xl_u50&format=protvista-predictprotein&sequence=MFRTKRSALVRAVRGA")
      ).json();
    } catch (e) {
      console.error("Couldn't load PredictProtein API entry", e);
    }
  }

  //Tiha - here ..everything happens?
  _loadData() {
    const tasks = this.config.categories.map(
        ({ name, url, adapter, tracks, filter }) => { // filter here is referring to a category filter
          if (!(name && url && adapter && tracks)) return;
          let urlWithProtein;
          if (url.indexOf("{}") >= 0) {
            urlWithProtein = url.replace("{}", this.accession);
          }
          if (url.indexOf("{sequence}") >= 0) {
            urlWithProtein = url.replace("{sequence}", this.sequence);
          }
          // TODO: remove this conditional setTimeout when InterPro API more stable
          // NOTE: this is just to ensure the InterPro fetches are enqueued last
          return sleep(/interpro/.test(urlWithProtein) ? 100 : 0)
              .then(() => load(urlWithProtein))
              .then(({ payload }) => {
                if (!payload) return;
                if (adapter && !(adapter in this.adapters)) {
                  console.warn(`No Matching Adapter Found For ${adapter}`);
                  return;
                }
                const data = adapter ? this.adapters[adapter](payload) : payload;
                this.data[name] =
                    !tracks.find(track => track.trackType !== "protvista-track")
                        ? data.filter(({ category }) => !category || category === name)
                        : data;
                if(filter) { // referring to category 'filter' in config
                  this.data[name] = this.data[name].filter(({type}) => type === filter);
                }
                if (tracks) {
                  for (const track of tracks) {
                    this.data[`${name}-${track.name}`] =
                        Array.isArray(data) && track.filter
                            ? data.filter(({ type }) => type === track.filter)
                            : data;
                    if(track.filterDescription) { // track additional filter "filterDescription"
                      this.data[`${name}-${track.name}`] = this.data[`${name}-${track.name}`].filter(({ description }) => description === track.filterDescription)
                    }
                  }
                } else if (Array.isArray(data)) {
                  // if tracks are not defined we create a track per item in the result
                  for (const item of data) {
                    this.data[`${name}-${item.accession}`] = [item];
                  }
                }
                console.log(this.data)
                this.requestUpdate();
                
              });
        }
    );
    return Promise.all(tasks);
  }

}

export default ProtvistaProteomicsdb;
