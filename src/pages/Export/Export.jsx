import React, { Component } from 'react';
import CustomTabs from '../../components/Tab/Tabs';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import pluralize from 'pluralize';
import CustomList from '../../components/List/List';
import GetAppIcon from '@material-ui/icons/GetApp';

function download(filename, text) {
	const element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);
	element.style.display = 'none';
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
}

class Export extends Component {
	state = {
		data: [],
		selectedIndex: 0
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
			return temp;
		});
	};

	switchPage = (page) => {
		this.props.history.push(`/${page.link}`);
		axios
			.get(`http://localhost:5001/api/v1/${pluralize(page.name.toLowerCase(), 2)}/me`, {
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
					containsCheckbox={true}
					ref={(r) => (this.CustomList = r)}
					title={`Your ${type}(s)`}
					listItems={this.transformList(this.state.data)}
					onClick={(selectedIndex, e) => {
						this.setState({
							selectedIndex
						});
					}}
					selectedIcons={[
						<GetAppIcon
							key={'publish'}
							onClick={(e) => {
								const exports = [];
								this.CustomList.state.checked.forEach((checked) => {
									exports.push(this.state.data[checked]);
								});
								const filename = `${Date.now()}.json`;
								download(filename, JSON.stringify(exports));
							}}
						/>
					]}
				/>
			</div>
		);
	}
}

export default withRouter(Export);
