import React, { Component } from 'react';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormGroup from '@material-ui/core/FormGroup';
import shortid from 'shortid';
import CheckboxInput from './CheckboxInput';

const CheckboxGroup_id = shortid.generate();

class CheckboxGroup extends Component {
	state = {
		expanded: this.props.extra.collapsed ? [] : [ '1' ]
	};
	render() {
		const { name, extra, children, onChange, values } = this.props;
		const { useArray = false, row = false, helperText = '', errorText = '' } = extra;
		const FORMGROUP = (
			<FormGroup row={row}>
				{children.map((child, index) => {
					const value = values[useArray ? index : child.name];
					return (
						<CheckboxInput
							key={`${child.name}${index}`}
							checked={typeof value === 'boolean' ? value : false}
							label={child.label}
							name={child.name}
							onChange={useArray ? onChange.bind(null, index) : onChange}
						/>
					);
				})}
			</FormGroup>
		);

		return (
			<div key={CheckboxGroup_id}>
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