import React from 'react';
import { useQuery } from '@apollo/react-components';
import { useSelector, useDispatch } from 'react-redux';
import gql from 'graphql-tag';

import { setAuthedUser } from '../../actions/authedUser';
import Operations from '../../operations/Operations';
export default function WithSessions (props) {
	const dispatch = useDispatch();
	const authedUser = useSelector(({ authedUser }) => authedUser);
	const { loading, error, data, refetch } = useQuery(gql(Operations.GetSelfUser_ScalarsOnly));
	React.useEffect(
		() => {
			if (!loading && !error) dispatch(setAuthedUser(data.GetSelfUser_ScalarsOnly));
		},
		[ dispatch, data, error, loading ]
	);
	return props.children({
		session: { user: authedUser || null },
		refetch
	});
}
