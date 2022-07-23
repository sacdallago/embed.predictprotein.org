import { createStore , combineReducers, applyMiddleware } from 'redux';
import ReactGa from 'react-ga';
import {analyticsPageMiddleware} from './analyticsApgeMiddleware'

import JobParameters from './JobParameters';
import JobResults from "./JobResults";
import FeatureSelection from "./FeatureSelection";

function trackEventInGoogleAnalytics({ getState }) {
    return next => action => {
        if (action.type !== '@@router/UPDATE_LOCATION' && action.type !== '@@router/LOCATION_CHANGE' ){
            ReactGa.event({
                category: action.type,
                action: JSON.stringify(action.payload)
            });
        }

        return next(action);
    };
}

const reducer = combineReducers({
    jobParameters: JobParameters,
    jobResults: JobResults,
    featureSelection: FeatureSelection
});

const store  = createStore(reducer, applyMiddleware(trackEventInGoogleAnalytics, analyticsPageMiddleware));

export { store };