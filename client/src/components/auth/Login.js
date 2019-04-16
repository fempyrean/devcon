import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUser } from '../../actions/authActions';
import TextFieldGroup from '../common/TextFieldGroup';

class Login extends Component {

	constructor() {
		super();

		this.state = {
			email: '',
			password: '',
			errors: {}
		}
	}

	componentDidMount() {
		if (this.props.auth.isAuthenticated) {
			this.props.history.push('/dashboard');
		}
	}

	componentWillReceiveProps (nextProps) {

		// Redirecting user to dashboard
		if (nextProps.auth.isAuthenticated) {
			this.props.history.push('/dashboard');
		}

		// Setting errors in the state
		if (nextProps.errors) {
			this.setState({ errors: nextProps.errors });
		}
	}

	/**
	 * @author Lucas Sousa
	 * @since 2019.02.24
	 * @description Called with every change event
	 * @param event
	 */
	onChange = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	}

	/**
	 * @author Lucas Sousa
	 * @since 2019.02.24
	 * @description Called when submitting a form
	 * @param event
	 */
	onSubmit = (e) => {
		// Preventing event default
		e.preventDefault();

		// Creating user object
		const userData = {
			email: this.state.email,
			password: this.state.password,
		}

		this.props.loginUser(userData);
	}

	render() {

		const { errors } = this.props;

		return (
			<div className="login">
				<div className="container">
					<div className="row">
						<div className="col-md-8 m-auto">
							<h1 className="display-4 text-center">Log In</h1>
							<p className="lead text-center">Sig in to your DevConnector account</p>
							<form onSubmit={this.onSubmit}>
								<TextFieldGroup
									placeholder="Email Address"
									name="email"
									type="email"
									value={this.state.email}
									onChange={this.onChange}
									error={errors.email}
								/>
								<TextFieldGroup
									placeholder="Password"
									name="password"
									type="password"
									value={this.state.password}
									onChange={this.onChange}
									error={errors.password}
								/>
								<input type="submit" className="btn btn-info btn-block mt-4" />
							</form>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

Login.propTypes = {
	loginUser: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired
};

const mapStateToProps = state => {
	const { auth, errors } = state;
	return { auth, errors };
}

export default connect(mapStateToProps, { loginUser })(Login);
