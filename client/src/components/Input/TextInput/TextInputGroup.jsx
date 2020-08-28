import React, { Component } from 'react';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormGroup from '@material-ui/core/FormGroup';
import TextInput from './TextInput';

class TextInputGroup extends Component {
	state = {
		expanded: this.props.extra.collapsed ? [] : [ '1' ]
	};

	render () {
		const { name, extra, children, onChange, values, errors = {}, label } = this.props;
		const { row = false, helperText = '', errorText = '', className = '' } = extra;
		const FORMGROUP = (
			<FormGroup row={row}>
				{children.map((child, index) => {
					const child_name = child.name.split('.');
					return (
						<TextInput
							errorText={errors[child.name]}
							key={`${child.name}${index}`}
							value={values[child.name]}
							label={child.label}
							name={child_name[child_name.length - 1]}
							onChange={onChange.bind(null, child.name)}
						/>
					);
				})}
			</FormGroup>
		);

		return (
			<div className={className}>
				<div>{label || name.split('_').map((chunk) => chunk.charAt(0).toUpperCase() + chunk.substr(1)).join(' ')}</div>
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

export default TextInputGroup;
