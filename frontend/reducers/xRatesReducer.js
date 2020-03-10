import {
    FETCH_ALL_XRATES,
    FETCH_CUSTOM_XRATES,
    FETCH_XRATES,
    FETCH_UPDATED_XRATES,
    FETCH_UPDATED_XRATE_SUCCESS,
    FETCH_UPDATED_XRATE_FAIL,
    FETCH_CREATED_XRATE,
    FETCH_REQUEST,
    INITIAL_STATE
} from '../actions/types';

const initialState = {
    isFetching: true,
    isFetched: false,
    data: [],
    updatedData: [],
    error: [],
    updatedFlag: ""
};

export default function (state = initialState, action) {
    switch (action.type) {
        case FETCH_ALL_XRATES:
            return Object.assign({}, state, {
                isFetching: false,
                isFetched: true,
                data: action.payload
            });

        case FETCH_UPDATED_XRATE_SUCCESS:
            return Object.assign({}, state, {
                isFetching: false,
                isFetched: true,
                updatedData: action.payload,
                error: [],
                updatedFlag: true
            });

        case FETCH_UPDATED_XRATE_FAIL:
            return Object.assign({}, state, {
                isFetching: false,
                isFetched: true,
                updatedData: [],
                error: action.error,
                updatedFlag: false
            });

        case FETCH_REQUEST:
            return Object.assign({}, state, {
                isFetching: false,
                isFetched: true,
                updatedData: action.payload,
                updatedFlag: ""
            });
        case INITIAL_STATE:
            return state;
            
        default:
            return state;
    }
}
