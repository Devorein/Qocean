import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';

import Navbar from './components/Navbar/Navbar';
import WithSessions from './components/Auth/WithSessions.jsx';
import SignIn from './pages/Signin/SignIn.jsx';
import SignUp from './pages/Signup/SignUp.jsx';
import Explore from './pages/Explore/Explore';
import Create from './pages/Create/Create';
import Self from './pages/Self/Self';
import Home from './pages/Home/Home';
import Detail from './pages/Detail/Detail';
import Profile from './pages/Profile/Profile';
import Stats from './pages/Stats/Stats';
import Play from './pages/Play/Play';
import Unauthorized from './pages/401/Unauthorized';
import NotFound from './pages/404/NotFound';
import { BrowserRouter as Router, Switch, Route, Redirect, withRouter } from 'react-router-dom';
import CustomSnackbars from './components/Snackbars/CustomSnackbars';
import GlobalCss from './Utils/Globalcss';

import './App.scss';
import './index.css';
import './pages/Pages.scss';

const AppContext = React.createContext(null);
export { AppContext };
class App extends Component {
	state = {
		response: {
			severity: null,
			message: null,
			isOpen: false
		}
	};

	changeResponse = (message, severity, isOpen = true) => {
		this.setState({
			response: {
				message,
				severity,
				isOpen
			}
		});
	};

	render() {
		const { changeResponse } = this;
		const { session, location, refetch, value } = this.props;
		const { response: { isOpen, message, severity } } = this.state;
		return (
			<Fragment>
				<GlobalCss />
				<div className="App">
					<AppContext.Provider value={{ changeResponse }}>
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
								path="/self"
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

ReactDOM.render(
	<WithSessions>
		{({ session, refetch }) => {
			return (
				<Router>
					<RoutedApp session={session} refetch={refetch} />
				</Router>
			);
		}}
	</WithSessions>,
	document.getElementById('root')
);
