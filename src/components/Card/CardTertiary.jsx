import React from 'react';

function CardTertiary({ items, type, item }) {
	return (
		<div className={`card-tertiary ${type}-card-tertiary`}>
			{items.map(([ text, key ], index) => {
				return (
					<div
						className={`card-tertiary-item ${type}-card-tertiary-item ${type}-card-tertiary-${key}`}
						key={`${text}${item[key]}${index}`}
					>
						<div className={`card-tertiary-item-key ${type}-card-tertiary-item-key`}>{text}</div>
						<div className={`card-tertiary-item-value ${type}-card-tertiary-item-value`}>{item[key]}s</div>
					</div>
				);
			})}
		</div>
	);
}

export default CardTertiary;
