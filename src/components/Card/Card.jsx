import React, { Component, Fragment } from 'react';
import CardPrimary from './CardPrimary';
import CardSecondary from './CardSecondary';
import CardTertiary from './CardTertiary';
import './Card.scss';

function Card({ primary, secondary, tertiary, item, type }) {
	return (
		<Fragment>
			<CardPrimary items={primary} type={type} item={item} />
			<CardSecondary items={secondary} type={type} item={item} />
			<CardTertiary items={tertiary} type={type} item={item} />
		</Fragment>
	);
}

export default Card;
