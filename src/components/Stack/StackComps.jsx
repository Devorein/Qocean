import React, { Component } from 'react';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import DeleteIcon from '@material-ui/icons/Delete';

import TextInput from '../Input/TextInput/TextInput';

import Stack from './Stack';

class StackComps extends Component {
	render() {
		const {
			StackCompsLeftClass,
			StackCompsGotoButtonClass,
			StackCompsRightClass,
			StackCompsGotoInputClass,
			StackCompsDeleteLeftClass,
			StackCompsDeleteClass,
			StackCompsDeleteRightClass,
			StackCompsRemoveDupsClass,
			StackCompsStatClass,
			prefix,
			refetchData,
			children
		} = this.props;

		return (
			<Stack>
				{(props) => {
					Object.entries(props).forEach(([ key, value ]) => (this[key] = value));
					const { StackState: { stack, currentIndex }, removeDuplicates, moveLeft, moveRight } = this;
					const StackCompsLeft = (
						<ChevronLeftIcon
							className={`${StackCompsLeftClass + ' ' || ''}${prefix ? prefix + 'left ' : ''}StackComps_left`}
							onClick={(e) => {
								if (currentIndex > 0) {
									moveLeft();
									if (refetchData) refetchData(currentIndex - 1);
								}
							}}
						/>
					);

					const StackCompsRight = (
						<ChevronRightIcon
							className={`${StackCompsRightClass + ' ' || ''}${prefix ? prefix + 'right ' : ''}StackComps_right`}
							onClick={(e) => {
								if (currentIndex !== stack.length - 1) {
									moveRight();
									if (refetchData) refetchData(currentIndex + 1);
								}
							}}
						/>
					);

					const StackCompsGotoInput = (
						<TextInput
							className={`${StackCompsGotoInputClass + ' ' || ''}${prefix
								? prefix + 'gotoinput '
								: ''}StackComps_gotoinput`}
							fullWidth={false}
							name={'History'}
							type="number"
							inputProps={{
								min: 1,
								max: stack.length
							}}
							ref={(r) => (this.TextInput = r)}
						/>
					);

					const StackCompsGotoButton = (
						<PlayCircleFilledIcon
							className={`${StackCompsGotoButtonClass + ' ' || ''}${prefix
								? prefix + 'gotobutton '
								: ''}StackComps_gotobutton`}
							onClick={(e) => {
								if (refetchData) refetchData(parseInt(this.TextInput.TextField.value) - 1);
							}}
						/>
					);

					const StackCompsDeleteLeft = (
						<DeleteSweepIcon
							className={`${StackCompsDeleteLeftClass + ' ' || ''}${prefix
								? prefix + 'deleteleft '
								: ''}StackComps_deleteleft`}
							onClick={(e) => {
								this.removeFromStack('left');
							}}
						/>
					);

					const StackCompsDelete = (
						<DeleteIcon
							onClick={this.removeCurrentIndex}
							className={`${StackCompsDeleteClass + ' ' || ''}${prefix ? prefix + 'delete ' : ''}StackComps_delete`}
						/>
					);

					const StackCompsDeleteRight = (
						<DeleteSweepIcon
							className={`${StackCompsDeleteRightClass + ' ' || ''}${prefix
								? prefix + 'deleteright '
								: ''}StackComps_deleteright`}
							onClick={(e) => {
								this.removeFromStack('right');
							}}
						/>
					);

					const StackCompsRemoveDups = (
						<FileCopyIcon
							className={`${StackCompsRemoveDupsClass + ' ' || ''}${prefix
								? prefix + 'removedups '
								: ''}StackComps_removedups`}
							onClick={(e) => {
								removeDuplicates();
							}}
						/>
					);

					const StackCompsStat = (
						<div className={`${StackCompsStatClass + ' ' || ''}${prefix ? prefix + 'stat ' : ''}StackComps_stat`}>
							{currentIndex + 1}/{stack.length} Items
						</div>
					);
					const StackComps = [
						StackCompsLeft,
						StackCompsRight,
						StackCompsGotoInput,
						StackCompsGotoButton,
						StackCompsDeleteLeft,
						StackCompsDelete,
						StackCompsDeleteRight,
						StackCompsRemoveDups,
						StackCompsStat
					];
					return children ? (
						children({ StackComps, ...props })
					) : (
						<div className="StackComps">{StackComps.map((StackComp) => StackComp)}</div>
					);
				}}
			</Stack>
		);
	}
}

export default StackComps;
