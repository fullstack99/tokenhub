import {
    FETCH_WITHDRAWAL_TRANSACTIONS,
    UPLOAD_WITHDRAWALS_SUCCESS,
    UPLOAD_WITHDRAWALS_FAILD,
    FETCH_UPLOAD_REQUEST,
    INITIAL_STATE
} from '../actions/types';

const initialState = {
    isFetching: true,
    isFetched: false,
    data: [],
    uploaded_withdrawals: [],
    uploadFlag: ""
}

export default function (state = initialState, action) {
    switch (action.type) {
        case FETCH_WITHDRAWAL_TRANSACTIONS:
            return Object.assign({}, state, {
                isFetching: false,
                isFetched: true,
                data: action.payload
            });
        case UPLOAD_WITHDRAWALS_SUCCESS:
            return Object.assign({}, state, {
                isFetching: false,
                isFetched: true,
                uploadFlag: true,
                uploaded_withdrawals: action.payload
            });
        case UPLOAD_WITHDRAWALS_FAILD:
            return Object.assign({}, state, {
                isFetching: false,
                isFetched: true,
                uploadFlag: false,
                uploaded_withdrawals: action.payload
            });
        case FETCH_UPLOAD_REQUEST:
            return Object.assign({}, state, {
                uploadFlag: ""
            });
        case INITIAL_STATE:
            return state;
        default:
            return state;
    }
}
