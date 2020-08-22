import React from 'react';
import { useQuery } from '@apollo/react-components';
import { useSelector, useDispatch } from 'react-redux';
import { setAuthedUser } from '../../actions/authedUser';
import Operations from '../../operations/Operations';

export default function WithSessions (props) {
	const dispatch = useDispatch();
	const authedUser = useSelector(({ authedUser }) => authedUser);
	const { loading, error, data, refetch } = useQuery(Operations.GetSelfUser_Info);
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
