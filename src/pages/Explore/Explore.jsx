import React, { Component } from 'react';

import Explorer from '../../components/Explorer/Explorer';
import PageSwitcher from '../../components/PageSwitcher/PageSwitcher';
import DataFetcher from '../../components/DataFetcher/DataFetcher';

import './Explore.scss';

class Explore extends Component {
	render() {
		return (
			<DataFetcher page="Explore">
				{({ data, totalCount, refetchData, updateDataLocally, type }) => {
					return (
						<PageSwitcher page="explore" refetchData={refetchData}>
							{({ CustomTabs }) => (
								<div className="Explore page">
									{CustomTabs}
									<Explorer
										page={'Explore'}
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

export default Explore;
