import { persistReducer, persistStore } from "redux-persist";
import storage from 'redux-persist/lib/storage'; 
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";


const persistConfig = {
    key: 'user',
    storage,
    blacklist: ['user'],
};


const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = configureStore({
    reducer: persistedReducer,
});

const persistor = persistStore(store);

export default store;
export {persistor}