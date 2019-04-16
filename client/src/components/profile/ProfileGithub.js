import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class ProfileGithub extends Component {
	constructor(props) {
		super(props);
		this.state = {
			clienteId: '8d8b82698a9edd521110',
			clienteSecret: 'b219cb88f64723636616293dbc3f76a215f870ce',
			count: 5,
			sort: 'created: asc',
			repos: []
		}
	}

	componentDidMount () {
		const { username } = this.props;
		const { count, sort, clientId, clientSecret } = this.state;

		const getRepos = fetch(`https://api.github.com/user/${username}/repos?per_page=${count}&sort=${sort}&client_id=${clientId}&client_secret=${clientSecret}`);
		getRepos.then(res => res.json())
		.then(data => {
			console.log(data);
		})
		getRepos.catch(err => console.log(err));
	}
	
	render() {
		return (
			<div>
				<h1>ProfileGithub</h1>
			</div>
		)
	}
}

export default ProfileGithub;
