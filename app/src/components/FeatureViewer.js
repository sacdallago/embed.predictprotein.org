import React from 'react';
import PropTypes from 'prop-types';
//import './featureViewer.scss';


class FeatureViewer extends React.Component {

    componentDidMount(){
        if(this.props.data !== null){
            this.ft = new window.FeatureViewer(this.props.data.sequence,
                '#fv1',
                {
                    showAxis: true,
                    showSequence: true,
                    brushActive: true, //zoom
                    toolbar:true, //current zoom & mouse position
                    bubbleHelp:true,
                    zoomMax:50 //define the maximum range of the zoom
                });
        }
    }

    findIndexes = (string, letters) => {
        let result = {};

        for(let j=0; j<letters.length;j++) {
            let indices = [];
            for(let i=0; i<string.length;i++) {
                if (string[i] === letters[j]) indices.push(i+1);
            }
            result[letters[j]] = indices;
        }

        return result;
    };

    findRanges = array => {
        array.sort((e,i) => e-i);

        let ranges = [{x: array[0], y: array[0]}];

        for(let i=1; i<array.length; i++){
            let currentRange = ranges[ranges.length-1];

            if(array[i] <= currentRange.y+1){
                currentRange.y = array[i];
            } else {
                ranges.push({x: array[i], y: array[i]});
            }
        }
        return ranges;
    };


    componentWillReceiveProps(newProps){
        if(newProps.data !== null){
            this.ft && this.ft.clearInstance();
            delete this.ft;
            document.getElementById("fv1").innerHTML = "";
            this.ft = new window.FeatureViewer(newProps.data.sequence,
                '#fv1',
            {
                showAxis: true,
                showSequence: true,
                brushActive: true, //zoom
                toolbar:true, //current zoom & mouse position
                bubbleHelp:false,
                zoomMax:50 //define the maximum range of the zoom
            });
            
            
            /*
            this.ft.onFeatureSelected(function (d) {
                    console.log(d.detail);
                });
            */

            

            if(newProps.data.predictedDisorder){
                let disorder = this.findIndexes(newProps.data.predictedDisorder, ['X']);

                this.ft.addFeature({
                    data: this.findRanges(disorder['X']),
                    name: "Disorder",
                    color: "#0F8292",
                    type: "rect", 
                    height: 20
                });
            }

            if(newProps.data.predictedDSSP3){
                let secondaryStructure3 = this.findIndexes(newProps.data.predictedDSSP3, ['H', 'E', 'C']);

                this.ft.addFeature({
                    data: this.findRanges(secondaryStructure3['H']),
                    name: "DSSP3-Helix",
                    color: "#ccd96a",
                    type: "rect", 
                    height: 20
                });

                this.ft.addFeature({
                    data: this.findRanges(secondaryStructure3['E']),
                    name: "DSSP3-Sheet",
                    color: "#d958aa",
                    type: "rect", 
                    height: 20
                });

                this.ft.addFeature({
                    data: this.findRanges(secondaryStructure3['C']),
                    name: "DSSP3-Other",
                    color: "#4cd9c2",
                    type: "rect", 
                    height: 20
                });
            }
           
        }
    }

    render() {
        const { classes } = this.props;

        return (
                <div className='use-bootstrap' id={"fv1"}>
                </div>
        );
    }
}

FeatureViewer.propTypes = {
    classes: PropTypes.object.isRequired,
    data: PropTypes.object
};

export default FeatureViewer;