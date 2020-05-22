import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
	root: {
		width: '25%',
		minWidth: '100px',
		textAlign: 'center',
		margin: '0 auto',
		height: '50px',
		'& > *': {
			margin: theme.spacing(1)
		}
	},
	input: {
		display: 'none'
	}
}));

export default function UploadButton({ setFile }) {
	const classes = useStyles();
	return (
		<div className={classes.root}>
			<input accept="image/*" className={classes.input} id="contained-button-file" type="file" onChange={setFile} />
			<label htmlFor="contained-button-file">
				<Button variant="contained" color="primary" component="span">
					Upload
				</Button>
			</label>
		</div>
	);
}
