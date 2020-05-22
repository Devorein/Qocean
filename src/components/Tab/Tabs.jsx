import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

const useStyles = makeStyles({
	tabs: {
		height: (props) => props.height,
		'& .MuiTabs-flexContainer': {
			height: '100%'
		}
	},
	tab: {
		borderRadius: 3,
		padding: '0 10px',
		'&.MuiButtonBase-root': {
			margin: 0,
			minHeight: (props) => props.height
		}
	}
});

function CustomTabs(props) {
	const { headers, height = 50 } = props;
	const { tabs, tab } = useStyles({ height });
	return (
		<Tabs {...props} textColor="primary" indicatorColor="primary" centered classes={{ root: tabs }}>
			{headers.map(({ name, icon }) => <Tab classes={{ root: tab }} key={name} label={name} icon={icon} />)}
		</Tabs>
	);
}

CustomTabs.muiName = 'CustomTabs';

export default CustomTabs;
