import React from 'react';
import { connect } from 'react-redux';
import { Query } from '@apollo/react-components';
import Composer from 'react-composer';

import { AppContext } from '../../context/AppContext';
// import detectCurrentEnvPageProp from '../../Utils/detectCurrentEnvPageProp';

class DataFetcher extends React.Component {
	static contextType = AppContext;
	state = {
		type: { user: this.context.user, page: this.props.page, prop: 'landing' }
	};

	render() {
		let { type } = this.state;
		let { page, authedUser, pageQueries } = this.props;
		page = page.toLowerCase();
		type = type.toLowerCase();
		const countQuery = pageQueries[`${page}.${type}.${authedUser ? 'auth' : 'unauth'}.count`];
		const dataQuery = pageQueries[`${page}.${type}.${authedUser ? 'auth' : 'unauth'}.data`];
		return countQuery && dataQuery ? (
			<Composer
				components={[
					({ render }) => <Query query={countQuery} children={render} />,
					({ render }) => (
						<Query
							query={dataQuery}
							variables={{
								pagination: {
									limit: 15,
									page: 1
								}
							}}
							children={render}
						/>
					)
				]}
			>
				{([ countQuery, dataQuery ]) => {
					return this.props.children({
						data: dataQuery.data,
						totalCount: countQuery.data,
						type,
						refetchData: (variables) => {
							countQuery.refetch({ filter: variables.filter });
							dataQuery.refetch({ ...variables });
						}
					});
				}}
			</Composer>
		) : null;
	}
}

export default connect(({ authedUser, pageQueries }) => ({ authedUser, pageQueries }))(DataFetcher);
