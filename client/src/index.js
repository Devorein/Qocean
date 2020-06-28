import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/client';
import { createStore } from 'redux';
import { Provider as ReduxProvider, connect } from 'react-redux';
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
import getPageQueries from './Utils/getPageQueries';
import { AppContext } from './context/AppContext';
import { setPageQueries } from './actions/queries';
import reducers from './reducers';
import middlewares from './middlewares';

import './App.scss';
import './index.css';
import './pages/Pages.scss';

const store = createStore(reducers, middlewares);

class App extends Component {
	componentDidMount() {
		this.props.dispatch(setPageQueries(getPageQueries()));
	}
	render() {
		const { session, location, refetch } = this.props;
		return (
			<Fragment>
				<GlobalCss />
				<div className="App">
					<AppContext.Provider
						value={{
							user: session.user,
							refetchUser: this.props.refetch
						}}
					>
						<Navbar session={session} refetch={refetch} />
						<Switch location={location}>
							<Route path="/" exact component={Home} />
							<Route
								path="/explore/:type"
								render={(e) => {
									return <Explore user={session.user} />;
								}}
							/>
							<Route
								path="/create/:type"
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
								render={() => {
									return session.user ? <Profile user={session.user} refetch={refetch} /> : <Redirect to="/401" />;
								}}
							/>
							<Route
								path="/stats"
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
								render={() => {
									return session.user ? <Inbox user={session.user} /> : <Redirect to="/401" />;
								}}
							/>
							<Route
								path="/upgrade"
								render={() => {
									return session.user ? <Upgrade user={session.user} /> : <Redirect to="/401" />;
								}}
							/>
							<Route
								path="/self/:type"
								render={() => {
									return session.user ? <Self user={session.user} /> : <Redirect to="/401" />;
								}}
							/>
							<Route path="/signin" render={() => <SignIn refetch={refetch} />} />
							<Route path="/signup" render={() => <SignUp refetch={refetch} />} />
							<Route path="/401" component={Unauthorized} />
							<Route path="/404" component={NotFound} />
							<Redirect to="/404" />
						</Switch>
					</AppContext.Provider>
				</div>
			</Fragment>
		);
	}
}

const RoutedApp = withRouter(connect()(App));

const Snackbar = ({ session, refetch }) => {
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
			<RoutedApp session={session} refetch={refetch} />
		</SnackbarProvider>
	);
};

ReactDOM.render(
	<ApolloProvider client={client}>
		<ReduxProvider store={store}>
			<WithSessions>
				{({ session, refetch }) => {
					return (
						<Router>
							<ThemeProvider theme={theme(session.user ? session.user.current_environment : {})}>
								<Snackbar session={session} refetch={refetch} />
							</ThemeProvider>
						</Router>
					);
				}}
			</WithSessions>
		</ReduxProvider>
	</ApolloProvider>,
	document.getElementById('root')
);
