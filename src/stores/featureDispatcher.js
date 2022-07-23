import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const mapStateToProps = ({ featureSelection }) => ({ featureSelection });

const mapDispatchToProps = function (dispatch) {
    return bindActionCreators({
        action: (a) => {
            return a
        },
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps);