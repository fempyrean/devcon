import axios from 'axios';
import jwt_decode from 'jwt-decode';
import setAuthToken from '../utils/setAuthToken';

import { GET_ERRORS, SET_CURRENT_USER } from './types';

// Register user
export const registerUser = (userData, history) => dispatch => {
	const saveUser = axios.post('/api/users/register', userData);
	saveUser.then(res => {
		history.push('/login');
	});
	saveUser.catch(err => {
		dispatch({
			type: GET_ERRORS,
			payload: err.response.data
		});
	});
};

// Login user (Get token)
export const loginUser = (userData) => {
	return (dispatch) => {
		const saveUser = axios.post('/api/users/login', userData);
		saveUser.then(res => {
			// Getting the token
			const { token } = res.data;
			// Saving on localStorage
			localStorage.setItem('jwtToken', token);
			// Setting token to Auth Header (We need to send the token on every request)
			setAuthToken(token);
			// Decode token to get user data
			const decodedData = jwt_decode(token);
			dispatch(setCurrentUser(decodedData));
		});
		saveUser.catch(err => {
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			});
		});
	}
}

// Set logged in user
export const setCurrentUser = decodedData => {
	return {
		type: SET_CURRENT_USER,
		payload: decodedData
	}
}

// Log out user
export const logoutUser = () => {
	return (dispatch) => {
		// Remove token from localStorage
		localStorage.removeItem('jwtToken');
		// Remove auth header
		setAuthToken(false);
		// Set current user to empty object
		dispatch(setCurrentUser({}));
	}
}
