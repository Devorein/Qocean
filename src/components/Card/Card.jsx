import React, { Fragment } from 'react';
import CardPrimary from './CardPrimary';
import CardSecondary from './CardSecondary';
import CardTertiary from './CardTertiary';
import './Card.scss';

function Card({ primary, secondary, tertiary, item, type, index }) {
	return (
		<Fragment>
			<CardPrimary items={primary} type={type} item={item} index={index} />
			<CardSecondary items={secondary} type={type} item={item} index={index} />
			<CardTertiary items={tertiary} type={type} item={item} index={index} />
		</Fragment>
	);
}

export default Card;
