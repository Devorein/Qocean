import React, { Component } from 'react';
import UploadButton from '../../components/Buttons/UploadButton';
import CustomTabs from '../../components/Tab/Tabs';
import LinkIcon from '@material-ui/icons/Link';
import PublishIcon from '@material-ui/icons/Publish';
import TextField from '@material-ui/core/TextField';
import './FileInput.scss';
class FileInput extends Component {
	state = {
		image: 'link',
		file: null,
		src: ''
	};

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

	switchImageHandler = (value) => {
		this.setState({
			image: value.name
		});
	};

	resetData = () => {
		if (this.input) this.input.value = '';
		this.setState({
			src: '',
			file: null
		});
	};

	render() {
		const { setFile, switchImageHandler } = this;
		const { image, src } = this.state;
		const headers = [ { name: 'link', icon: <LinkIcon /> }, { name: 'upload', icon: <PublishIcon /> } ];
		return (
			<div className="FileInput">
				<CustomTabs
					against={this.state.image}
					onChange={(e, value) => {
						switchImageHandler(headers[value]);
					}}
					headers={headers}
				/>
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

				<div className="image_preview">{src ? <img src={src} alt="preview" /> : 'No image selected or linked'}</div>
			</div>
		);
	}
}

export default FileInput;
