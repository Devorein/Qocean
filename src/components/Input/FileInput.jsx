import React, { Component } from 'react';
import UploadButton from '../../components/Buttons/UploadButton';
import CustomTabs from '../../components/Tab/Tabs';
import LinkIcon from '@material-ui/icons/Link';
import PublishIcon from '@material-ui/icons/Publish';
import InputForm from '../../components/Form/InputForm';
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

	returnData = () => {
		return [ this.state.file, this.state.src ];
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
		const index = headers.findIndex(({ name }) => name === image);

		return (
			<div className="FileInput">
				<CustomTabs
					value={index === -1 ? 0 : index}
					onChange={(e, value) => {
						switchImageHandler(headers[value]);
					}}
					headers={headers}
				/>
				{image === 'link' ? (
					<InputForm
						inputs={[ { name: 'link', initialValue: '' } ]}
						formButtons={false}
						customHandler={(_, __, e) => {
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
