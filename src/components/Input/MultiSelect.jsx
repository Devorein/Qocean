import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import RegularChip from '../../components/Chip/RegularChip';
import Switch from '@material-ui/core/Switch';

const useStyles = makeStyles(() => ({
	chips: {
		display: 'flex',
		flexWrap: 'wrap',
		'& .MuiChip-root': {
			borderRadius: 5,
			fontFamily: 'Quantico',
			color: '#ddd',
			background: '#2d2d2d'
		}
	},
	chip: {
		margin: 2
	},
	switch: {
		'& .MuiSwitch-thumb': {
			width: '17px',
			height: '17px',
			top: '-3px',
			position: 'relative'
		}
	},
	MenuItem: {
		'&.MuiListItem-root.Mui-selected': {
			background: 'inherit'
		}
	}
}));

export default function MultiSelect({
	label,
	selected,
	handleChange,
	items,
	useColoredChip = false,
	customChipRenderer = false,
	disabled = false,
	name = '',
	useSwitch = false,
	className,
	customRenderValue
}) {
	const classes = useStyles();
	return (
		<FormControl fullWidth>
			<InputLabel>{label}</InputLabel>
			<Select
				className={className}
				name={name}
				disabled={disabled}
				multiple
				value={selected}
				onChange={handleChange}
				input={<Input id="select-multiple-chip" />}
				renderValue={(selected) => {
					return customRenderValue ? (
						customRenderValue(selected)
					) : (
						<div className={classes.chips}>
							{selected.map(
								(value) =>
									useColoredChip ? (
										<RegularChip className={classes.chip} key={value} tag={value} />
									) : customChipRenderer ? (
										customChipRenderer(value)
									) : (
										<Chip
											className={classes.chip}
											key={value}
											label={items ? items.find(({ _id, name }) => _id === value).name : ''}
										/>
									)
							)}
						</div>
					);
				}}
			>
				{items.map(({ name, _id, customText, disabled }, index) => (
					<MenuItem key={_id} value={_id} disabled={disabled} className={classes.MenuItem}>
						{!useSwitch ? (
							<Checkbox name={name} checked={selected.indexOf(_id) > -1} />
						) : (
							<Switch name={name} className={classes.switch} checked={selected.includes(_id)} color="primary" />
						)}

						{customText ? customText : <ListItemText primary={name} />}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
}
