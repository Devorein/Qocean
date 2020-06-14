export default function(quizzes, prop) {
	let headers = null;
	const rows = [];
	if (prop === 'type') headers = [ 'MCQ', 'MS', 'FIB', 'FC', 'Snippet', 'TF' ];
	else if (prop === 'difficulty') headers = [ 'Beginner', 'Intermediate', 'Advanced' ];
	else if (prop === 'time_allocated') headers = Array(7).fill(0).map((_, i) => `${15 * (i + 1) + 1}-${15 * (i + 2)}`);

	for (let i = 0; i < quizzes.length; i++) {
		const quiz = quizzes[i];
		const temp = {};

		headers.forEach((header) => {
			temp[header] = 0;
		});

		quiz.questions.forEach((question) => {
			let targetProp = question[prop];
			if (prop === 'time_allocated') targetProp = headers[Math.floor(parseInt(temp[question[prop]]) / 15)];
			temp[targetProp] = temp[targetProp] ? temp[targetProp] + 1 : 1;
		});

		rows.push({
			name: quiz.name,
			...temp
		});
	}
	headers.unshift('name');

	return {
		headers: headers.map((header) => ({
			name: header
		})),
		rows: rows.length !== 0 ? rows : [],
		footers: [
			'',
			...headers.splice(1).map((header) => {
				let total = 0;
				rows.forEach((row) => (total += row[header]));
				return total;
			})
		]
	};
}
