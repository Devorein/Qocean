import React, { Component } from 'react';
import Nav from './components/Nav/Nav';
import Create from './pages/Create/Create';
import Explore from './pages/Explore/Explore';
import Self from './pages/Self/Self';
import Home from './pages/Home/Home';
import Details from './components/Details/Detail';

import './App.scss';
import './pages/Pages.scss';
import './components/Card/Card';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

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
