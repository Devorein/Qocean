import React, { Component } from 'react';

class NotFound extends Component {
	render() {
		return (
			<div className="notfound pages">
				<div className="notfound-title page-title">404 Not Found</div>
				<div className="notfound-text page-text">The page you're trying to look for doesn't exist</div>
			</div>
		);
	}
}

export default NotFound;
