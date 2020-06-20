import React, { Component } from 'react';

import Icon from '../../components/Icon/Icon';
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
						<Icon
							icon="chevronleft"
							className={`${StackCompsLeftClass + ' ' || ''}${prefix ? prefix + 'left ' : ''}StackComps_left`}
							onClick={(e) => {
								if (currentIndex > 0) {
									moveLeft();
									if (refetchData) refetchData(currentIndex - 1);
								}
							}}
							popoverText="Move left"
						/>
					);

					const StackCompsRight = (
						<Icon
							icon="chevronright"
							className={`${StackCompsRightClass + ' ' || ''}${prefix ? prefix + 'right ' : ''}StackComps_right`}
							onClick={(e) => {
								if (currentIndex !== stack.length - 1) {
									moveRight();
									if (refetchData) refetchData(currentIndex + 1);
								}
							}}
							popoverText="Move right"
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
							key={'StackComps_gotoinput'}
						/>
					);

					const StackCompsGotoButton = (
						<Icon
							icon="playcirclefilled"
							className={`${StackCompsGotoButtonClass + ' ' || ''}${prefix
								? prefix + 'gotobutton '
								: ''}StackComps_gotobutton`}
							onClick={(e) => {
								if (refetchData) refetchData(parseInt(this.TextInput.TextField.value) - 1);
							}}
							popoverText={`Go to stack ${this.TextInput ? this.TextInput.TextField.value : '0'} item`}
						/>
					);

					const StackCompsDeleteLeft = (
						<Icon
							icon="deletesweep"
							className={`${StackCompsDeleteLeftClass + ' ' || ''}${prefix
								? prefix + 'deleteleft '
								: ''}StackComps_deleteleft`}
							onClick={(e) => {
								this.removeFromStack('left');
							}}
							popoverText={`Remove leftwards stack items`}
							appendToKey="DeleteLeft"
						/>
					);

					const StackCompsDelete = (
						<Icon
							popoverText={`Remove current stack item`}
							onClick={this.removeCurrentIndex}
							icon="delete"
							className={`${StackCompsDeleteClass + ' ' || ''}${prefix ? prefix + 'delete ' : ''}StackComps_delete`}
						/>
					);

					const StackCompsDeleteRight = (
						<Icon
							icon="deletesweep"
							className={`${StackCompsDeleteRightClass + ' ' || ''}${prefix
								? prefix + 'deleteright '
								: ''}StackComps_deleteright`}
							onClick={(e) => {
								this.removeFromStack('right');
							}}
							popoverText={`Remove rightwards stack items`}
							appendToKey="DeleteRight"
						/>
					);

					const StackCompsRemoveDups = (
						<Icon
							icon="filecopy"
							className={`${StackCompsRemoveDupsClass + ' ' || ''}${prefix
								? prefix + 'removedups '
								: ''}StackComps_removedups`}
							onClick={removeDuplicates}
							popoverText={`Remove duplicates`}
						/>
					);

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
