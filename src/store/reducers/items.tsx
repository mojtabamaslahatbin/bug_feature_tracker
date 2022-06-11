import {ItemInterface, PersonInterface} from "../../Types/types";
import {supabase} from "../../database/Database";
import * as actionType from "../actions/actionTypes";

//Types
export type Action = {
    type: string;
    payload?: any;
}
export type InitialStateType = {
    items: ItemInterface[];
    isLoading: boolean;
    fetchCount: number;
    loggedIn: boolean;
    appUser: PersonInterface | null;
    messageText: string;
    messageType: "success" | "error";
    showMessage: boolean;
}

const initialState: InitialStateType = {
    items: [],
    isLoading: false,
    fetchCount: 0,
    loggedIn: Boolean(supabase.auth.session()),
    appUser: null,
    messageText: "",
    messageType: "success",
    showMessage: false,
}

//Reducer
export default function itemsReducer(state = initialState, action: Action) {
    switch (action.type) {
        case actionType.START_FETCHING:
            return {
                ...state,
                isLoading: true,
            }
        case actionType.END_FETCHING:
            return {
                ...state,
                isLoading: false,
            }
        case actionType.FETCH_ITEMS_SUCCEED:
            return {
                ...state,
                items: [...action.payload],
                isLoading: false,
            }
        case actionType.FETCH_USER_SUCCEED:
            return {
                ...state,
                appUser: action.payload,
                isLoading: false
            }
        case actionType.ADD_ITEM_SUCCEED:
            return {
                ...state,
                fetchCount: state.fetchCount + 1
            }
        case actionType.REMOVE_ITEM_SUCCEED:
            return {
                ...state,
                fetchCount: state.fetchCount + 1
            }
        case actionType.UPDATE_ITEM_SUCCEED:
            return {
                ...state,
                fetchCount: state.fetchCount + 1
            }
        case actionType.USER_LOGGED_IN:
            return {
                ...state,
                loggedIn: true,
                isLoading: false
            }
        case actionType.USER_LOGGED_OUT:
            return {
                ...state,
                loggedIn: false,
            }
        case actionType.SHOW_FLASH_MESSAGE:
            return {
                ...state,
                messageText: action.payload.messageText,
                messageType: action.payload.messageType,
                showMessage: true
            }
        case actionType.HIDE_FLASH_MESSAGE:
            return {
                ...state,
                showMessage: false
            }
        default :
            return state
    }
}

