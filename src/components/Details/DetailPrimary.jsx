import React from 'react';
import { Link } from 'react-router-dom';

function DetailPrimary({ items, type, item }) {
	return (
		<div className={`detail-primary ${type}-detail-primary`}>
			{items.map(([ key, option = {} ], index) => {
				if (option.link)
					return (
						<Link
							className={`detail-primary-item ${type}-detail-primary-item ${type}-detail-primary-${key}`}
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
							className={`detail-primary-item ${type}-detail-primary-item ${type}-detail-primary-${key}`}
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

export default DetailPrimary;
