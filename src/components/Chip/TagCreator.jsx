import React, { Component } from 'react';

import { AppContext } from '../../context/AppContext';

import DeletableChip from './DeletableChip';
import { withStyles } from '@material-ui/core/styles';
import validateColor from 'validate-color';
import { FormLabel, TextField } from '@material-ui/core';

class TagCreator extends Component {
	static contextType = AppContext;

	state = {
		tags: this.props.tags || []
	};

	deleteTags = (_tag) => {
		let { tags } = this.state;
		tags = tags.filter((tag) => tag.split(':')[0].toLowerCase() !== _tag.toLowerCase());
		this.setState({
			tags
		});
	};

	validateTags = (_tag) => {
		const { changeResponse } = this.context;
		const { tags } = this.state;
		const isPresent = tags.find((tag) => tag.split(':')[0].toLowerCase() === _tag.split(':')[0].toLowerCase());
		const tagsSeparator = _tag.split(':');
		if (tags.length >= 5) {
			changeResponse(`An error occurred`, `You've added the maximum number of tags`, 'error');
			return false;
		} else if (tagsSeparator[0].length >= 16) {
			changeResponse(`An error occurred`, `You cant add a tag that's more than 16 characters long`, 'error');
			return false;
		} else if (tagsSeparator.length === 1) {
			changeResponse(`An error occurred`, `You've entered a partial tag, using default color`, 'warning');
			return true;
		} else if (tagsSeparator[1] === '') {
			changeResponse(`An error occurred`, `You've not supplied a color, using default color`, 'warning');
			return true;
		} else if (!validateColor(tagsSeparator[1])) {
			changeResponse(`An error occurred`, `You've supplied an invalid color`, 'error');
			return false;
		} else if (tagsSeparator.length > 2) {
			changeResponse(`An error occurred`, `Your tag is malformed, check it again`, 'error');
			return false;
		}
		if (isPresent) {
			changeResponse(
				`An error occurred`,
				`Tag with name ${_tag.split(':')[0].toLowerCase()} has already been added`,
				'error'
			);
			return false;
		} else return true;
	};

	createTags = (e) => {
		e.persist();
		if (e.key === 'Enter') {
			e.preventDefault();
			const { tags } = this.state;
			if (this.validateTags(e.target.value)) {
				tags.push(e.target.value.toLowerCase());
				e.target.value = '';
				this.setState({
					tags
				});
			}
		}
	};

	render() {
		const { deleteTags, createTags } = this;
		const { classes } = this.props;
		const { tags } = this.state;

		return (
			<div className={classes.root}>
				<FormLabel>Tags</FormLabel>
				<TextField type={'text'} onKeyPress={createTags} fullWidth />
				{tags.map((tag) => {
					return <DeletableChip key={tag} tag={tag} onDelete={deleteTags} />;
				})}
			</div>
		);
	}
}

export default withStyles((theme) => ({
	root: {
		display: 'flex',
		justifyContent: 'center',
		flexWrap: 'wrap',
		'& > *': {
			margin: theme.spacing(0.5)
		},
		'& .MuiChip-root': {
			borderRadius: 3,
			fontFamily: 'Quantico'
		}
	}
}))(TagCreator);
