import React, { Component } from 'react';
import Explorer from '../../components/Explorer/Explorer';
import PageSwitcher from '../../components/PageSwitcher/PageSwitcher';
import DataFetcher from '../../components/DataFetcher/DataFetcher';

import './Self.scss';

class Self extends Component {
	render() {
		return (
			<DataFetcher page="Self">
				{({ data, totalCount, refetchData, updateDataLocally }) => {
					return (
						<PageSwitcher page="self" refetchData={refetchData}>
							{({ CustomTabs, type }) => (
								<div className="Self page">
									{CustomTabs}
									<Explorer
										page={'Self'}
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

export default Self;
