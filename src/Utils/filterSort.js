import moment from 'moment';

export default function(filterSort) {
	let { sorts, filters } = filterSort;
	const sort = sorts
		.filter(({ target, order, disabled }) => !disabled && order !== 'none' && target !== 'none')
		.map(({ target, order }) => `${order === 'desc' ? '-' : ''}${target}`)
		.join(',');
	const query = {};
	if (sort !== '') query.sort = sort;

	filters.forEach(({ target, value, type, mod, disabled }) => {
		if (!disabled && target !== 'none' && value !== undefined && value !== '') {
			if (type === 'boolean') {
				value = value.toString();
				if (value === 'false' && mod === 'is_not') query[target] = true;
				else if (value === 'false' && mod === 'is') query[target] = false;
				else if (value === 'true' && mod === 'is') query[target] = true;
				else if (value === 'true' && mod === 'is_not') query[target] = false;
			} else if (type === 'string') {
				if (mod === 'is') query[target] = value;
				else if (mod === 'starts_with') {
					query[`${target}[$regex]`] = `^${value}`;
					query[`${target}[$options]`] = 'i';
				} else if (mod === 'ends_with') query[`${target}[$regex]`] = `${value}$`;
				else if (mod === 'contains') query[`${target}[$regex]`] = `${value}`;
				else if (mod === 'regex') {
					const regex = /^\/(\w+)\//g;
					const regexValue = regex.exec(value)[1];
					const modifiers = value.substr(value.lastIndexOf('/') + 1);
					query[`${target}[$regex]`] = regexValue;
					query[`${target}[$options]`] = modifiers;
				}
			} else if (type === 'number') {
				if (mod === 'is') query[target] = value[0];
				else if (mod === 'is_not') query[`${target}[$ne]`] = `${value[0]}`;
				else if (mod === 'greater_than') query[`${target}[$gt]`] = `${value[0]}`;
				else if (mod === 'less_than') query[`${target}[$lt]`] = `${value[0]}`;
				else if (mod === 'greater_than_equal') query[`${target}[$gte]`] = `${value[0]}`;
				else if (mod === 'less_than_equal') query[`${target}[$lte]`] = `${value[0]}`;
				else if (mod === 'between_inclusive') {
					const transformedValue = value.map((value) => parseFloat(value));
					query[`${target}[$gte]`] = Math.min(...transformedValue);
					query[`${target}[$lte]`] = Math.max(...transformedValue);
				} else if (mod === 'between_exclusive') {
					const transformedValue = value.map((value) => parseFloat(value));
					query[`${target}[$gt]`] = Math.min(...transformedValue);
					query[`${target}[$lt]`] = Math.max(...transformedValue);
				} else if (mod === 'not_between_exclusive') {
					const transformedValue = value.map((value) => parseFloat(value));
					query[`[$or][0][${target}][$gt]`] = Math.max(...transformedValue);
					query[`[$or][1][${target}][$lt]`] = Math.min(...transformedValue);
				} else if (mod === 'not_between_inclusive') {
					const transformedValue = value.map((value) => parseFloat(value));
					query[`[$or][0][${target}][$gte]`] = Math.max(...transformedValue);
					query[`[$or][1][${target}][$lte]`] = Math.min(...transformedValue);
				}
			} else if (type === 'select') {
				if (mod === 'is') {
					value.forEach((val, index) => {
						query[`[$or][${index}][${target}]`] = val;
					});
				} else if (mod === 'is_not') {
					value.forEach((val, index) => {
						query[`[$and][${index}][${target}][$ne]`] = val;
					});
				}
			} else if (type === 'date') {
				if (mod === 'exact') {
					query[`[$and][0][${target}][$gte]`] = moment(value[0]).format('YYYY-MM-DD');
					query[`[$and][1][${target}][$lte]`] = moment(value[0]).add(1, 'days').format('YYYY-MM-DD');
				} else if (mod === 'today') {
					query[`[$and][0][${target}][$gte]`] = moment().format('YYYY-MM-DD');
					query[`[$and][1][${target}][$lte]`] = moment().add(1, 'days').format('YYYY-MM-DD');
				} else if (mod === 'yesterday') {
					query[`[$and][0][${target}][$gte]`] = moment().subtract(1, 'days').format('YYYY-MM-DD');
					query[`[$and][1][${target}][$lte]`] = moment().format('YYYY-MM-DD');
				} else if (mod === 'within') {
					query[`[$and][0][${target}][$gte]`] = moment(value[0]).format('YYYY-MM-DD');
					query[`[$and][1][${target}][$lte]`] = moment(value[1]).format('YYYY-MM-DD');
				} else if (mod === 'last_week') {
					query[`[$and][0][${target}][$gte]`] = moment().subtract(7, 'days').format('YYYY-MM-DD');
					query[`[$and][0][${target}][$lte]`] = moment().subtract(6, 'days').format('YYYY-MM-DD');
				} else if (mod === 'within_last_week')
					query[`[$and][0][${target}][$gte]`] = moment().subtract(1, 'weeks').format('YYYY-MM-DD');
				else if (mod === 'last_month') {
					query[`[$and][0][${target}][$gte]`] = moment().subtract(31, 'days').format('YYYY-MM-DD');
					query[`[$and][0][${target}][$lte]`] = moment().subtract(30, 'days').format('YYYY-MM-DD');
				} else if (mod === 'within_last_month')
					query[`[$and][0][${target}][$gte]`] = moment().subtract(1, 'month').format('YYYY-MM-DD');
				else if (mod === 'last_year') {
					query[`[$and][0][${target}][$gte]`] = moment().subtract(365, 'days').format('YYYY-MM-DD');
					query[`[$and][0][${target}][$lte]`] = moment().subtract(364, 'days').format('YYYY-MM-DD');
				} else if (mod === 'within_last_year')
					query[`[$and][0][${target}][$gte]`] = moment().subtract(1, 'year').format('YYYY-MM-DD');
			}
		}
	});
	return query;
}
