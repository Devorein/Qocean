import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import CheckboxInput from '../../../Input/Checkbox/CheckboxInput';

import './ListDisplayer.scss';
class ListDisplayer extends Component {
	renderListDisplayer = () => {
		const { type, data, classes } = this.props;
		return data.map((item) => {
			return (
				<div className={`ListDisplayer_item ${classes.ListDisplayer_item}`} key={item._id}>
					<CheckboxInput
						onChange={(e) => {
							console.log(e.target.checked);
						}}
						checked={true}
					/>
					{[ 'primary', 'secondary', 'tertiary' ].map((key, index) => {
						return (
							<div
								key={`${type}${key}${index}`}
								className={`ListDisplayer_item_container ListDisplayer_item_container-${key}`}
							>
								{Object.entries(item[key]).map(([ key, val ], index) => (
									<span
										key={`${type}${key}${index}`}
										className={`ListDisplayer_item_container_item ListDisplayer_item_container-${key}_item`}
									>
										{val}
									</span>
								))}
							</div>
						);
					})}
				</div>
			);
		});
	};
	render() {
		return <div className="ListDisplayer">{this.renderListDisplayer()}</div>;
	}
}

export default withStyles((theme) => ({
	ListDisplayer_item: {
		backgroundColor: theme.palette.background.main
	}
}))(ListDisplayer);
