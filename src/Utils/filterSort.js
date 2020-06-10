import moment from 'moment';

export default function(filterSort) {
	let { sorts, filters } = filterSort;
	const sort = sorts
		.filter(({ target, order, disabled }) => !disabled && order !== 'none' && target !== 'none')
		.map(({ target, order }) => `${order === 'desc' ? '-' : ''}${target}`)
		.join(',');
	const query = {};
	if (sort !== '') query.sort = sort;

	const { cond } = filters[0];
	const filter = [];
	query[`$${cond}`] = filter;

	filters.forEach(({ target, value, type, mod, disabled }) => {
		if (!disabled && target !== 'none' && value !== undefined && value !== '') {
			let targetProp = {};

			if (type === 'boolean') {
				value = value.toString();
				if (value === 'false' && mod === 'is_not') targetProp.$eq = true;
				else if (value === 'false' && mod === 'is') targetProp.$eq = false;
				else if (value === 'true' && mod === 'is') targetProp.$eq = true;
				else if (value === 'true' && mod === 'is_not') targetProp.$eq = false;
			} else if (type === 'string') {
				if (mod === 'is') targetProp.$eq = value;
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
				if (mod === 'is') targetProp.$eq = value[0];
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
					const transformedValue = value.map((value) => parseFloat(value));
					let op = null;
					targetProp = [];
					if (mod === 'not_between_exclusive') op = [ '$gte', '$lte' ];
					else if (mod === 'not_between_inclusive') op = [ '$gt', '$lt' ];
					targetProp.push({
						[target]: { [op[0]]: Math.max(...transformedValue) }
					});
					targetProp.push({
						[target]: { [op[1]]: Math.min(...transformedValue) }
					});
					target = '$or';
				}
			} else if (type === 'select') {
				targetProp = [];
				value.forEach((val, index) => {
					targetProp.push({ [target]: { [mod === 'is' ? '$eq' : '$ne']: val } });
				});
				if (mod === 'is') target = '$or';
				else if (mod === 'is_not') target = '$and';
			} else if (type === 'date') {
				if (mod === 'exact') {
					targetProp.$gte = moment(value[0]).format('YYYY-MM-DD');
					targetProp.$lte = moment(value[0]).add(1, 'days').format('YYYY-MM-DD');
				} else if (mod === 'today') {
					targetProp.$gte = moment().format('YYYY-MM-DD');
					targetProp.$lte = moment().add(1, 'days').format('YYYY-MM-DD');
				} else if (mod === 'yesterday') {
					targetProp.$gte = moment().subtract(1, 'days').format('YYYY-MM-DD');
					targetProp.$lte = moment().format('YYYY-MM-DD');
				} else if (mod === 'within') {
					targetProp.$gte = moment(value[0]).format('YYYY-MM-DD');
					targetProp.$lte = moment(value[1]).format('YYYY-MM-DD');
				} else if (mod === 'last_week') {
					targetProp.$gte = moment().subtract(7, 'days').format('YYYY-MM-DD');
					targetProp.$lte = moment().subtract(6, 'days').format('YYYY-MM-DD');
				} else if (mod === 'within_last_week') targetProp.$gte = moment().subtract(1, 'weeks').format('YYYY-MM-DD');
				else if (mod === 'last_month') {
					targetProp.$gte = moment().subtract(31, 'days').format('YYYY-MM-DD');
					targetProp.$lte = moment().subtract(30, 'days').format('YYYY-MM-DD');
				} else if (mod === 'within_last_month') targetProp.$gte = moment().subtract(1, 'month').format('YYYY-MM-DD');
				else if (mod === 'last_year') {
					targetProp.$gte = moment().subtract(365, 'days').format('YYYY-MM-DD');
					targetProp.$lte = moment().subtract(364, 'days').format('YYYY-MM-DD');
				} else if (mod === 'within_last_year') targetProp.$gte = moment().subtract(1, 'year').format('YYYY-MM-DD');
			}
			filter.push({ [target]: targetProp });
		}
	});
	return query;
}
