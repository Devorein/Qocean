import React, { Component } from 'react';

import Explorer from '../../components/Explorer/Explorer';
import DataFetcher from '../../components/DataFetcher/DataFetcher';
import PageSwitcher from '../../components/PageSwitcher/PageSwitcher';

class Watchlist extends Component {
	render() {
		return (
			<DataFetcher page={'Watchlist'}>
				{({ data, totalCount, refetchData, updateDataLocally }) => {
					return (
						<PageSwitcher
							page="watchlist"
							runAfterSwitch={(type) => {
								refetchData(type, { page: 1, limit: this.props.user.current_environment.default_watchlist_rpp });
							}}
						>
							{({ CustomTabs, type }) => (
								<div className="Watchlist page">
									{CustomTabs}
									<Explorer
										page={'Watchlist'}
										data={data}
										totalCount={totalCount}
										type={type}
										refetchData={refetchData.bind(null, type)}
										updateDataLocally={updateDataLocally}
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

export default Watchlist;
