import React, { Component } from 'react';

import Explorer from '../../components/Explorer/Explorer';
import PageSwitcher from '../../components/PageSwitcher/PageSwitcher';
import DataFetcher from '../../components/DataFetcher/DataFetcher';

import './Explore.scss';

class Explore extends Component {
	render() {
		return (
			<DataFetcher page="Explore">
				{({ data, totalCount, refetchData }) => {
					return (
						<PageSwitcher
							page="explore"
							runAfterSwitch={(type) => {
								refetchData(type, {
									page: 1,
									limit: this.props.user ? this.props.user.current_environment.default_explore_rpp : 15
								});
							}}
						>
							{({ CustomTabs, type }) => (
								<div className="Explore page">
									{CustomTabs}
									<Explorer
										page={'Explore'}
										data={data}
										totalCount={totalCount}
										type={type}
										refetchData={refetchData.bind(null, type)}
										updateDataLocally={(data) => {
											this.setState({ data });
										}}
									/>
								</div>
							)}
						</PageSwitcher>
					);
				}}
			</DataFetcher>
		);
	}
}

export default Explore;
