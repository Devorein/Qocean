export default function({ user, prop, page }) {
	if (user) {
		page = page.toLowerCase();
		return user.current_environment[`${page}_page`][`default_${prop}`];
	} else return 'Quiz';
}
