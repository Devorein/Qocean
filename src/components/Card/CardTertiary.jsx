import React from 'react';

function CardTertiary({ items, type, item }) {
	function capitalize(text) {
		return text.split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1) + ' ');
	}
	return (
		<div className={`card-tertiary ${type}-card-tertiary`}>
			{items.map(([ key, option = {} ], index) => {
				const text = capitalize(key);
				return (
					<div
						className={`card-tertiary-item ${type}-card-tertiary-item ${type}-card-tertiary-${key}`}
						key={`${text}${item[key]}${index}`}
					>
						<div className={`card-tertiary-item-key ${type}-card-tertiary-item-key`}>{text}</div>
						<div className={`card-tertiary-item-value ${type}-card-tertiary-item-value`}>
							{option.value ? option.value : item[key]}
						</div>
					</div>
				);
			})}
		</div>
	);
}

export default CardTertiary;
