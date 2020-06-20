import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Icon from '../../components/Icon/Icon';

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
	const { headers, onChange, height = 50, against, addIcon = true } = props;
	const value = headers.findIndex(({ name }) => name.toLowerCase() === against.toLowerCase());
	const { tabs, tab } = useStyles({ height });
	return (
		<Tabs
			value={value === -1 ? 0 : value}
			onChange={onChange}
			textColor="primary"
			indicatorColor="primary"
			centered
			classes={{ root: tabs }}
		>
			{headers.map(({ name, icon }) => (
				<Tab
					classes={{ root: tab }}
					key={name}
					label={name.split('_').map((chunk) => chunk.charAt(0).toUpperCase() + chunk.substr(1)).join(' ')}
					icon={addIcon ? <Icon icon={name.includes('_') ? name.split('_')[1] : name} /> : icon}
				/>
			))}
		</Tabs>
	);
}

CustomTabs.muiName = 'CustomTabs';

export default CustomTabs;
