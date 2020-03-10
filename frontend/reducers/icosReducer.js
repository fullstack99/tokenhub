import {
    FETCH_ALL_ICOS,
    FETCH_ICO_CLOSED,
    FETCH_SELECTED_ICO,
    FETCH_ICO_CLOSED_CONFIRM_SUCCESS,
    FETCH_ICO_CLOSED_CONFIRM_FAIL,
    FETCH_ICO_CLOSED_REQUEST,
    FETCH_ICO_ADD_SUCCESS,
    FETCH_ICO_ADD_FAILD,
    FETCH_ICO_UPDATE_FAILD,
    FETCH_ICO_UPDATE_SUCCESS,
    INITIAL_STATE
} from '../actions/types';

const initialState = {
    isFetching: true,
    isFetched: false,
    data: [],
    updatedData: [],
    error: [],
    updatedFlag: "",
    closedIco: [],
    closeConfirmFlag: "",
    isAdded: "",
    addedIco: [],
    isUpdated: ""
};

export default function (state = initialState, action) {
    switch (action.type) {
        case FETCH_ALL_ICOS:
            return Object.assign({}, state, {
                isFetching: false,
                isFetched: true,
                data: action.payload
            });

        case FETCH_ICO_CLOSED:
            return Object.assign({}, state, {
                isFetching: false,
                isFetched: true,
                closedIco: action.payload
            });

        case FETCH_ICO_CLOSED_CONFIRM_SUCCESS:
            return Object.assign({}, state, {
                isFetching: false,
                isFetched: true,
                closeConfirmFlag: action.payload
            });

        case FETCH_ICO_CLOSED_CONFIRM_FAIL:
            return Object.assign({}, state, {
                isFetching: false,
                isFetched: true,
                closeConfirmFlag: action.payload
            });

        case FETCH_ICO_CLOSED_REQUEST:
            return Object.assign({}, state, {
                isFetching: false,
                isFetched: true,
                closeConfirmFlag: "",
                isAdded: "",
                isUpdated: ""
            });
        case FETCH_ICO_ADD_SUCCESS:
            return Object.assign({}, state, {
                isAdded: action.payload.isAdded,
                addedIco: action.payload.data
            });
        case FETCH_ICO_ADD_FAILD:
            return Object.assign({}, state, {
                isAdded: action.payload.isAdded,
                addedIco: action.payload.data
            });
        case FETCH_ICO_UPDATE_SUCCESS:
            return Object.assign({}, state, {
                isUpdated: action.payload
            });
        case FETCH_ICO_UPDATE_FAILD:
            return Object.assign({}, state, {
                isUpdated: action.payload
            });
        case INITIAL_STATE:
            return state;

        default:
            return state;
    }
}
