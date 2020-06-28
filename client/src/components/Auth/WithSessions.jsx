import React from 'react';
import { useQuery } from '@apollo/react-components';
import { useSelector, useDispatch } from 'react-redux';

import { getSelfUser } from '../../operations/graphql/user';
import { setAuthedUser } from '../../actions/authedUser';

export default function WithSessions(props) {
	const dispatch = useDispatch();
	const authedUser = useSelector(({ authedUser }) => authedUser);
	const { loading, error, data, refetch } = useQuery(getSelfUser);
	React.useEffect(
		() => {
			if (!loading && !error) dispatch(setAuthedUser(data.getSelfUser));
		},
		[ dispatch, data, error, loading ]
	);
	return props.children({
		session: { user: authedUser || null },
		refetch
	});
}
