import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
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
}));

export default function UploadButton({ setFile, inputRef, msg, accept }) {
	msg = msg ? msg : 'Upload';
	accept = accept ? accept : 'image/*';
	const classes = useStyles();
	const classNames = clsx(classes.root, 'upload_button');
	return (
		<div className={classNames}>
			<input
				accept={accept}
				className={classes.input}
				id="contained-button-file"
				type="file"
				onChange={setFile}
				ref={(input) => {
					if (inputRef) inputRef(input);
				}}
			/>
			<label htmlFor="contained-button-file">
				<Button variant="contained" color="primary" component="span">
					{msg}
				</Button>
			</label>
		</div>
	);
}
