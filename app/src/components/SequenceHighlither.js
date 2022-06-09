import React from 'react';
import PropTypes from 'prop-types';

class SequenceHighlighter extends React.Component {

    constructor(props){
        super();

        this.props = props;

        this.state = {
            selected: undefined,
            region: [0,0],
            highlightOnClick: false,
            ...props
        };
    }

    componentWillReceiveProps(newProps){
        this.setState({
            ...newProps
        })
    }

    get10mersAsReactComponents = (string) => {
        return string
        // Remove spaces
            .replace(/\s/g,"")
            // Make upper case
            .toUpperCase()
            // Split in 10-emers composed by letters
            .split(/([A-Z|\-|+]{10})/gm)
            // Filter only populated 10-emers
            .filter(Boolean)
            // Append number to every 10-emer
            .map( (ten_emer, position) => {
                let pos = (position*10)+1;
                return <span key={pos} style={{display: "flex"}}>
                    <pre style={{margin:0}}>{"      ".slice((""+pos).length-6,6) + pos + ' '}</pre>
                    {[...ten_emer].map((letter, position) => {

                        let style = {
                            margin:0,
                            border: 0,
                            fontSize: "1.2rem",
                            borderStyle: "solid",
                            borderColor: "transparent",
                        };

                        style.backgroundColor = this.state.proteinColorScheme['contrast'][letter];
                        style.color = this.state.proteinColorScheme['primary'][letter];
                        // style.borderStyle = "solid";

                        return <pre style={style} key={position}>{letter}</pre>})}
                </span>
            })
    };


    breakMersAsReactComponents = (reactComponentsArray, size=1) => {
        let newArr = [];
        while(reactComponentsArray.length) newArr.push(reactComponentsArray.splice(0,size));

        return newArr.map((elements, position) => <div key={position}>
            {elements.map(e => e)}
        </div>);
    };

    render() {
        const { string } = this.props;

        return (
            <div style={{display: "flex", flexWrap: "wrap"}}>
                {this.breakMersAsReactComponents(this.get10mersAsReactComponents(string)).map(e => e)}
            </div>
        )
    }
}


SequenceHighlighter.propTypes = {
    string: PropTypes.string.isRequired,
    proteinColorScheme: PropTypes.object.isRequired
};

export default SequenceHighlighter;