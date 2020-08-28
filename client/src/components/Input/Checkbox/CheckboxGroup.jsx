import React, { Component } from 'react';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormGroup from '@material-ui/core/FormGroup';

import CheckboxInput from './CheckboxInput';

class CheckboxGroup extends Component {
	state = {
		expanded: this.props.extra.collapsed ? [] : [ '1' ]
	};
	render () {
		const { name, extra, children, onChange, values } = this.props;
		const { useIndex = false, row = false, helperText = '', errorText = '', className = '' } = extra;
		const FORMGROUP = (
			<FormGroup row={row}>
				{children.map((child, index) => {
					const value = values[useIndex ? index : child.name];
					return (
						<CheckboxInput
							key={`${child.name}${index}`}
							checked={typeof value === 'boolean' ? value : false}
							label={child.label}
							name={child.name}
							onChange={useIndex ? onChange.bind(null, index) : onChange}
						/>
					);
				})}
			</FormGroup>
		);

		return (
			<div className={className}>
				<div>{name.split('_').map((chunk) => chunk.charAt(0).toUpperCase() + chunk.substr(1)).join(' ')}</div>
				{helperText !== '' ? <FormHelperText>{helperText}</FormHelperText> : null}
				{errorText !== '' ? <FormHelperText error={true}>{errorText}</FormHelperText> : null}
				{extra.treeView ? (
					<TreeView
						defaultCollapseIcon={<ExpandMoreIcon />}
						defaultExpandIcon={<ChevronRightIcon />}
						expanded={this.state.expanded}
						onNodeToggle={(e, nodeIds) => this.setState({ expanded: nodeIds })}
					>
						<TreeItem nodeId="1" label={this.state.expanded.length === 0 ? 'Expand' : 'Collapse'}>
							{FORMGROUP}
						</TreeItem>
					</TreeView>
				) : (
					FORMGROUP
				)}
			</div>
		);
	}
}

export default CheckboxGroup;
