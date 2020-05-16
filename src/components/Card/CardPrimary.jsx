import React from 'react';
import { Link } from 'react-router-dom';
import './CardPrimary.scss';

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
						>
							{option.value ? option.value : item[key]}
						</Link>
					);
				else {
					return (
						<div
							className={`card-primary-item ${type}-card-primary-item ${type}-card-primary-${key}`}
							key={`${item[key]}${index}`}
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
