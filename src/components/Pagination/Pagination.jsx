import React from 'react';

import { AppContext } from '../../context/AppContext';
import filterSort from '../../Utils/filterSort';
import InputSelect from '../Input/InputSelect';
import TextInput from '../Input/TextInput/TextInput';
import GenericButton from '../Buttons/GenericButton';

class Pagination extends React.Component {
	static contextType = AppContext;

	state = {
		itemsPerPage: this.context.user
			? this.context.user.current_environment[`default_${this.props.page.toLowerCase()}_ipp`]
			: 15,
		currentPage: 1,
		typedPage: 1
	};

	movePage = (maxPage, dir) => {
		let { currentPage } = this.state;
		let changed = false;
		if (dir === 'next' && currentPage < maxPage) {
			currentPage++;
			changed = true;
		} else if (dir === 'prev' && currentPage > 1) {
			currentPage--;
			changed = true;
		}
		if (changed) {
			this.setState(
				{
					currentPage
				},
				() => {
					this.refetchData();
				}
			);
		}
	};

	refetchData = () => {
		const { itemsPerPage, currentPage } = this.state;
		const filterSortQuery = filterSort(this.props.filter_sort);
		this.props.refetchData({
			limit: itemsPerPage,
			page: currentPage,
			...filterSortQuery
		});
	};

	render() {
		const {
			props: { children, IppSelectClass, PageInputClass, GoToPageButtonClass, PageCountClass, ItemCountClass, prefix },
			refetchData
		} = this;
		const { itemsPerPage, typedPage, currentPage } = this.state;
		const { totalCount } = this.props;
		const maxPage = Math.ceil(totalCount / itemsPerPage);

		return children({
			refetchData,
			IppSelect: (
				<InputSelect
					className={`${IppSelectClass} ${prefix}_ippselect Pagination_ippselect`}
					name="Items Per Page"
					value={itemsPerPage}
					onChange={(e) => {
						this.setState({ itemsPerPage: e.target.value }, () => {
							this.refetchData();
						});
					}}
					selectItems={[ 5, 10, 15, 20, 25, 30, 40, 50, 100 ].map((value) => ({ value, text: value }))}
				/>
			),
			PageInput: (
				<TextInput
					className={`${PageInputClass} ${prefix}_pageinput Pagination_pageinput`}
					type="number"
					name="Go to page"
					value={typedPage}
					onChange={(e) => {
						this.setState({ typedPage: e.target.value });
					}}
					inputProps={{ max: maxPage, min: 1 }}
				/>
			),
			GoToPageButton: (
				<GenericButton
					className={`${GoToPageButtonClass} ${prefix}_gotopagebutton Pagination_gotopagebutton`}
					text={'Go to page'}
					onClick={(e) => {
						if (currentPage !== typedPage) {
							this.setState(
								{
									currentPage: typedPage
								},
								() => {
									this.refetchData();
								}
							);
						}
					}}
					disabled={typedPage > maxPage}
				/>
			),
			PageCount: (
				<div className={`${PageCountClass} ${prefix}_pagecount Pagination_pagecount`}>
					Pg. {currentPage} of {maxPage}
				</div>
			),
			ItemCount: (
				<div className={`${ItemCountClass} ${prefix}_itemcount Pagination_itemcount`}>
					{itemsPerPage * (currentPage - 1) + 1}-{totalCount <= itemsPerPage ? (
						totalCount
					) : itemsPerPage * currentPage <= totalCount ? (
						itemsPerPage * currentPage
					) : (
						totalCount
					)}{' '}
					of {totalCount}
				</div>
			),
			movePage: this.movePage.bind(null, maxPage)
		});
	}
}

export default Pagination;
