import React, { Component } from 'react';
import Card from '../Card/Card';
import './Board.scss';

class Board extends Component {
	render() {
		const { headers, page, onHeaderClick, data, sectionDecider, type, noData } = this.props;
		return (
			<div className={`board ${page}-board`}>
				<div className={`board-header ${page}-board-header`}>
					{headers.map((header, index) => {
						return (
							<span
								className={`board-header-item ${page}-board-header-item ${page}-board-header-${header} ${type === header
									? 'selected-item'
									: ''}`}
								key={`${header}${index}`}
								onClick={(e) => {
									onHeaderClick(header);
								}}
							>
								{header.charAt(0).toUpperCase() + header.slice(1)}
							</span>
						);
					})}
				</div>
				<div className={`board-data ${page}-board-data`}>
					{data.data ? (
						data.data.map((item, index) => {
							const { primary, secondary, tertiary } = sectionDecider(item, type);
							return (
								<Card
									primary={primary}
									secondary={secondary}
									tertiary={tertiary}
									item={item}
									type={type}
									index={index}
									page={page}
									key={item._id}
								/>
							);
						})
					) : (
						<div className="no-data">{noData ? noData : 'No Data'}</div>
					)}
				</div>
			</div>
		);
	}
}

export default Board;
