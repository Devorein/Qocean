import React, { Component, Fragment } from 'react';
import axios from 'axios';
import DetailPrimary from './DetailPrimary';
import DetailSecondary from './DetailSecondary';
import DetailTertiary from './DetailTertiary';

import './Detail.scss';
class Detail extends Component {
	state = {
		data: []
	};
	decideSections = (type) => {
		const { data } = this.state.data;
		if (data) {
			let primary = [],
				secondary = [],
				tertiary = [];

			if (type === 'users') {
			} else if (type === 'quizzes') {
			} else if (type === 'questions') {
			} else if (type === 'folders') {
			} else if (type === 'environments') {
			}
			return (
				<Fragment>
					<DetailPrimary items={primary} type={type} item={data} />
					<DetailSecondary items={secondary} type={type} item={data} />
					<DetailTertiary items={tertiary} type={type} item={data} />
				</Fragment>
			);
		}
	};
	componentDidMount() {
		const { type, id } = this.props.match.params;
		axios.get(`http://localhost:5001/api/v1/${type}?_id=${id}`).then((data) => {
			this.setState({
				data
			});
		});
	}
	render() {
		const { type } = this.props.match.params;
		return <div className={`${type}-detail`}>{this.decideSections(type)}</div>;
	}
}

export default Detail;
