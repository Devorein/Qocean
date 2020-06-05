import React, { Component, Fragment } from 'react';
import CustomTabs from '../../components/Tab/Tabs';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import pluralize from 'pluralize';
import CustomList from '../../components/List/List';
import GetAppIcon from '@material-ui/icons/GetApp';
import shortid from 'shortid';

import download from '../../Utils/download';

class Export extends Component {
	state = {
		data: []
	};

	transformData = (data) => {
		const { match: { params: { type } } } = this.props;
		return data.map((data) => {
			const negate = [ 'user', '_id', '__v', 'id' ];
			const temp = {};
			if (type === 'Quiz')
				negate.push(
					'average_quiz_time',
					'average_difficulty',
					'total_questions',
					'total_folders',
					'folders',
					'rating',
					'questions'
				);
			else if (type === 'Question') negate.push('quiz');
			else if (type === 'Folder') negate.push('quizzes', 'total_questions', 'total_quizzes');

			const fields = Object.keys(data).filter((key) => negate.indexOf(key) === -1);
			fields.forEach((field) => (temp[field] = data[field]));
			temp.rtype = type.toLowerCase();
			return temp;
		});
	};

	componentDidMount() {
		const { match: { params: { type } } } = this.props;
		this.refetchData(type);
	}

	switchPage = (page) => {
		this.props.history.push(`/${page.link}`);
		this.refetchData(page.name);
	};

	refetchData = (type) => {
		axios
			.get(`http://localhost:5001/api/v1/${pluralize(type.toLowerCase(), 2)}/me`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`
				}
			})
			.then(({ data: { data } }) => {
				this.setState({
					data: this.transformData(data)
				});
			});
	};

	transformList = (data) => {
		const { match: { params: { type } } } = this.props;
		return data.map((data, index) => {
			return {
				primary: data.name,
				primaryIcon: type,
				key: `${data.name}${index}`
			};
		});
	};

	render() {
		const { match: { params: { type } } } = this.props;

		const headers = [ 'Quiz', 'Question', 'Folder', 'Environment' ].map((header) => {
			return {
				name: header,
				link: `export/${header}`
			};
		});

		return (
			<div className="Export page">
				<CustomTabs
					against={type}
					onChange={(e, value) => {
						this.switchPage(headers[value]);
					}}
					height={50}
					headers={headers}
				/>
				<CustomList
					title={`Your ${type}(s)`}
					listItems={this.transformList(this.state.data)}
					selectedIcons={[
						{
							icon: GetAppIcon,
							onClick: (checked) => {
								const exports = [];
								checked.forEach((checked) => {
									exports.push(this.state.data[checked]);
								});
								download(`${Date.now()}_${shortid.generate()}.json`, JSON.stringify(exports));
							}
						}
					]}
				>
					{({ list, checked, selectedIndex }) => {
						return <Fragment>{list}</Fragment>;
					}}
				</CustomList>
			</div>
		);
	}
}

export default withRouter(Export);
