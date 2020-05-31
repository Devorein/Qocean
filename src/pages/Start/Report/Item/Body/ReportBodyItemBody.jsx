import React from 'react';
import styled from 'styled-components';
import shortid from 'shortid';
import { withTheme } from '@material-ui/core';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

const ReportBodyItemBody = styled.div`background: ${(props) => props.theme.palette.background.main};`;

export default withTheme(({ stat, theme }) => {
	return (
		<ReportBodyItemBody theme={theme}>
			<TreeView
				defaultCollapseIcon={<ExpandMoreIcon />}
				defaultExpandIcon={<ChevronRightIcon />}
				defaultExpanded={[ '0' ]}
			>
				<TreeItem nodeId="1" label={'Options & Answers'}>
					{stat.options.map((option) => <div key={shortid.generate()}>{option}</div>)}
				</TreeItem>
			</TreeView>
		</ReportBodyItemBody>
	);
});
