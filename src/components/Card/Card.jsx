import React from 'react';
import CardPrimary from './CardPrimary';
import CardSecondary from './CardSecondary';
import CardTertiary from './CardTertiary';
import './Card.scss';

function Card({ primary, secondary, tertiary, item, type, index = 0, page, image = false }) {
	return (
		<div
			className={`card ${type}-card ${page}-card ${page}-${type}-card ${type}-card-${index} ${page}-${type}-card-${index}`}
		>
			{image ? (
				<img
					className={`card-image ${type}-card-image ${page}-card-image ${page}-${type}-card-image`}
					src={
						item.image ? (
							item.image
						) : (
							'https://lh3.googleusercontent.com/proxy/282LMrti7QL97dp838MBXzGB-gaHRlvJEreKT9ShPe23ltBH-aJGA7ACx7hRIWSOT6g5w9yCxURYkMFD1evpHd3t_Y_C_JKkkuObvazVDtYIjfeE9wvxNQ'
						)
					}
					alt={item[primary[0]]}
				/>
			) : null}

			<CardPrimary items={primary} type={type} item={item} index={index} />
			<CardSecondary items={secondary} type={type} item={item} index={index} />
			<CardTertiary items={tertiary} type={type} item={item} index={index} />
		</div>
	);
}

export default Card;
