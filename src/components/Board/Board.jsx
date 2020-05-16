import React, { Component } from 'react';
import Card from '../Card/Card';
import './Board.scss';
import MultiHeader from '../../components/MultiHeader/MultiHeader';

class Board extends Component {
	render() {
		const { headers, page, onHeaderClick, data, sectionDecider, type, noData } = this.props;
		return (
			<div className={`board ${page}-board`}>
				<MultiHeader headers={headers} page={page} onHeaderClick={onHeaderClick} comp="board" type={type} />
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
