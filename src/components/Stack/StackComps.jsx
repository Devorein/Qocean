import React, { Component } from 'react';

import getIcons from '../../Utils/getIcons';
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
					const StackCompsLeft = getIcons({
						icon: 'chevronleft',
						className: `${StackCompsLeftClass + ' ' || ''}${prefix ? prefix + 'left ' : ''}StackComps_left`,
						onClick: (e) => {
							if (currentIndex > 0) {
								moveLeft();
								if (refetchData) refetchData(currentIndex - 1);
							}
						},
						popoverText: 'Move left'
					});

					const StackCompsRight = getIcons({
						icon: 'chevronright',
						className: `${StackCompsRightClass + ' ' || ''}${prefix ? prefix + 'right ' : ''}StackComps_right`,
						onClick: (e) => {
							if (currentIndex !== stack.length - 1) {
								moveRight();
								if (refetchData) refetchData(currentIndex + 1);
							}
						},
						popoverText: 'Move right'
					});
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
							key={'StackComps_gotoinput'}
						/>
					);

					const StackCompsGotoButton = getIcons({
						icon: 'playcirclefilled',
						className: `${StackCompsGotoButtonClass + ' ' || ''}${prefix
							? prefix + 'gotobutton '
							: ''}StackComps_gotobutton`,
						onClick: (e) => {
							if (refetchData) refetchData(parseInt(this.TextInput.TextField.value) - 1);
						},
						popoverText: `Go to stack ${this.TextInput ? this.TextInput.TextField.value : '0'} item`
					});

					const StackCompsDeleteLeft = getIcons({
						icon: 'deletesweep',
						className: `${StackCompsDeleteLeftClass + ' ' || ''}${prefix
							? prefix + 'deleteleft '
							: ''}StackComps_deleteleft`,
						onClick: (e) => {
							this.removeFromStack('left');
						},
						popoverText: `Remove leftwards stack items`,
						appendToKey: 'DeleteLeft'
					});

					const StackCompsDelete = getIcons({
						icon: 'delete',
						className: `${StackCompsDeleteClass + ' ' || ''}${prefix ? prefix + 'delete ' : ''}StackComps_delete`,
						onClick: this.removeCurrentIndex,
						popoverText: `Remove current stack item`
					});

					const StackCompsDeleteRight = getIcons({
						icon: 'deletesweep',
						className: `${StackCompsDeleteRightClass + ' ' || ''}${prefix
							? prefix + 'deleteright '
							: ''}StackComps_deleteright`,
						onClick: (e) => {
							this.removeFromStack('right');
						},
						popoverText: `Remove rightwards stack items`,
						appendToKey: 'DeleteRight'
					});

					const StackCompsRemoveDups = getIcons({
						icon: 'filecopy',
						className: `${StackCompsRemoveDupsClass + ' ' || ''}${prefix
							? prefix + 'removedups '
							: ''}StackComps_removedups`,
						onClick: removeDuplicates,
						popoverText: `Remove duplicates`
					});

					const StackCompsStat = (
						<div
							key={'StackComps_stat'}
							className={`${StackCompsStatClass + ' ' || ''}${prefix ? prefix + 'stat ' : ''}StackComps_stat`}
						>
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
