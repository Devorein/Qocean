import React, { Component } from 'react';
import { SketchPicker } from 'react-color';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import { FormLabel, TextField } from '@material-ui/core';
import validateColor from 'validate-color';

import DeletableChip from '../components/Chip/DeletableChip';
import { AppContext } from '../context/AppContext';
import MultiSelect from '../components/Input/MultiSelect';
import RegularChip from '../components/Chip/RegularChip';
import Icon from '../components/Icon/Icon';

const PrevTagSelection = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
`;

const TagContainer = styled.div`
	display: flex;
	justify-content: center;
	height: 50px;
	width: 100%;
`;

class TagCreator extends Component {
	static contextType = AppContext;

	state = {
		tags: this.props.tags || [],
		tagColor: '#000',
		displayColorPicker: false,
		input: '',
		prevTags: null,
		selectedTags: []
	};

	refetchTags = () => {
		axios
			.post(
				`http://localhost:5001/api/v1/users/tags/_/me`,
				{
					uniqueWithColor: true
				},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`
					}
				}
			)
			.then(({ data: { data: prevTags } }) => {
				this.setState({
					prevTags
				});
			});
	};

	componentDidMount() {
		this.refetchTags();
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (
			nextProps.tags.length === 0 ||
			(nextProps.tags.length === this.state.tags.length &&
				nextProps.tags.every((tag, index) => tag === this.state.tags[index]))
		)
			return null;
		else {
			this.setState({
				tags: nextProps.tags
			});
		}
	}

	openCP = () => {
		let { displayColorPicker, input, tagColor, tags } = this.state;
		if (displayColorPicker && input !== '') {
			const tagInput = (input.includes(':') ? input : input + ':') + tagColor;
			const [ status ] = this.validateTags(tagInput);
			if (status) {
				tags.push(tagInput);
				input = '';
			}
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
		let { tags } = this.state;
		tags = tags.filter((tag) => tag.split(':')[0].toLowerCase() !== _tag.toLowerCase());
		this.setState({ tags });
	};

	validateTags = (_tag) => {
		const { changeResponse } = this.context;
		const { tags } = this.state;
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

	resetTags = () => {
		this.setState({
			tags: [],
			input: ''
		});
	};

	createTags = (e) => {
		e.persist();
		if (e.key === 'Enter') {
			e.preventDefault();
			const { tags } = this.state;
			const [ status, message ] = this.validateTags(e.target.value);
			if (status) {
				const tag = e.target.value.toLowerCase();
				tags.push(message === 'default' ? `${tag}:${this.context.user.current_environment.default_tag_color}` : tag);
				this.setState({
					input: '',
					tags
				});
			}
		}
	};

	renderTagCreator = () => {
		const { displayColorPicker, input, tagColor, tags } = this.state;
		const { deleteTags, createTags, openCP } = this;
		const { classes } = this.props;
		return (
			<div className={classes.root} key={'tag_creator'}>
				<FormLabel>Tags</FormLabel>
				<TextField
					type={'text'}
					value={input}
					onChange={(e) => this.setState({ input: e.target.value })}
					onKeyPress={createTags}
					fullWidth
				/>
				<PrevTagSelection>
					<MultiSelect
						label={'Previous Tags'}
						useColoredChip
						selected={this.state.selectedTags}
						handleChange={(e) => {
							this.setState({
								selectedTags: e.target.value
							});
						}}
						items={
							this.state.prevTags ? (
								this.state.prevTags.uniqueWithColor.map((tag) => ({
									name: tag.split(':')[0],
									_id: tag,
									customText: <RegularChip tag={tag} />,
									disabled:
										this.state.tags.includes(tag) ||
										(this.state.tags.length + this.state.selectedTags.length >= 5 &&
											!this.state.selectedTags.includes(tag))
								}))
							) : (
								[]
							)
						}
					/>
					<Icon
						icon={'addbox'}
						onClick={() => {
							this.setState({
								tags: Array.from(new Set(this.state.tags.concat(this.state.selectedTags))),
								selectedTags: []
							});
						}}
						popoverText="Add selected tags"
					/>
				</PrevTagSelection>
				<TagContainer>
					{tags.map((tag, index) => {
						return <DeletableChip key={tag} tag={tag} onDelete={deleteTags} />;
					})}
				</TagContainer>
				<Button onClick={openCP}>{displayColorPicker ? 'Close' : 'Open'} picker</Button>
				{displayColorPicker ? (
					<SketchPicker
						className={classes.sketchPicker}
						disableAlpha
						presetColors={this.state.prevTags.uniqueWithColor.map((tag) => `${tag.split(':')[1]}`)}
						color={tagColor}
						onChangeComplete={this.handleChangeComplete}
					/>
				) : null}
			</div>
		);
	};

	render() {
		const { resetTags, renderTagCreator, refetchTags } = this;

		return this.props.children({
			resetTags,
			tags: this.state.tags,
			TagCreator: renderTagCreator(),
			refetchTags
		});
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
			fontFamily: 'Quantico',
			margin: 3
		}
	},
	sketchPicker: {
		background: `${theme.palette.background.dark} !important`,
		color: theme.palette.text.primary,
		'& input': {
			background: `${theme.palette.background.main} !important`,
			color: theme.palette.text.primary,
			boxShadow: 'inherit !important',
			fontFamily: theme.typography.fontFamily
		},
		'& .flexbox-fix:last-child': {
			background: `${theme.darken(theme.palette.background.dark, 0.25)} !important`,
			borderTop: `0px !important`
		}
	}
}))(TagCreator);
