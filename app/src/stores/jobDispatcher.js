import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const mapStateToProps = ({ jobParameters, jobResults }) =>
    ({ jobParameters, jobResults });

const mapDispatchToProps = function (dispatch) {
    return bindActionCreators({
        action: (a) => {
            return a
        },
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps);