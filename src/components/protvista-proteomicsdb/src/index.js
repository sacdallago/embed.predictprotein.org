import ProtvistaProteomicsdb from "./protvista-proteomicsdb";

if (!window.customElements.get("protvista-proteomicsdb")) {
    window.customElements.define("protvista-proteomicsdb", ProtvistaProteomicsdb);
  }

export default ProtvistaProteomicsdb;
