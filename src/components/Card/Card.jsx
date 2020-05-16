import React from 'react';
import CardPrimary from './CardPrimary';
import CardSecondary from './CardSecondary';
import CardTertiary from './CardTertiary';
import './Card.scss';

function Card({ primary, secondary, tertiary, item, type, index, page }) {
	return (
		<div className={`card quiz-card ${page}-card ${page}-quiz-card quiz-card-${index} ${page}-quiz-card-${index}`}>
			<CardPrimary items={primary} type={type} item={item} index={index} />
			<CardSecondary items={secondary} type={type} item={item} index={index} />
			<CardTertiary items={tertiary} type={type} item={item} index={index} />
		</div>
	);
}

export default Card;
