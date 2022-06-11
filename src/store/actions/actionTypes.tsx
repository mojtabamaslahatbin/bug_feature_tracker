//Action Types
import {ItemInterface, PersonInterface} from "../../Types/types";

export const START_FETCHING = "START_FETCHING"
export const END_FETCHING = "END_FETCHING"
export const FETCH_ITEMS_SUCCEED = "FETCH_ITEMS_SUCCEED"
export const FETCH_USER_SUCCEED = "FETCH_USER_SUCCEED"
export const ADD_ITEM_SUCCEED = "ADD_ITEM_SUCCEED"
export const REMOVE_ITEM_SUCCEED = "REMOVE_ITEM_SUCCEED"
export const UPDATE_ITEM_SUCCEED = "UPDATE_ITEM_SUCCEED"
export const USER_LOGGED_IN = "USER_LOGGED_IN"
export const USER_LOGGED_OUT = "USER_LOGGED_OUT"
export const SHOW_FLASH_MESSAGE = "SHOW_FLASH_MESSAGE"
export const HIDE_FLASH_MESSAGE = "HIDE_FLASH_MESSAGE"

//Action Creators
export const startFetching = () => {
    return {type: START_FETCHING}
}
export const endFetching = () => {
    return {type: END_FETCHING}
}

export const fetchUserSucceed = (user: PersonInterface) => {
    return {
        type: FETCH_USER_SUCCEED,
        payload: user
    }
}
export const fetchItemsSucceed = (items: ItemInterface[]) => {
    return {
        type: FETCH_ITEMS_SUCCEED,
        payload: items
    }
}

export const addItemSucceed = () => (
    {
        type: ADD_ITEM_SUCCEED,
    }
)
export const removeItemSucceed = () => (
    {
        type: REMOVE_ITEM_SUCCEED,
    }
)
export const updateItemSucceed = () => (
    {
        type: UPDATE_ITEM_SUCCEED,
    }
)

export const showFlashMessage = (message: string, type: "success" | "error") => {
    return {
        type: SHOW_FLASH_MESSAGE,
        payload: {
            messageText: message,
            messageType: type
        }
    }
}
export const hideFlashMessage = () => {
    return {type: HIDE_FLASH_MESSAGE}
}

export const userLoggedIn = () => {
    return {type: USER_LOGGED_IN}
}
export const userLoggedOut = () => {
    return {type: USER_LOGGED_OUT}
}