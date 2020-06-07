export default function(datas, type) {
	type = type.toLowerCase();
	return datas.map((data) => {
		const negate = [ 'user', '_id', '__v', 'id' ];
		const temp = {};
		if (type === 'quiz')
			negate.push(
				'average_quiz_time',
				'average_difficulty',
				'total_questions',
				'total_folders',
				'folders',
				'rating',
				'questions',
				'watchers',
				'ratings',
				'raters'
			);
		else if (type === 'question') negate.push('quiz');
		else if (type === 'folder') negate.push('quizzes', 'ratings', 'total_questions', 'total_quizzes');

		const fields = Object.keys(data).filter((key) => negate.indexOf(key) === -1);
		fields.forEach((field) => (temp[field] = data[field]));
		temp.rtype = type.toLowerCase();
		return temp;
	});
}
