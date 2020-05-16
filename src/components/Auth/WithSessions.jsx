import React from 'react';

const WithSessions = (Component) => (props) => {
	return <Component {...props} /*session={}*/ />;
};

export default WithSessions;
