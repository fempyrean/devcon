import axios from 'axios';

/**
 * @author Lucas Sousa
 * @param token JWT Token
 * @since 2019.02.27
 * @description
 * 	Sets default authorization header
 */
const setAuthToken = token => {
	if (token) {
		// Apply to every request
		axios.defaults.headers.common['Authorization'] = token;
	} else {
		// Delete the auth header
		delete axios.defaults.headers.common['Authorization'];
	}
}

export default setAuthToken;
