import React from 'react';
import moment from 'moment';

function CardTertiary({ items, type, item }) {
	function capitalize(text) {
		return text.split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1) + ' ');
	}
	function decideValue(option, value) {
		if (option.value) return option.value;
		else if (typeof value === 'boolean') return value ? 'On' : 'Off';
		else if (option.anchor)
			return (
				<a target="_blank" rel="noopener noreferrer" href={value}>
					{value}
				</a>
			);
		else return value;
	}
	return (
		<div className={`card-tertiary ${type}-card-tertiary`}>
			{items.map(([ key, option = {} ], index) => {
				const text = capitalize(key);
				if (key === 'created_at' || key === 'joined_at')
					option.value = moment(item[key]).format('dddd, MMMM Do YYYY, h:mm a');
				return (
					<div
						className={`card-tertiary-item ${type}-card-tertiary-item ${type}-card-tertiary-${key}`}
						key={`${text}${item[key]}${index}`}
					>
						<div className={`card-tertiary-item-key ${type}-card-tertiary-item-key`}>{text}</div>
						<div className={`card-tertiary-item-value ${type}-card-tertiary-item-value`}>
							{decideValue(option, item[key])}
						</div>
					</div>
				);
			})}
		</div>
	);
}

export default CardTertiary;
