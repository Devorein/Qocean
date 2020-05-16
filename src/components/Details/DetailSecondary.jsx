import React from 'react';
import { Link } from 'react-router-dom';

function DetailSecondary({ items, type, item }) {
	return (
		<div className={`detail-secondary ${type}-detail-secondary`}>
			{items.map(([ key, option = {} ], index) => {
				if (option.link)
					return (
						<Link
							className={`detail-secondary-item ${type}-detail-secondary-item ${type}-detail-secondary-${key}`}
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
							className={`detail-secondary-item ${type}-detail-secondary-item ${type}-detail-secondary-${key}`}
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

export default DetailSecondary;
