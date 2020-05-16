import React from 'react';
import { Link } from 'react-router-dom';

function CardPrimary({ items, type, item }) {
	return (
		<div className={`card-primary ${type}-card-primary`}>
			{items.map(([ key, option = {} ], index) => {
				if (option.link)
					return (
						<Link
							className={`card-primary-item ${type}-card-primary-item ${type}-card-primary-${key}`}
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
							className={`card-primary-item ${type}-card-primary-item ${type}-card-primary-${key}`}
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

export default CardPrimary;
