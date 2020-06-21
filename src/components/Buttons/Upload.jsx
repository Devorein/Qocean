import React, { useMemo } from 'react';
import { withStyles } from '@material-ui/core/styles';
import DropZone from 'react-dropzone';
import clsx from 'clsx';
import Button from '@material-ui/core/Button';

const baseStyle = {
	borderColor: 'black',
	borderWidth: 2,
	borderStyle: 'solid',
	transition: 'border 250ms ease-in-out'
};

const activeStyle = {
	borderColor: '#2196f3'
};

const acceptStyle = {
	borderColor: '#00e676'
};

const rejectStyle = {
	borderColor: '#ff1744'
};

class Upload extends React.Component {
	state = {
		file: null,
		data: null
	};

	onDrop = (accept, files) => {
		const reader = new FileReader();
		reader.onload = (e) => {
			this.setState({ data: e.target.result, file: files[0] });
		};
		if (files.length > 0) {
			if (accept.includes('image/*')) reader.readAsDataURL(files[0]);
			else if (accept.includes('json')) reader.readAsText(files[0]);
		}
	};

	resetUploadState = () => {
		this.setState({
			data: null,
			file: null
		});
	};

	render() {
		const { inputRef, msg = 'Upload', accept = [ 'image/*' ], classes, multiple = false } = this.props;
		const classNames = clsx(classes.root, 'upload_button');
		const { resetUploadState } = this;

		return this.props.children({
			resetUploadState,
			UploadState: this.state,
			Upload: (
				<DropZone accept={accept} multiple={multiple} onDrop={this.onDrop.bind(null, accept)}>
					{({ getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject }) => {
						const style = useMemo(
							() => ({
								...baseStyle,
								...(isDragActive ? activeStyle : {}),
								...(isDragAccept ? acceptStyle : {}),
								...(isDragReject ? rejectStyle : {})
							}),
							[ isDragActive, isDragReject, isDragAccept ]
						);
						return (
							<div {...getRootProps({ className: classNames, style })}>
								<input
									{...getInputProps({
										ref: (input) => {
											this.input = input;
											if (inputRef) inputRef(input);
										}
									})}
								/>
								<p className="Upload_text">Drag and Drop file or</p>
								<Button
									className="Upload_button"
									variant="contained"
									color="primary"
									component="span"
									onClick={() => {
										if (this.input) this.input.click();
									}}
								>
									{msg}
								</Button>
							</div>
						);
					}}
				</DropZone>
			)
		});
	}
}

export default withStyles((theme) => ({
	root: {
		textAlign: 'center',
		padding: '5px',
		height: 100,
		'& .Upload_text': {
			width: '100%',
			padding: '10px',
			cursor: 'pointer',
			margin: '0px',
			userSelect: 'none'
		},
		'& .Upload_button': {
			margin: '0 auto',
			width: '25%',
			maxWidth: 150
		}
	}
}))(Upload);
