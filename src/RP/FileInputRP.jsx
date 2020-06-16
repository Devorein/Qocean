import React, { Component, Fragment } from 'react';
import TextField from '@material-ui/core/TextField';

import UploadButton from '../components/Buttons/UploadButton';
import TabSwitcher from '../components/Tab/TabSwitcher';

class FileInputRP extends Component {
	state = {
		file: null,
		src: this.props.src.match(/^(http|data)/) ? this.props.src : `http://localhost:5001/uploads/${this.props.src}`
	};

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (nextProps.src !== this.state.src) {
			this.setState({
				src: nextProps.src.match(/^(http|data)/) ? nextProps.src : `http://localhost:5001/uploads/${nextProps.src}`
			});
		} else return null;
	}

	setFile = (e) => {
		e.persist();
		const reader = new FileReader();
		const { files: [ file ] } = e.target;

		reader.onload = (e) => {
			this.setState({
				file,
				src: e.target.result
			});
		};
		reader.readAsDataURL(file);
	};

	resetData = () => {
		if (this.input) this.input.value = '';
		this.setState({
			src: '',
			file: null
		});
	};

	resetFileInput = () => {
		this.setState({
			file: null,
			src: this.props.src || ''
		});
	};

	render() {
		const { setFile, resetFileInput } = this;
		const { src, file } = this.state;
		return (
			<TabSwitcher comp="Fileinput" type={this.props.src.match(/^(http|data)/) ? 'link' : 'upload'}>
				{({ CustomTabs, type: image }) => {
					image = image.toLowerCase();
					return (
						<Fragment>
							{this.props.children({
								resetFileInput,
								getFileData: () => {
									return {
										file,
										src,
										image
									};
								},
								FileInput: (
									<div className="FileInput">
										<Fragment>
											{CustomTabs}
											{image === 'link' ? (
												<TextField
													value={this.state.src}
													onChange={(e) => {
														this.setState({
															src: e.target.value
														});
													}}
												/>
											) : (
												<UploadButton key={'upload'} setFile={setFile} inputRef={(input) => (this.input = input)} />
											)}

											<div className="image_preview">
												{src ? <img src={src} alt="preview" /> : 'No image selected or linked'}
											</div>
										</Fragment>
									</div>
								)
							})}
						</Fragment>
					);
				}}
			</TabSwitcher>
		);
	}
}

export default FileInputRP;
