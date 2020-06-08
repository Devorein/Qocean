import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import CheckboxInput from '../../../Input/Checkbox/CheckboxInput';
import './BoardDisplayer.scss';

class BoardDisplayer extends Component {
	renderBoardDisplayer = () => {
		const { type, data, classes, setChecked } = this.props;
		return data.map((item, index) => {
			return (
				<div className={`BoardDisplayer_item ${classes.BoardDisplayer_item}`} key={item._id}>
					<CheckboxInput onChange={setChecked.bind(null, index)} checked={item.checked} />
					<div className="BoardDisplayer_item_container BoardDisplayer_item_container-actions">{item.actions}</div>
					{[ 'primary', 'secondary', 'tertiary' ].map((key, index) => {
						return (
							<div
								key={`${type}${key}${index}`}
								className={`BoardDisplayer_item_container BoardDisplayer_item_container-${key}`}
							>
								{Object.entries(item[key]).map(([ key, val ], index) => (
									<span
										key={`${type}${key}${index}`}
										className={`BoardDisplayer_item_container_item BoardDisplayer_item_container-${key}_item`}
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
		return <div className="BoardDisplayer">{this.renderBoardDisplayer()}</div>;
	}
}

export default withStyles((theme) => ({
	BoardDisplayer_item: {
		backgroundColor: theme.palette.background.main
	}
}))(BoardDisplayer);
