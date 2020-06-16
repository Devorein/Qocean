import React, { Component, Fragment } from 'react';
import { withSnackbar } from 'notistack';
import UploadButton from '../../components/Buttons/UploadButton';
import CustomList from '../../components/List/List';
import PublishIcon from '@material-ui/icons/Publish';
import FormFiller from '../FormFiller/FormFiller';
import PageSwitcher from '../../components/PageSwitcher/PageSwitcher';

import './Import.scss';

class Import extends Component {
	transformData = (currentType, data) => {
		const { enqueueSnackbar } = this.props;
		if (data) {
			let items = JSON.parse(data);
			const itemname = [];
			return items.filter(({ rtype: importType, name }) => {
				const isUnique = itemname.indexOf(name) === -1;
				if (isUnique) itemname.push(name);
				if (!importType.match(/(quiz|environment|question|folder)/)) {
					enqueueSnackbar(`${name} doesnt have a type field`, {
						variant: 'error'
					});
					return false;
				} else if (importType !== currentType.toLowerCase()) {
					enqueueSnackbar(`${importType} ${name} is not of selected type`, {
						variant: 'error'
					});
					return false;
				} else if (!isUnique) {
					enqueueSnackbar(`${importType} ${name} has already been added`, {
						variant: 'error'
					});
					return false;
				} else return true;
			});
		} else return [];
	};

	transformList = (type, data) => {
		return data.map((data) => {
			return {
				primary: data.name,
				primaryIcon: type
			};
		});
	};

	render() {
		return (
			<div className="Import page">
				<PageSwitcher
					page="Import"
					runAfterSwitch={() => {
						this.setState({
							selectedIndex: null
						});
					}}
				>
					{({ CustomTabs, type }) => (
						<Fragment>
							{CustomTabs}
							<UploadButton msg={`Import ${type}`} accept={'application/json'}>
								{({ UploadButton, data }) => {
									let transformedData = [];
									if (data) transformedData = this.transformData(type, data);
									return (
										<div className={`import-section ${type}-import-section`}>
											{UploadButton}
											{transformedData.length !== 0 ? (
												<CustomList
													title={`Imported ${transformedData.length} ${type.toLowerCase()}`}
													listItems={this.transformList(type, transformedData)}
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
																	data={transformedData[selectedIndex]}
																/>
															</Fragment>
														);
													}}
												</CustomList>
											) : (
												<div>Nothing imported</div>
											)}
										</div>
									);
								}}
							</UploadButton>
						</Fragment>
					)}
				</PageSwitcher>
			</div>
		);
	}
}

export default withSnackbar(Import);
