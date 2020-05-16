import React from 'react';
import CardPrimary from './CardPrimary';
import CardSecondary from './CardSecondary';
import CardTertiary from './CardTertiary';
import './Card.scss';

function decideSections(item, type) {
	let primary = [],
		secondary = [],
		tertiary = [];

	if (type === 'quiz') {
		primary = [ [ 'name', { link: `/quiz/${item._id}` } ] ];
		secondary = [
			[ 'username', { link: `/user/${item.user._id}`, value: `by ${item.user.username}` } ],
			[ 'subject', { highlight: true } ],
			[ 'tags' ]
		];
		tertiary = [
			[ 'average_quiz_time', { value: item['average_quiz_time'] + 's' } ],
			[ 'average_difficulty' ],
			[ 'total_questions' ],
			[ 'created_at' ],
			[ 'source' ]
		];
	} else if (type === 'user') {
		primary = [ [ 'name', { link: `/quiz/${item._id}` } ] ];
		secondary = [ [ 'username', { link: `/user/${item._id}` } ], [ 'version', { highlight: true } ] ];
		tertiary = [
			[ 'total_quizzes' ],
			[ 'total_folders' ],
			[ 'total_questions' ],
			[ 'total_environments' ],
			[ 'joined_at' ]
		];
	} else if (type === 'environment') {
	} else if (type === 'folder') {
	} else if (type === 'question') {
		primary = [
			[ 'question', { link: `/question/${item._id}`, style: { fontSize: '20px' }, value: `${item.question}?` } ]
		];
		secondary = [
			[ 'user', { link: `/user/${item.user._id}`, value: `${item.user.username}` } ],
			[ 'quiz', { link: `/quiz/${item.quiz._id}`, value: `${item.quiz.name}` } ],
			[ 'type', { highlight: true } ]
		];
		tertiary = [ [ 'difficulty' ], [ 'time_allocated', { value: item['time_allocated'] + 's' } ], [ 'created_at' ] ];
	}

	return {
		primary,
		secondary,
		tertiary
	};
}

function Card({ item, type, index, page }) {
	let { primary, secondary, tertiary } = decideSections(item, type);

	return (
		<div className={`card quiz-card ${page}-card ${page}-quiz-card quiz-card-${index} ${page}-quiz-card-${index}`}>
			<CardPrimary items={primary} type={type} item={item} index={index} />
			<CardSecondary items={secondary} type={type} item={item} index={index} />
			<CardTertiary items={tertiary} type={type} item={item} index={index} />
		</div>
	);
}

export default Card;
