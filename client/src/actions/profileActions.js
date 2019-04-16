import axios from 'axios';

import {
	GET_PROFILE,
	PROFILE_LOADING,
	GET_ERRORS,
	GET_PROFILES,
	CLEAR_CURRENT_PROFILE,
	SET_CURRENT_USER
} from './types';
import { RSA_NO_PADDING } from 'constants';

// Get current profile
export const getCurrentProfile = () => {
	return (dispatch) => {
		dispatch(setProfileLoading);

		// Making request
		const getProfile = axios.get('/api/profile');
		getProfile.then(res => {
			console.log(res);
			dispatch({
				type: GET_PROFILE,
				payload: res.data
			})
		})
		getProfile.catch(err => {
			console.log(err);
			dispatch({
				type: GET_PROFILE,
				payload: {}
			})
		})
	}
}

// Get all profiles
export const getProfiles = () => {
	return (dispatch) => {
		dispatch(setProfileLoading);
		const getProfiles = axios.get('api/profile/all');
		getProfiles.then(res => {
			dispatch({
				type: GET_PROFILES,
				payload: res.data
			})
		})
		getProfiles.catch(err => {
			dispatch({
				type: GET_PROFILES,
				payload: null
			})
		})
	}
}

// Get profile by handle
export const getProfileByHandle = (handle) => {
	return (dispatch) => {
		dispatch(setProfileLoading());
		const getProfilePromise = axios.get(`/api/profile/handle/${handle}`);
		getProfilePromise.then(res => {
			dispatch({
				type: GET_PROFILE,
				payload: res.data
			});
		})
		getProfilePromise.catch(err => {
			dispatch({
				type: GET_PROFILE,
				payload: null
			});
		})
	}
}

// Create profile
export const createProfile = (profileData, history) => {
	return (dispatch) => {
		const createProfilePromise = axios.post('/api/profile', profileData);
		createProfilePromise.then(res => history.push('/dashboard'));
		createProfilePromise.catch(err => {
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			})
		})
	}
}

// Add Experience
export const addExperience = (expData, history) => {
	return (dispatch) => {
		const addExp = axios.post('/api/profile/experience', expData);
		addExp.then(res => history.push('/dashboard'));
		addExp.catch(err => {
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			})
		})
	}
}

// Add Education
export const addEducation = (eduData, history) => {
	return (dispatch) => {
		const addEdu = axios.post('/api/profile/education', eduData);
		addEdu.then(res => history.push('/dashboard'));
		addEdu.catch(err => {
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			})
		})
	}
}

// Delete Experience
export const deleteExperience = (id) => {
	return (dispatch) => {
		const deleteExp = axios.delete(`/api/profile/experience/${id}`);
		deleteExp.then(res => {
			dispatch({
				type: GET_PROFILE,
				payload: res.data
			})
		});
		deleteExp.catch(err => {
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			})
		});

	}
}

// Delete Education
export const deleteEducation = (id) => {
	return (dispatch) => {
		const deleteEdu = axios.delete(`/api/profile/education/${id}`);
		deleteEdu.then(res => {
			dispatch({
				type: GET_PROFILE,
				payload: res.data
			})
		})
		deleteEdu.catch(err => {
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			})
		})
	}
}

// Delete account & profile
export const deleteAccount = () => {
	return (dispatch) => {
		if (window.confirm('Are you sure? This can NOT be undone!')) {
			const deletePromise = axios.delete('/api/profile');
			deletePromise.then(res => {
				dispatch({
					type: SET_CURRENT_USER,
					payload: {}
				})
			})
			deletePromise.catch(err => {
				dispatch({
					type: GET_ERRORS,
					payload: err.response.data
				})
			})
		}
	}
}

// Profile loading
export const setProfileLoading = () => {
	return {
		type: PROFILE_LOADING
	}
}

// Clear profile
export const clearCurrentProfile = () => {
	return {
		type: CLEAR_CURRENT_PROFILE
	}
}
