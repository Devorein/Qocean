import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';

import { SnackbarProvider } from 'notistack';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from './theme';
import Navbar from './components/Navbar/Navbar';
import WithSessions from './components/Auth/WithSessions.jsx';
import SignIn from './pages/Signin/SignIn.jsx';
import SignUp from './pages/Signup/SignUp.jsx';
import Explore from './pages/Explore/Explore';
import Create from './pages/Create/Create';
import Self from './pages/Self/Self';
import Watchlist from './pages/Watchlist/Watchlist';
import Home from './pages/Home/Home';
import Import from './pages/Import/Import';
import Detail from './pages/Detail/Detail';
import Profile from './pages/Profile/Profile';
import Stats from './pages/Stats/Stats';
import Play from './pages/Play/Play';
import Report from './pages/Report/Report';
import Inbox from './pages/Inbox/Inbox';
import Upgrade from './pages/Upgrade/Upgrade';
import Unauthorized from './pages/401/Unauthorized';
import NotFound from './pages/404/NotFound';
import { BrowserRouter as Router, Switch, Route, Redirect, withRouter } from 'react-router-dom';
import GlobalCss from './Utils/Globalcss';
import { AppContext } from './context/AppContext';
import './App.scss';
import './index.css';
import './pages/Pages.scss';

class App extends Component {
	render() {
		const { session, location, refetch, updateUserLocally } = this.props;
		return (
			<Fragment>
				<GlobalCss />
				<div className="App">
					<AppContext.Provider
						value={{
							user: session.data ? session.data.data : null,
							refetchUser: this.props.refetch,
							updateUserLocally
						}}
					>
						<Navbar session={session} refetch={refetch} />
						<Switch location={location}>
							<Route path="/" exact component={Home} />
							<Route
								path="/explore/:type"
								exact
								render={(e) => {
									return <Explore user={session.data ? session.data.data : null} />;
								}}
							/>
							<Route
								path="/detail/:type/:id"
								exact
								render={(e) => {
									return <Detail user={session.data.data} />;
								}}
							/>
							<Route
								path="/create/:type"
								exact
								render={({ history, match }) => {
									return session.data ? (
										<Create user={session.data.data} match={match} history={history} />
									) : (
										<Redirect to="/401" />
									);
								}}
							/>
							<Route
								path="/import/:type"
								exact
								render={({ history, match }) => {
									return session.data ? (
										<Import user={session.data.data} match={match} history={history} />
									) : (
										<Redirect to="/401" />
									);
								}}
							/>
							<Route
								path="/watchlist/:type"
								exact
								render={({ history, match }) => {
									return session.data ? (
										<Watchlist user={session.data.data} match={match} history={history} />
									) : (
										<Redirect to="/401" />
									);
								}}
							/>
							<Route
								path="/play"
								exact
								render={() => {
									return session.data ? <Play user={session.data.data} /> : <Redirect to="/401" />;
								}}
							/>
							<Route
								path="/profile"
								exact
								render={() => {
									return session.data ? <Profile user={session.data.data} refetch={refetch} /> : <Redirect to="/401" />;
								}}
							/>
							<Route
								path="/stats"
								exact
								render={() => {
									return session.data ? <Stats user={session.data.data} /> : <Redirect to="/401" />;
								}}
							/>
							<Route
								path="/report"
								exact
								render={() => {
									return session.data ? <Report user={session.data.data} /> : <Redirect to="/401" />;
								}}
							/>
							<Route
								path="/inbox"
								exact
								render={() => {
									return session.data ? <Inbox user={session.data.data} /> : <Redirect to="/401" />;
								}}
							/>
							<Route
								path="/upgrade"
								exact
								render={() => {
									return session.data ? <Upgrade user={session.data.data} /> : <Redirect to="/401" />;
								}}
							/>
							<Route
								path="/self/:type"
								exact
								render={() => {
									return session.data ? <Self user={session.data.data} /> : <Redirect to="/401" />;
								}}
							/>
							<Route path="/signin" exact render={() => <SignIn refetch={refetch} />} />
							<Route path="/signup" exact render={() => <SignUp refetch={refetch} />} />
							<Route path="/401" exact component={Unauthorized} />
							<Route path="/404" exact component={NotFound} />
							<Redirect to="/404" />
						</Switch>
					</AppContext.Provider>
				</div>
			</Fragment>
		);
	}
}

const RoutedApp = withRouter(App);

const Snackbar = ({ session, refetch, updateUserLocally }) => {
	const userStyles = makeStyles((theme) => {
		return {
			variantError: {
				background: theme.palette.error.main
			},
			variantSuccess: {
				background: theme.palette.success.main
			},
			variantWarning: {
				background: theme.palette.warning.main
			}
		};
	});

	const { variantError, variantSuccess, variantWarning } = userStyles();

	return (
		<SnackbarProvider
			maxSnack={session.data ? session.data.data.current_environment.max_notifications : 3}
			autoHideDuration={session.data ? session.data.data.current_environment.notification_timing : 2500}
			classes={{
				variantError,
				variantSuccess,
				variantWarning
			}}
		>
			<CssBaseline />
			<RoutedApp session={session} refetch={refetch} updateUserLocally={updateUserLocally} />
		</SnackbarProvider>
	);
};

ReactDOM.render(
	<WithSessions>
		{({ session, refetch, updateUserLocally }) => {
			return (
				<Router>
					<ThemeProvider theme={theme(session.data ? session.data.data.current_environment : {})}>
						<Snackbar session={session} refetch={refetch} updateUserLocally={updateUserLocally} />
					</ThemeProvider>
				</Router>
			);
		}}
	</WithSessions>,
	document.getElementById('root')
);
