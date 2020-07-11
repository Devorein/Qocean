const path = require('path');
const fs = require('fs-extra');
const mkdirp = require('mkdirp');
const { ParentBinLinker } = require('link-parent-bin');
const moveFile = require('move-file');
const rimraf = require('rimraf');

(async () => {
	try {
		await mkdirp('./server/node_modules/.bin/parent');
		await mkdirp('./client/node_modules/.bin/parent');

		const paths = [ '../server/node_modules/.bin/', '../client/node_modules/.bin/' ];
		for (let i = 0; i < paths.length; i++) {
			const _path = paths[i];
			const linker = new ParentBinLinker({
				childDirectoryRoot: path.resolve(__dirname, _path),
				linkDevDependencies: true,
				linkDependencies: false,
				linkLocalDependencies: false
			});
			await linker.linkBinsToChildren();
			// const parentBinDir = path.resolve(__dirname, _path + '/parent/node_modules/.bin');
			// const parentBinDirFiles = await fs.readdir(parentBinDir);
			// for (let i = 0; i < parentBinDirFiles.length; i++) {
			// 	const fileName = parentBinDirFiles[i];
			// 	const parentBinDirFile = path.join(parentBinDir, fileName);
			// 	await moveFile(parentBinDirFile, path.resolve(parentBinDir, `../../../${fileName}`));
			// 	console.log(`Successfully moved ${fileName}`);
			// }
			// rimraf(path.resolve(parentBinDir, '../../'), () => {
			// 	console.log('Removed Parent');
			// });
			console.log('Linked parent bins');
		}
	} catch (e) {
		console.error('Error Linking packages', e);
	}
})();
