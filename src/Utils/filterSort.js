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
				query[target] = {};
				const targetProp = query[target];
				if (mod === 'is') query[target] = value;
				else if (mod === 'starts_with') {
					targetProp.$regex = `^${value}`;
					targetProp.$options = 'i';
				} else if (mod === 'ends_with') targetProp.$regex = `${value}$`;
				else if (mod === 'contains') targetProp.$regex = `${value}`;
				else if (mod === 'regex') {
					const regex = /^\/(\w+)\//g;
					const regexValue = regex.exec(value)[1];
					const modifiers = value.substr(value.lastIndexOf('/') + 1);
					targetProp.$regex = regexValue;
					targetProp.$regex = modifiers;
				}
			} else if (type === 'number') {
				query[target] = {};
				const targetProp = query[target];

				if (mod === 'is') query[target] = value[0];
				else if (mod === 'is_not') targetProp.$ne = `${value[0]}`;
				else if (mod === 'greater_than') targetProp.$gt = `${value[0]}`;
				else if (mod === 'less_than') targetProp.$lt = `${value[0]}`;
				else if (mod === 'greater_than_equal') targetProp.$gte = `${value[0]}`;
				else if (mod === 'less_than_equal') targetProp.$lte = `${value[0]}`;
				else if (mod === 'between_inclusive') {
					const transformedValue = value.map((value) => parseFloat(value));
					targetProp.$gte = Math.min(...transformedValue);
					targetProp.$lte = Math.max(...transformedValue);
				} else if (mod === 'between_exclusive') {
					const transformedValue = value.map((value) => parseFloat(value));
					targetProp.$gt = Math.min(...transformedValue);
					targetProp.$lt = Math.max(...transformedValue);
				} else if (mod.match(/(not_between)/)) {
					delete query[target];
					const transformedValue = value.map((value) => parseFloat(value));
					query.$or = [];
					let op = null;
					if (mod === 'not_between_exclusive') op = [ '$gt', '$lt' ];
					else if (mod === 'not_between_inlcusive') op = [ '$gte', '$lte' ];

					query.$or.push({
						[target]: { [op[0]]: Math.max(...transformedValue) },
						[target]: { [op[1]]: Math.max(...transformedValue) }
					});
				}
			} else if (type === 'select') {
				if (mod === 'is') {
					query.$or = [];
					value.forEach((val, index) => {
						query.$or.push({ [target]: val });
					});
				} else if (mod === 'is_not') {
					query.$and = [];
					value.forEach((val, index) => {
						query.$and.push({ [target]: { $ne: val } });
					});
				}
			} else if (type === 'date') {
				query[target] = [];
				const queryProp = query[target];

				if (mod === 'exact') {
					queryProp.$gte = moment(value[0]).format('YYYY-MM-DD');
					queryProp.$lte = moment(value[0]).add(1, 'days').format('YYYY-MM-DD');
				} else if (mod === 'today') {
					queryProp.$gte = moment().format('YYYY-MM-DD');
					queryProp.$lte = moment().add(1, 'days').format('YYYY-MM-DD');
				} else if (mod === 'yesterday') {
					queryProp.$gte = moment().subtract(1, 'days').format('YYYY-MM-DD');
					queryProp.$lte = moment().format('YYYY-MM-DD');
				} else if (mod === 'within') {
					queryProp.$gte = moment(value[0]).format('YYYY-MM-DD');
					queryProp.$lte = moment(value[1]).format('YYYY-MM-DD');
				} else if (mod === 'last_week') {
					queryProp.$gte = moment().subtract(7, 'days').format('YYYY-MM-DD');
					queryProp.$lte = moment().subtract(6, 'days').format('YYYY-MM-DD');
				} else if (mod === 'within_last_week') queryProp.$gte = moment().subtract(1, 'weeks').format('YYYY-MM-DD');
				else if (mod === 'last_month') {
					queryProp.$gte = moment().subtract(31, 'days').format('YYYY-MM-DD');
					queryProp.$lte = moment().subtract(30, 'days').format('YYYY-MM-DD');
				} else if (mod === 'within_last_month') queryProp.$gte = moment().subtract(1, 'month').format('YYYY-MM-DD');
				else if (mod === 'last_year') {
					queryProp.$gte = moment().subtract(365, 'days').format('YYYY-MM-DD');
					queryProp.$lte = moment().subtract(364, 'days').format('YYYY-MM-DD');
				} else if (mod === 'within_last_year') queryProp.$gte = moment().subtract(1, 'year').format('YYYY-MM-DD');
			}
		}
	});
	return query;
}
