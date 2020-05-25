import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';

const CardRow = styled.div`
	display: flex;
	justify-content: space-around;
	padding: 3px;
`;

const useStyles = makeStyles((theme) => ({
	root: {
		minWidth: 275
	},
	cardContent: {
		padding: 5,
		'&:last-child': {
			paddingBottom: 10
		}
	},
	title: {
		fontSize: 18,
		textAlign: 'center',
		fontWeight: 'bold',
		backgroundColor: theme.palette.grey[900],
		padding: 5
	},
	cardRowKey: {
		display: 'flex',
		width: '50%',
		justifyContent: 'flex-start'
	},
	cardRowValue: {
		display: 'flex',
		width: '50%',
		justifyContent: 'flex-end'
	}
}));

export default function OutlinedCard({ rows, title }) {
	const classes = useStyles();

	return (
		<Card className={classes.root} variant="outlined">
			<CardContent className={classes.cardContent}>
				<Typography className={classes.title} gutterBottom>
					{title}
				</Typography>
				{rows.map(({ title, text }, index) => (
					<CardRow key={`${title}${text}${index}`}>
						<Typography className={classes.cardRowKey} variant="body1" component="p">
							{title}
						</Typography>
						<Typography className={classes.cardRowValue} variant="body2" component="p">
							{text}
						</Typography>
					</CardRow>
				))}
			</CardContent>
		</Card>
	);
}
