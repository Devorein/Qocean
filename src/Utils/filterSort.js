import moment from 'moment';

export default function(filterSort) {
	let { sorts, filters } = filterSort;
	const sort = sorts
		.filter(({ target, order, disabled }) => !disabled && order !== 'none' && target !== 'none')
		.map(({ target, order }) => `${order === 'desc' ? '-' : ''}${target}`)
		.join(',');
	const query = {};
	if (sort !== '') query.sort = sort;

	const { cond: globalCond } = filters[0];
	const targetFilter = [];
	query[`$${globalCond}`] = targetFilter;

	filters.forEach((filter) => {
		let localCond = null;
		if (filter.children[0]) localCond = filter.children[0].cond;
		else localCond = 'and';
		const newQuery = {};
		const newFilter = [];
		newQuery[`$${localCond}`] = newFilter;
		targetFilter.push(newQuery);
		parseFilter(filter, newFilter);

		if (filter.children.length !== 0) {
			filter.children.forEach((child) => {
				parseFilter(child, newFilter);
			});
		}
	});
	return query;
}

function parseFilter(filter, targetFilter) {
	let { shutdown, target, value, type, mod, disabled } = filter;
	if (!disabled && !shutdown && target !== 'none' && mod !== 'none' && value !== undefined && value !== '') {
		let targetValue = {};
		if (type === 'boolean') {
			value = value.toString();
			if (value === 'false' && mod === 'is_not') targetValue.$eq = true;
			else if (value === 'false' && mod === 'is') targetValue.$eq = false;
			else if (value === 'true' && mod === 'is') targetValue.$eq = true;
			else if (value === 'true' && mod === 'is_not') targetValue.$eq = false;
		} else if (type === 'string') {
			if (mod === 'is') {
				targetValue.$regex = value;
				targetValue.$options = 'i';
			} else if (mod === 'is_(case)') targetValue.$eq = value;
			else if (mod === 'starts_with') {
				targetValue.$regex = `^${value}`;
				targetValue.$options = 'i';
			} else if (mod === 'starts_with_(case)') targetValue.$regex = `^${value}`;
			else if (mod === 'ends_with') {
				targetValue.$regex = `${value}$`;
				targetValue.$options = 'i';
			} else if (mod === 'ends_with_(case)') targetValue.$regex = `${value}$`;
			else if (mod === 'contains') {
				targetValue.$regex = `${value}`;
				targetValue.$options = 'i';
			} else if (mod === 'contains_(case)') {
				targetValue.$regex = `${value}`;
			} else if (mod === 'regex') {
				const regex = /^\/(.+)\//g;
				const regexValue = regex.exec(value)[1];
				const modifiers = value.substr(value.lastIndexOf('/') + 1);
				targetValue.$regex = regexValue;
				targetValue.$regex = modifiers;
			}
		} else if (type === 'number') {
			if (mod === 'is') targetValue.$eq = value[0];
			else if (mod === 'is_not') targetValue.$ne = `${value[0]}`;
			else if (mod === 'greater_than') targetValue.$gt = `${value[0]}`;
			else if (mod === 'less_than') targetValue.$lt = `${value[0]}`;
			else if (mod === 'greater_than_equal') targetValue.$gte = `${value[0]}`;
			else if (mod === 'less_than_equal') targetValue.$lte = `${value[0]}`;
			else if (mod === 'between_inclusive') {
				const transformedValue = value.map((value) => parseFloat(value));
				targetValue.$gte = Math.min(...transformedValue);
				targetValue.$lte = Math.max(...transformedValue);
			} else if (mod === 'between_exclusive') {
				const transformedValue = value.map((value) => parseFloat(value));
				targetValue.$gt = Math.min(...transformedValue);
				targetValue.$lt = Math.max(...transformedValue);
			} else if (mod.match(/(not_between)/)) {
				const transformedValue = value.map((value) => parseFloat(value));
				let op = null;
				targetValue = [];
				if (mod === 'not_between_exclusive') op = [ '$gte', '$lte' ];
				else if (mod === 'not_between_inclusive') op = [ '$gt', '$lt' ];
				targetValue.push({
					[target]: { [op[0]]: Math.max(...transformedValue) }
				});
				targetValue.push({
					[target]: { [op[1]]: Math.min(...transformedValue) }
				});
				target = '$or';
			}
		} else if (type === 'select') {
			targetValue = [];
			value.forEach((val, index) => {
				targetValue.push({ [target]: { [mod === 'is' ? '$eq' : '$ne']: val } });
			});
			if (mod === 'is') target = '$or';
			else if (mod === 'is_not') target = '$and';
		} else if (type === 'date') {
			if (mod === 'exact') {
				targetValue.$gte = moment(value[0]).format('YYYY-MM-DD');
				targetValue.$lte = moment(value[0]).add(1, 'days').format('YYYY-MM-DD');
			} else if (mod === 'today') {
				targetValue.$gte = moment().format('YYYY-MM-DD');
				targetValue.$lte = moment().add(1, 'days').format('YYYY-MM-DD');
			} else if (mod === 'yesterday') {
				targetValue.$gte = moment().subtract(1, 'days').format('YYYY-MM-DD');
				targetValue.$lte = moment().format('YYYY-MM-DD');
			} else if (mod === 'within') {
				targetValue.$gte = moment(value[0]).format('YYYY-MM-DD');
				targetValue.$lte = moment(value[1]).format('YYYY-MM-DD');
			} else if (mod === 'last_week') {
				targetValue.$gte = moment().subtract(7, 'days').format('YYYY-MM-DD');
				targetValue.$lte = moment().subtract(6, 'days').format('YYYY-MM-DD');
			} else if (mod === 'within_last_week') targetValue.$gte = moment().subtract(1, 'weeks').format('YYYY-MM-DD');
			else if (mod === 'last_month') {
				targetValue.$gte = moment().subtract(31, 'days').format('YYYY-MM-DD');
				targetValue.$lte = moment().subtract(30, 'days').format('YYYY-MM-DD');
			} else if (mod === 'within_last_month') targetValue.$gte = moment().subtract(1, 'month').format('YYYY-MM-DD');
			else if (mod === 'last_year') {
				targetValue.$gte = moment().subtract(365, 'days').format('YYYY-MM-DD');
				targetValue.$lte = moment().subtract(364, 'days').format('YYYY-MM-DD');
			} else if (mod === 'within_last_year') targetValue.$gte = moment().subtract(1, 'year').format('YYYY-MM-DD');
		} else if (type === 'array') {
			if (mod === 'length_is') targetValue.$size = value;
			else if (mod === 'length_greater_than') {
				target = `${target}.${parseInt(value) + 1}`;
				targetValue = { $exists: true };
			} else if (mod === 'length_less_than') {
				target = `${target}.${parseInt(value) - 1}`;
				targetValue = { $exists: false };
			} else if (mod === 'contains') {
				targetValue = [];
				value.forEach((val, index) => {
					targetValue.push({ [target]: { $regex: `^${val}` } });
				});
				target = '$or';
			}
		}
		targetFilter.push({ [target]: targetValue });
	}
}
