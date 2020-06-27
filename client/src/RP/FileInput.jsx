import React, { Component, Fragment } from 'react';
import TextField from '@material-ui/core/TextField';

import Upload from '../components/Buttons/Upload';
import TabSwitcher from '../components/Tab/TabSwitcher';

import './FileInput.scss';

class FileInput extends Component {
	state = {
		src: this.props.src.match(/^(http|data)/) ? this.props.src : `http://localhost:5001/uploads/${this.props.src}`
	};

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (nextProps.src !== this.state.src) {
			this.setState({
				src: nextProps.src.match(/^(http|data)/) ? nextProps.src : `http://localhost:5001/uploads/${nextProps.src}`
			});
		} else return null;
	}

	resetFileInputState = () => {
		this.setState(
			{
				src: this.props.src || ''
			},
			() => {
				this.resetUploadState();
			}
		);
	};

	render() {
		const { resetFileInputState } = this;
		const { src } = this.state;
		return (
			<TabSwitcher comp="Fileinput" type={this.props.src.match(/^(http|data)/) ? 'link' : 'upload'}>
				{({ CustomTabs, type }) => {
					type = type.toLowerCase();
					return (
						<Upload>
							{({ UploadState, Upload, resetUploadState }) => {
								this.resetUploadState = resetUploadState;
								return this.props.children({
									resetFileInputState,
									FileInputState: {
										file: UploadState.file,
										src,
										type
									},
									FileInput: (
										<div className="FileInput">
											<Fragment>
												{CustomTabs}
												{type === 'link' ? (
													<TextField
														value={this.state.src}
														onChange={(e) => {
															this.setState({
																src: e.target.value
															});
														}}
													/>
												) : (
													Upload
												)}

												<div className="image_preview">
													{src ? (
														<img src={type !== 'link' && UploadState.data ? UploadState.data : src} alt="preview" />
													) : (
														'No image selected or linked'
													)}
												</div>
											</Fragment>
										</div>
									)
								});
							}}
						</Upload>
					);
				}}
			</TabSwitcher>
		);
	}
}

export default FileInput;
