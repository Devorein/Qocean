import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import clsx from 'clsx';

class Upload extends React.Component {
	state = {
		file: null,
		data: null
	};

	onChange = (accept, e) => {
		e.persist();
		const reader = new FileReader();
		const { files } = e.target;
		reader.onload = (e) => {
			this.setState({ data: e.target.result, file: files[0] });
		};
		if (accept.includes('image/*')) reader.readAsDataURL(files[0]);
		else if (accept.includes('json')) reader.readAsText(files[0]);
	};

	resetUploadState = () => {
		this.setState({
			data: null,
			file: null
		});
	};

	render() {
		const { inputRef, msg = 'Upload', accept = 'image/*', classes } = this.props;
		const classNames = clsx(classes.root, 'upload_button');
		const { onChange, resetUploadState } = this;

		return this.props.children({
			resetUploadState,
			UploadState: this.state,
			Upload: (
				<div className={classNames}>
					<input
						accept={accept}
						className={classes.input}
						id="contained-button-file"
						type="file"
						onChange={onChange.bind(null, accept)}
						ref={(input) => {
							this.input = input;
							if (inputRef) inputRef(input);
						}}
					/>
					<label htmlFor="contained-button-file">
						<Button variant="contained" color="primary" component="span">
							{msg}
						</Button>
					</label>
				</div>
			)
		});
	}
}

export default withStyles((theme) => ({
	root: {
		width: '25%',
		minWidth: '100px',
		textAlign: 'center',
		margin: '10px auto',
		height: '50px',
		'& > *': {
			margin: 0
		}
	},
	input: {
		display: 'none'
	}
}))(Upload);
