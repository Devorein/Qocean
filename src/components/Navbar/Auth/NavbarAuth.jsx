import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Menu, MenuItem } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { orange } from '@material-ui/core/colors';
import Avatar from '@material-ui/core/Avatar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import HomeIcon from '@material-ui/icons/Home';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import ExploreIcon from '@material-ui/icons/Explore';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import ImageIcon from '@material-ui/icons/Image';
import FaceIcon from '@material-ui/icons/Face';

const useStyles = makeStyles({
	paper: {
		backgroundColor: '#1a1a1a',
		color: 'rgba(255, 255, 255, 0.87)',
		'& .MuiMenuItem-root': {
			display: 'flex',
			justifyContent: 'center',
			fontFamily: 'Quantico',
			'&:hover': {
				backgroundColor: '#333'
			}
		}
	}
});

const CustomButtom = withStyles((theme) => ({
	root: {
		fontFamily: 'Quantico',
		fontWeight: 'bold',
		color: '#ddd',
		backgroundColor: '#1a1a1a',
		'&:hover': {
			backgroundColor: orange[500]
		}
	}
}))(Button);

function NavbarAuth({ session, refetch, history, match, location }) {
	const { paper } = useStyles();

	const logout = () => {
		localStorage.removeItem('token');
		history.push('/');
		refetch();
	};

	const switchPage = (page) => {
		history.push(`/${page}`);
		setAnchorEl(null);
	};

	const [ anchorEl, setAnchorEl ] = React.useState(null);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const headers = [
		{ name: 'home', link: '', icon: <HomeIcon /> },
		{ name: 'create', link: 'create/Quiz', icon: <NoteAddIcon /> },
		{ name: 'explore', link: 'explore', icon: <ExploreIcon /> },
		{ name: 'play', link: 'play', icon: <PlayCircleFilledIcon /> }
	];
	const index = headers.findIndex(({ name }) => name === location.pathname.replace(/\//g, '\\').split('\\')[1]);
	return (
		<Fragment>
			<Tabs
				value={index === -1 ? 0 : index}
				onChange={(e, value) => {
					switchPage(headers[value].link);
				}}
				indicatorColor="primary"
				textColor="primary"
				centered
			>
				{headers.map(({ name, icon }) => <Tab key={name} label={name} icon={icon} />)}
			</Tabs>
			<div className="user-links">
				{session.data.data.image !== 'none.png' ? (
					<Avatar variant="square" alt="Username" src={session.data.data.image} />
				) : (
					<Avatar variant="square" alt="Username">
						<ImageIcon />
					</Avatar>
				)}

				<span className="navbar-link-item navbar-link-item--username" onClick={handleClick}>
					{session.data.data.username}
				</span>
			</div>
			<Menu
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={handleClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center'
				}}
				getContentAnchorEl={null}
				classes={{ paper }}
			>
				<MenuItem onClick={switchPage.bind(null, 'profile')}>
					<AccountBoxIcon />
					Profile
				</MenuItem>
				<MenuItem onClick={switchPage.bind(null, 'stats')}>
					<EqualizerIcon />
					Stats
				</MenuItem>
				<MenuItem onClick={switchPage.bind(null, 'self')}>
					<FaceIcon />
					Self
				</MenuItem>
				<MenuItem onClick={logout}>
					<CustomButtom variant="contained" size="large" startIcon={<ExitToAppIcon />}>
						Logout
					</CustomButtom>
				</MenuItem>
			</Menu>
		</Fragment>
	);
}

export default withRouter(NavbarAuth);
