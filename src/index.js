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
import Home from './pages/Home/Home';
import Export from './pages/Export/Export';
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
import CustomSnackbars from './components/Snackbars/CustomSnackbars';
import GlobalCss from './Utils/Globalcss';
import { AppContext } from './context/AppContext';
import submitForm from './operations/submitForm';
import updateResource from './operations/updateResource';
import setEnvAsCurrent from './operations/setEnvAsCurrent';
import './App.scss';
import './index.css';
import './pages/Pages.scss';

class App extends Component {
	state = {
		response: {
			severity: null,
			message: null,
			title: null,
			isOpen: false
		}
	};

	changeResponse = (title, message, severity, isOpen = true) => {
		this.setState({
			response: {
				title,
				message,
				severity,
				isOpen
			}
		});
	};

	submitForm = ([ type, preSubmit, postSubmit ], values, { setSubmitting, resetForm }) => {
		type = type.toLowerCase();
		const { reset_on_success, reset_on_error } = this.props.session.data.data.current_environment;
		let canSubmit = true;
		if (preSubmit) {
			let [ transformedValue, shouldSubmit ] = preSubmit(values);
			values = transformedValue;
			canSubmit = shouldSubmit;
		}
		if (canSubmit) {
			submitForm(type, values)
				.then((data) => {
					if (reset_on_success) resetForm();
					setSubmitting(true);
					setTimeout(() => {
						setSubmitting(false);
					}, 2500);
					this.changeResponse(`Success`, `Successsfully created ${type} ${values.name}`, 'success');
					if (postSubmit) postSubmit(data);
					if (type.toLowerCase() === 'environment' && values.set_as_current) {
						setEnvAsCurrent(data.data.data._id).then(() => {
							this.props.refetch();
						});
					}
				})
				.catch((err) => {
					if (reset_on_error) resetForm();
					setSubmitting(true);
					setTimeout(() => {
						setSubmitting(false);
					}, 2500);
					this.changeResponse(
						`An error occurred`,
						err.response.data ? err.response.data.error : `Failed to create ${type}`,
						'error'
					);
					if (postSubmit) postSubmit(err);
				});
		} else {
			setSubmitting(true);
			setTimeout(() => {
				setSubmitting(false);
			}, 2500);
		}
	};

	updateResource = (id, refetchData, [ type, preSubmit, postSubmit ], values, { setSubmitting, resetForm }) => {
		type = type.toLowerCase();
		const { reset_on_success, reset_on_error } = this.props.session.data.data.current_environment;
		let canSubmit = true;
		if (preSubmit) {
			let [ transformedValue, shouldSubmit ] = preSubmit(values);
			values = transformedValue;
			canSubmit = shouldSubmit;
		}
		if (canSubmit) {
			updateResource(type, id, values)
				.then((data) => {
					if (reset_on_success) resetForm();
					setSubmitting(true);
					setTimeout(() => {
						setSubmitting(false);
					}, 2500);
					this.changeResponse(`Success`, `Successsfully updated ${type} ${values.name}`, 'success');
					if (postSubmit) postSubmit(data);
					if (type.toLowerCase() === 'environment' && values.set_as_current) {
						setEnvAsCurrent(data.data.data._id).then(() => {
							this.props.refetch();
						});
					}
					refetchData();
				})
				.catch((err) => {
					if (reset_on_error) resetForm();
					setSubmitting(true);
					setTimeout(() => {
						setSubmitting(false);
					}, 2500);
					console.log(err);
					this.changeResponse(
						`An error occurred`,
						err.response.data ? err.response.data.error : `Failed to update ${type}`,
						'error'
					);
					if (postSubmit) postSubmit(err);
				});
		} else {
			setSubmitting(true);
			setTimeout(() => {
				setSubmitting(false);
			}, 2500);
		}
	};

	render() {
		const { changeResponse, submitForm, updateResource } = this;
		const { session, location, refetch } = this.props;
		const { response: { isOpen, message, severity, title } } = this.state;
		return (
			<Fragment>
				<GlobalCss />
				<div className="App">
					<AppContext.Provider
						value={{
							changeResponse,
							submitForm,
							updateResource,
							user: session.data ? session.data.data : null,
							refetchUser: this.props.refetch
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
								path="/export/:type"
								exact
								render={({ history, match }) => {
									return session.data ? (
										<Export user={session.data.data} match={match} history={history} />
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
						<CustomSnackbars
							title={title}
							message={message}
							severity={severity}
							isOpen={isOpen}
							changeResponse={this.changeResponse}
							timing={session.data ? session.data.data.current_environment.notification_timing : 2500}
						/>
					</AppContext.Provider>
				</div>
			</Fragment>
		);
	}
}

const RoutedApp = withRouter(App);

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
			maxSnack={session.data ? session.data.data.current_environment.max_notifications : 3}
			autoHideDuration={session.data ? session.data.data.current_environment.notification_timing : 2500}
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
	<WithSessions>
		{({ session, refetch }) => {
			return (
				<Router>
					<ThemeProvider theme={theme(session.data ? session.data.data.current_environment : {})}>
						<Snackbar session={session} refetch={refetch} />
					</ThemeProvider>
				</Router>
			);
		}}
	</WithSessions>,
	document.getElementById('root')
);
