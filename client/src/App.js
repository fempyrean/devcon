import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authActions';
import { clearCurrentProfile } from './actions/profileActions';
import store from './store';

// Importing components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import CreateProfile from './components/create-profile/CreateProfile';
import EditProfile from './components/edit-profile/EditProfile';
import AddExperience from './components/add-credentials/AddExperience';
import AddEducation from './components/add-credentials/AddEducation';
import Profiles from './components/profiles/Profiles';
import Profile from './components/profile/Profile';

// Private route
import PrivateRoute from './components/common/PrivateRoute';

// CSS
import './App.css';

// Checking for token
if (localStorage.jwtToken) {
	// Set auth token header auth
	setAuthToken(localStorage.jwtToken);
	// Decode token
	const decodedData = jwt_decode(localStorage.jwtToken);
	// Set user and isAuthenticated
	store.dispatch(setCurrentUser(decodedData));

	// Check for token expiration
	const currentTime = Date.now() / 1000;
	if (decodedData.exp < currentTime) {
		// Logout user
		store.dispatch(logoutUser());
		// Clear current Profile
		store.dispatch(clearCurrentProfile());
		// Redirect to login
		window.location.href = '/login';
	}
}

class App extends Component {
	render() {
		return (
			<Provider store={store}>
				<Router>
					<div className="App">
						<Navbar />
						<Route exact path="/" component={Landing} />
						<div className="container">
							<Route exact path="/register" 							component={Register} />
							<Route exact path="/login" 								component={Login} />
							<Route exact path="/profiles"							component={Profiles} />
							<Route exact path="/profile/:handle"					component={Profile} />
							<Switch>
								<PrivateRoute exact path="/dashboard" 				component={Dashboard} />
							</Switch>
							<Switch>
								<PrivateRoute exact path="/create-profile" 			component={CreateProfile} />
							</Switch>
							<Switch>
								<PrivateRoute exact path="/edit-profile" 			component={EditProfile} />
							</Switch>
							<Switch>
								<PrivateRoute exact path="/add-experience" 			component={AddExperience} />
							</Switch>
							<Switch>
								<PrivateRoute exact path="/add-education" 			component={AddEducation} />
							</Switch>
						</div>
						<Footer />
					</div>
				</Router>
			</Provider>
		);
	}
}

export default App;
