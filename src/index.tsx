import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import {BrowserRouter} from "react-router-dom";

// implement redux
import {createStore, applyMiddleware} from "redux";
import {Provider} from "react-redux";
import thunk from "redux-thunk"
import itemsReducer from "./store/reducers/items";
import {composeWithDevTools, devToolsEnhancer} from '@redux-devtools/extension';

const store = createStore(itemsReducer, devToolsEnhancer({trace: true}));

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
);
