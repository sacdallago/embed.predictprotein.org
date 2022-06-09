import ProtvistaTrack from "protvista-track";
import _includes from "lodash-es/includes";
import FeatureShape from "./FeatureShape";

/* 
Overwrites the default protvista-track component by swapping the 
default FeatureShape object with our modified version. 
This allows us to use custom svg shapes.
*/
class ProtvistaShapeTrack extends ProtvistaTrack {
  connectedCallback() {
    super.connectedCallback();
    this._color = this.getAttribute("color");
    this._shape = this.getAttribute("shape");
    this._featureShape = new FeatureShape();
    this._layoutObj = this.getLayout();

    if (this._data) this._createTrack();

    this.addEventListener("load", (e) => {
      if (_includes(this.children, e.target)) {
        this.data = e.detail.payload;
      }
    });
  }
}

export default ProtvistaShapeTrack;
