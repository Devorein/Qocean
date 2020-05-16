import React from 'react';
import { Link } from 'react-router-dom';

function DetailTertiary({ items, type, item }) {
	return (
		<div className={`detail-tertiary ${type}-detail-tertiary`}>
			{items.map(([ key, option = {} ], index) => {
				if (option.link)
					return (
						<Link
							className={`detail-tertiary-item ${type}-detail-tertiary-item ${type}-detail-tertiary-${key}`}
							to={option.link}
							key={option.link}
							style={option.style}
						>
							{option.value ? option.value : item[key]}
						</Link>
					);
				else {
					return (
						<div
							className={`detail-tertiary-item ${type}-detail-tertiary-item ${type}-detail-tertiary-${key}`}
							key={`${item[key]}${index}`}
							style={option.style}
						>
							{option.value ? option.value : item[key]}
						</div>
					);
				}
			})}
		</div>
	);
}

export default DetailTertiary;
