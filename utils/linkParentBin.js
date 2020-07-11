const fs = require('fs-extra');
const path = require('path');
const cmdShim = require('cmd-shim');
const { platform } = require('os');

function link(from, to) {
	if (platform() === 'win32') {
		return cmdShimIfExists(from, to);
	}
}

function cmdShimIfExists(from, to) {
	return new Promise((res, rej) => {
		cmdShim.ifExists(from, to, (err) => {
			if (err) {
				rej(err);
			} else {
				res(undefined);
			}
		});
	});
}

class ParentBinLinker {
	constructor(options) {
		this.options = options;
	}

	linkBin(binName, from, childPackage) {
		const to = path.join(this.options.childDirectoryRoot, childPackage, 'node_modules', '.bin', binName);
		link(from, to);
	}

	async linkBinsOfDependencies(childPackages, dependenciesToLink) {
		return Promise.all(
			dependenciesToLink.map(async (dependency) => {
				const moduleDir = path.join('node_modules', dependency);
				const packageFile = path.join(moduleDir, 'package.json');
				const content = await fs.readFile(packageFile, 'UTF-8');
				const pkg = JSON.parse(content.toString());
				if (pkg.bin) {
					const binaries = this.binariesFrom(pkg);
					return Promise.all(
						Object.keys(binaries).map((bin) =>
							Promise.all(
								childPackages.map((childPackage) =>
									this.linkBin(bin, path.resolve(moduleDir, binaries[bin]), childPackage)
								)
							)
						)
					);
				} else {
					return Promise.resolve(undefined);
				}
			})
		).then(() => void 0);
	}
	async linkBinsToChildren() {
		const contents = await fs.readFile('package.json', 'UTF-8');
		const pkg = JSON.parse(contents.toString());
		const allPromises = [];
		allPromises.push(await this.linkBinsOfDependencies([ 'client', 'server' ], Object.keys(pkg.devDependencies)));
		allPromises.push(await this.linkBinsOfDependencies([ 'client', 'server' ], Object.keys(pkg.dependencies)));
		return Promise.all(allPromises);
	}
	binariesFrom(pkg) {
		const isString = (val) => typeof val === 'string';
		return isString(pkg.bin) ? { [pkg.name]: pkg.bin } : pkg.bin;
	}
}

const binlinker = new ParentBinLinker({
	childDirectoryRoot: path.resolve(__dirname, '../')
});

(async function linkBins() {
	await binlinker.linkBinsToChildren();
})();
