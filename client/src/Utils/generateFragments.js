import sectorizeData from './sectorizeData';
import { gql } from '@apollo/client';

const FRAGMENTS = {};

[ 'User', 'Quiz', 'Question', 'Folder', 'Environment' ].forEach((resource) => {
	const target = {};
	FRAGMENTS[resource.toLowerCase()] = target;
	const mixedData = sectorizeData(null, resource.toLowerCase(), { authenticated: false, purpose: 'detail' });
	const othersData = sectorizeData(null, resource.toLowerCase(), { authenticated: false, purpose: 'detail' });
	const selfData = sectorizeData(null, resource.toLowerCase(), { authenticated: true, purpose: 'detail' });

	[ [ 'MIXED', mixedData ], [ 'OTHERS', othersData ], [ 'SELF', selfData ] ].forEach(([ type, arr ]) => {
		[ 'primary', 'secondary', 'tertiary', 'ref', 'refs' ].forEach((sector) => {
			const fields = arr[sector];
			const fragmentContainerName = `${type}_${resource.toUpperCase()}_${sector.toUpperCase()}`;
			const capitalizedType = type.charAt(0) + type.substr(1).toLowerCase();
			const fragmentName = `${capitalizedType}${resource}${sector.charAt(0).toUpperCase() + sector.substr(1)}`;
			if (fields.length !== 0)
				target[fragmentContainerName] = gql`
          fragment ${fragmentName} on ${capitalizedType}${resource}{
            ${fields.join('\n')}
          }
        `;
			else target[fragmentContainerName] = null;
		});
	});
});

export default FRAGMENTS;
