import React from 'react';
import HomeScreen from './screens/HomeScreen';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import themeReducer from './redux/themeReducer';

const store = createStore(combineReducers({themeReducer}), applyMiddleware(thunk));

export default function App(){
	return (
		<Provider store={store}>
			<HomeScreen />
		</Provider>
	)
}