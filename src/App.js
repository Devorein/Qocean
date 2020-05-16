import React, { Component } from 'react';
import Nav from './components/Nav/Nav';
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
		return (
			<Router>
				<div className="App">
					<Nav />
					<Switch>
						<Route path="/" exact component={Home} />
						<Route path="/create" exact component={Create} />
						<Route path="/self" exact component={Self} />
						<Route path="/explore" exact component={Explore} />
						<Route path={'/:type/:id'} exact component={Details} />
					</Switch>
				</div>
			</Router>
		);
	}
}

export default App;
