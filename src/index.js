import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/client';

import { SnackbarProvider } from 'notistack';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';

import client from './client';
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
							user: session.user,
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
									return <Explore user={session.user} />;
								}}
							/>
							<Route
								path="/create/:type"
								exact
								render={({ history, match }) => {
									return session.user ? (
										<Create user={session.user} match={match} history={history} />
									) : (
										<Redirect to="/401" />
									);
								}}
							/>
							<Route
								path="/import/:type"
								exact
								render={({ history, match }) => {
									return session.user ? (
										<Import user={session.user} match={match} history={history} />
									) : (
										<Redirect to="/401" />
									);
								}}
							/>
							<Route
								path="/watchlist/:type"
								exact
								render={({ history, match }) => {
									return session.user ? (
										<Watchlist user={session.user} match={match} history={history} />
									) : (
										<Redirect to="/401" />
									);
								}}
							/>
							<Route
								path="/play"
								render={() => {
									return session.user ? <Play user={session.user} /> : <Redirect to="/401" />;
								}}
							/>
							<Route
								path="/profile"
								exact
								render={() => {
									return session.user ? <Profile user={session.user} refetch={refetch} /> : <Redirect to="/401" />;
								}}
							/>
							<Route
								path="/stats"
								exact
								render={() => {
									return session.user ? <Stats user={session.user} /> : <Redirect to="/401" />;
								}}
							/>
							<Route
								path="/report"
								exact
								render={() => {
									return session.user ? <Report user={session.user} /> : <Redirect to="/401" />;
								}}
							/>
							<Route
								path="/inbox"
								exact
								render={() => {
									return session.user ? <Inbox user={session.user} /> : <Redirect to="/401" />;
								}}
							/>
							<Route
								path="/upgrade"
								exact
								render={() => {
									return session.user ? <Upgrade user={session.user} /> : <Redirect to="/401" />;
								}}
							/>
							<Route
								path="/self/:type"
								exact
								render={() => {
									return session.user ? <Self user={session.user} /> : <Redirect to="/401" />;
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
			maxSnack={session.user ? session.user.current_environment.max_notifications : 3}
			autoHideDuration={session.user ? session.user.current_environment.notification_timing : 2500}
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
	<ApolloProvider client={client}>
		<WithSessions>
			{({ session, refetch, updateUserLocally }) => {
				return (
					<Router>
						<ThemeProvider theme={theme(session.user ? session.user.current_environment : {})}>
							<Snackbar session={session} refetch={refetch} updateUserLocally={updateUserLocally} />
						</ThemeProvider>
					</Router>
				);
			}}
		</WithSessions>
	</ApolloProvider>,
	document.getElementById('root')
);
