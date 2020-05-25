import React, { Component } from 'react';

class LinearList extends Component {
	render() {
		const { data } = this.props;
		return (
			<div>
				{data ? (
					Object.entries(data).map(({ key, value }) => {
						return (
							<div>
								<div>{key}</div>
								<div>{value}</div>
							</div>
						);
					})
				) : (
					<div>You havent selected anything yet</div>
				)}
			</div>
		);
	}
}

export default LinearList;
