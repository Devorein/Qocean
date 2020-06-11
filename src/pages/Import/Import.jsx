import React, { Component, Fragment } from 'react';
import { withSnackbar } from 'notistack';
import CustomTabs from '../../components/Tab/Tabs';
import { withRouter } from 'react-router-dom';
import UploadButton from '../../components/Buttons/UploadButton';
import { AppContext } from '../../context/AppContext';
import CustomList from '../../components/List/List';
import PublishIcon from '@material-ui/icons/Publish';
import FormFiller from '../FormFiller/FormFiller';

import './Import.scss';

class Import extends Component {
	static contextType = AppContext;

	state = {
		data: [],
		inputs: [],
		currentPage: this.props.match.params.type,
		currentType: '',
		isOpen: false
	};

	switchPage = (page) => {
		this.props.history.push(`/${page.link}`);
		this.setState({
			inputs: [],
			data: [],
			selectedIndex: null,
			currentPage: page.name
		});
	};

	setFile = (type, e) => {
		e.persist();
		const { enqueueSnackbar } = this.props;
		const { currentPage } = this.state;
		const reader = new FileReader();
		const { files: [ file ] } = e.target;
		delete this.UploadButton.files[0];
		this.UploadButton.value = '';
		reader.onload = (e) => {
			file.text().then((data) => {
				let items = JSON.parse(data);
				const itemname = [];
				items = items.filter(({ rtype: type_, name }) => {
					const isUnique = itemname.indexOf(name) === -1;
					if (isUnique) itemname.push(name);
					if (type_ !== currentPage.toLowerCase()) {
						enqueueSnackbar(`${type} ${name} is not of selected type`, {
							variant: 'error'
						});
						return false;
					} else if (!isUnique) {
						enqueueSnackbar(`${type} ${name} has already been added`, {
							variant: 'error'
						});
						return false;
					} else if (type_ === 'quiz' || type_ === 'environment' || type_ === 'question' || type_ === 'folder')
						return true;
					else {
						enqueueSnackbar(`${type} ${name} doesnt have a type field`, {
							variant: 'error'
						});
						return false;
					}
				});
				this.setState({
					currentType: type,
					data: items
				});
			});
		};
		reader.readAsDataURL(file);
	};

	transformList = (data) => {
		const { match: { params: { type } } } = this.props;
		return data.map((data) => {
			return {
				primary: data.name,
				primaryIcon: type
			};
		});
	};

	render() {
		const { setFile } = this;
		const { match: { params: { type } } } = this.props;
		const { data } = this.state;
		const headers = [ 'Quiz', 'Question', 'Folder', 'Environment' ].map((header) => {
			return {
				name: header,
				link: `import/${header}`
			};
		});

		return (
			<div className="Import page">
				<CustomTabs
					against={type}
					onChange={(e, value) => {
						this.switchPage(headers[value]);
					}}
					height={50}
					headers={headers}
				/>
				<UploadButton
					setFile={setFile.bind(null, type)}
					msg={`Import ${type}`}
					accept={'application/json'}
					inputRef={(i) => (this.UploadButton = i)}
				/>
				<div className={`import-section ${type}-import-section`}>
					{data.length !== 0 ? (
						<CustomList
							title={`Imported ${data.length} ${type.toLowerCase()}`}
							listItems={this.transformList(data)}
							selectedIcons={[ <PublishIcon key={'publish'} onClick={(e) => {}} /> ]}
						>
							{({ selectedIndex, list }) => {
								return (
									<Fragment>
										{list}
										<FormFiller
											useModal={false}
											user={this.props.user}
											submitMsg={'Import'}
											type={type}
											page={'Import'}
											data={this.state.data[selectedIndex]}
										/>
									</Fragment>
								);
							}}
						</CustomList>
					) : (
						<div>Nothing imported</div>
					)}
				</div>
			</div>
		);
	}
}

export default withRouter(withSnackbar(Import));
