import React from 'react';
import './MultiHeader.scss';

function MultiHeader({ headers, page, onHeaderClick, comp, type }) {
	return (
		<div className={`header ${comp}-header ${page}-${comp}-header`}>
			{headers.map((header, index) => {
				return (
					<span
						className={`header-item ${comp}-header-item ${page}-${comp}-header-item ${page}-${comp}-header-${header} ${type ===
						header
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
	);
}

export default MultiHeader;
