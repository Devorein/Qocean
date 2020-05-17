import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';

import Navbar from './components/Navbar/Navbar';
import WithSessions from './components/Auth/WithSessions.jsx';
import SignIn from './components/Auth/SignIn.jsx';
import SignUp from './components/Auth/SignUp.jsx';
import Explore from './pages/Explore/Explore';
import Create from './pages/Create/Create';
import Self from './pages/Self/Self';
import Home from './pages/Home/Home';
import Details from './pages/Detail/Detail';
import { BrowserRouter as Router, Switch, Route, Redirect, withRouter } from 'react-router-dom';

import './App.scss';
import './pages/Pages.scss';

class App extends Component {
	render() {
		const { session, location, refetch } = this.props;
		return (
			<Fragment>
				<div className="App">
					<Navbar session={session} />
					<Switch location={location}>
						<Route path="/" exact component={Home} />
						<Route
							path="/explore"
							exact
							render={(e) => {
								return <Explore user={session.getCurrentUser} />;
							}}
						/>
						<Route
							path="/details/:type/:id"
							exact
							render={(e) => {
								return <Details user={session.getCurrentUser} />;
							}}
						/>
						<Route
							path="/create"
							exact
							render={() => {
								return session.getCurrentUser ? <Create user={session} /> : <Redirect to="/" />;
							}}
						/>
						<Route
							path="/self"
							exact
							render={() => {
								return session.getCurrentUser ? <Self user={session} /> : <Redirect to="/" />;
							}}
						/>
						<Route path="/signin" exact render={() => <SignIn refetch={refetch} />} />
						<Route path="/signup" exact render={() => <SignUp refetch={refetch} />} />
						<Redirect to="/" />
					</Switch>
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
