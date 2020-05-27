import React, { Component } from 'react';
import { SketchPicker } from 'react-color';
import Button from '@material-ui/core/Button';
import { AppContext } from '../../context/AppContext';
import styled from 'styled-components';
import DeletableChip from './DeletableChip';
import { withStyles } from '@material-ui/core/styles';
import validateColor from 'validate-color';
import { FormLabel, TextField } from '@material-ui/core';

const TagContainer = styled.div`
	display: flex;
	justify-content: center;
	height: 50px;
	width: 100%;
`;
class TagCreator extends Component {
	static contextType = AppContext;

	state = {
		tagColor: '#000',
		displayColorPicker: false,
		input: ''
	};

	openCP = () => {
		let { displayColorPicker, input, tagColor } = this.state;
		let { tags } = this.props;
		if (displayColorPicker) {
			tags.push((input.includes(':') ? input : input + ':') + tagColor);
			input = '';
		}
		this.setState({
			input,
			displayColorPicker: !displayColorPicker,
			tags
		});
	};

	handleChangeComplete = (color) => {
		this.setState({ tagColor: color.hex });
	};

	deleteTags = (_tag) => {
		let { tags } = this.props;
		tags = tags.filter((tag) => tag.split(':')[0].toLowerCase() !== _tag.toLowerCase());
		this.props.setTags(tags);
		// this.setState({
		// 	tags
		// },()=>{

		// });
	};

	validateTags = (_tag) => {
		const { changeResponse } = this.context;
		const { tags } = this.props;
		const isPresent = tags.find((tag) => tag.split(':')[0].toLowerCase() === _tag.split(':')[0].toLowerCase());
		const tagsSeparator = _tag.split(':');
		if (isPresent) {
			changeResponse(
				`An error occurred`,
				`Tag with name ${_tag.split(':')[0].toLowerCase()} has already been added`,
				'error'
			);
			return [ false ];
		}
		if (tags.length >= 5) {
			changeResponse(`An error occurred`, `You've added the maximum number of tags`, 'error');
			return [ false ];
		} else if (tagsSeparator[0].length >= 16) {
			changeResponse(`An error occurred`, `You cant add a tag that's more than 16 characters long`, 'error');
			return [ false ];
		} else if (tagsSeparator.length === 1) {
			changeResponse(`An error occurred`, `You've entered a partial tag, using default color`, 'warning');
			return [ true, 'default' ];
		} else if (tagsSeparator[1] === '') {
			changeResponse(`An error occurred`, `You've not supplied a color, using default color`, 'warning');
			return [ true, 'default' ];
		} else if (!validateColor(tagsSeparator[1])) {
			changeResponse(`An error occurred`, `You've supplied an invalid color`, 'error');
			return [ false ];
		} else if (tagsSeparator.length > 2) {
			changeResponse(`An error occurred`, `Your tag is malformed, check it again`, 'error');
			return [ false ];
		} else return [ true ];
	};

	createTags = (e) => {
		e.persist();
		if (e.key === 'Enter') {
			e.preventDefault();
			const { tags } = this.props;
			const [ status, message ] = this.validateTags(e.target.value);
			if (status) {
				const tag = e.target.value.toLowerCase();
				tags.push(message === 'default' ? `${tag}:${this.context.user.current_environment.default_tag_color}` : tag);
				this.setState(
					{
						input: ''
					},
					() => {
						this.props.setTags(tags);
					}
				);
			}
		}
	};

	render() {
		const { deleteTags, createTags, openCP } = this;
		const { classes, tags } = this.props;
		const { displayColorPicker, input, tagColor } = this.state;

		return (
			<div className={classes.root}>
				<FormLabel>Tags</FormLabel>
				<TextField
					type={'text'}
					value={input}
					onChange={(e) => this.setState({ input: e.target.value })}
					onKeyPress={createTags}
					fullWidth
				/>
				<TagContainer>
					{tags.map((tag) => {
						return <DeletableChip key={tag} tag={tag} onDelete={deleteTags} />;
					})}
				</TagContainer>
				<Button onClick={openCP}>{displayColorPicker ? 'Close' : 'Open'} picker</Button>
				{displayColorPicker ? (
					<SketchPicker disableAlpha presetColors={[]} color={tagColor} onChangeComplete={this.handleChangeComplete} />
				) : null}
			</div>
		);
	}
}

export default withStyles((theme) => ({
	root: {
		display: 'flex',
		justifyContent: 'center',
		flexWrap: 'wrap',
		'& .sketch-picker': {
			position: 'absolute',
			left: '100%',
			'& input': {
				textAlign: 'center'
			}
		},
		'& > *': {
			margin: theme.spacing(0.5)
		},
		'& .MuiChip-root': {
			borderRadius: 3,
			fontFamily: 'Quantico'
		}
	}
}))(TagCreator);
