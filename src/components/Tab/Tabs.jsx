import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

const useStyles = makeStyles({
	tabs: {
		height: 25,
		'& .MuiTabs-flexContainer': {
			height: '100%'
		}
	},
	tab: {
		borderRadius: 3,
		padding: '0 10px',
		'&.MuiButtonBase-root': {
			margin: 0,
			minHeight: 25
		}
	}
});

function CustomTabs(props) {
	const { headers } = props;
	const { tabs, tab } = useStyles();
	return (
		<Tabs {...props} classes={{ root: tabs }}>
			{headers.map(({ name, icon }) => <Tab classes={{ root: tab }} key={name} label={name} icon={icon} />)}
		</Tabs>
	);
}

CustomTabs.muiName = 'CustomTabs';

export default CustomTabs;
