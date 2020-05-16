import React from 'react';
import { Link } from 'react-router-dom';
import './CardSecondary.scss';

function CardSecondary({ items, type, item }) {
	return (
		<div className={`card-secondary ${type}-card-secondary`}>
			{items.map(([ key, option = {} ], index) => {
				if (option.link)
					return (
						<Link
							className={`card-secondary-item ${type}-card-secondary-item ${type}-card-secondary-${key}`}
							to={option.link}
							key={option.link}
						>
							{option.value ? option.value : item[key]}
						</Link>
					);
				else {
					if (Array.isArray(item[key])) {
						return (
							<div
								className={`card-secondary-item ${type}-card-secondary-item ${type}-card-secondary-${key}`}
								key={`${item[key]}${index}`}
							>
								{item[key].map((value, index) => (
									<span
										key={`${type}-card-secondary-${key}-item-${index}`}
										className={`${type}-card-secondary-${key}-item ${type}-card-secondary-${key}-item-${index}`}
									>
										{value}
									</span>
								))}
							</div>
						);
					} else
						return (
							<div
								className={`card-secondary-item ${type}-card-secondary-item ${type}-card-secondary-${key}`}
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

export default CardSecondary;
