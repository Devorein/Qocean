import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import clsx from 'clsx';

class UploadButton extends React.Component {
	state = {
		files: [],
		data: null
	};

	onChange = (e) => {
		e.persist();
		const { files } = this.state;
		const reader = new FileReader();
		const { files: [ file ] } = e.target;
		delete files[0];
		this.input.value = '';

		reader.onload = (e) => {
			file.text().then((data) => {
				this.setState({ data });
			});
		};
		reader.readAsDataURL(file);
	};

	resetFileInput = () => {
		this.setState({
			data: null,
			files: []
		});
	};

	render() {
		const { inputRef, msg = 'Upload', accept = 'image/*', classes } = this.props;
		const classNames = clsx(classes.root, 'upload_button');
		const { onChange } = this;

		return this.props.children({
			data: this.state.data,
			UploadButton: (
				<div className={classNames}>
					<input
						accept={accept}
						className={classes.input}
						id="contained-button-file"
						type="file"
						onChange={onChange}
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
}))(UploadButton);
