import React, { Component, Fragment } from 'react';

import './Card.scss';
class Card extends Component {
	flattenObject = (obj) => {
		const { type } = this.props;
		const entries = Object.entries(obj);
		return entries.map(([ key, value ], index) => {
			if (Object.prototype.toString.call(value) !== '[object Object]' && !Array.isArray(value))
				return (
					<div
						className={`card-item ${type}-card-item ${type}-${key}-card-item ${type}-${key}-${index}-card-item `}
						key={`${type}-${key}-${index}`}
					>
						<span className={`card-item-key ${type}-card-item-key ${type}-${key}-card-item-key`}>{key}</span>
						<span className={`card-item-value ${type}-card-item-value ${type}-${key}-card-item-value`}>{value}</span>
					</div>
				);
		});
	};
	decideElements = (type, item) => {
		const dom = {
			image: '',
			primary: '',
			secondary: [],
			tertiary: {
				left: [],
				right: []
			}
		};

		if (type === 'quiz') {
			dom.primary = 'name';
			dom.secondary = [ 'user', 'subject', 'tags' ];
			dom.tertiary = [ 'averageDifficulty', 'averageTimeAllocated', 'rating', 'source', 'questionCount' ];
		}

		return dom;
	};

	renderElement = (dom, item) => {
		function renderSecondaries(secondaries) {
			return <div className={`card-secondaries`} />;
		}

		function renderTertiaries(tertiaries) {
			return (
				<div className={`card-tertiaries`}>
					{tertiaries.map((tertiary) => {
						console.log(item[tertiary]);
						return (
							<div className={`card-tertiary-item`}>
								<span className="tertiary-key">{tertiary}</span>
								<span className="tertiary-value">{item[tertiary]}</span>
							</div>
						);
					})}
				</div>
			);
		}

		return (
			<Fragment>
				{/* {item.image ? <img className={`card-image`} src={item.image} alt={item[dom.primary]} /> : null} */}
				<div className={`card-primary`}>{item[dom.primary]}</div>
				{renderSecondaries(dom.secondary)}
				{renderTertiaries(dom.tertiary)}
			</Fragment>
		);
	};

	render() {
		const { item, index, type, page } = this.props;
		return (
			<div
				className={`card ${page}-card ${type}-card ${page}-${type}-card ${type}-card-${index} ${page}-${type}-card-${index}`}
			>
				{this.renderElement(this.decideElements(type, item), item)}
			</div>
		);
	}
}

export default Card;
