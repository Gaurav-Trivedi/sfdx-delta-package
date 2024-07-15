#!/usr/bin/env node
import { Command } from 'commander';
const program = new Command();

program
	.name('sfdx-delta-package')
	.description('Create delta package.xml from between two branches of Github')
	.version('2.1.0')
	.usage('-sb develop -tb master')
	.option('-f, --file <type>', 'Delta file path')
	.option('-sb, --source-branch <type>', 'Source Branch of Git')
	.option('-tb, --target-branch <type>', 'Target Branch of Git')
	.option('-v, --package-version <type>', 'Package.xml version', '60.0')
	.option('-o, --output-path <type>', 'Output path', 'manifest/package.xml')
	.option('-l, --local-git', 'Check changes in local git')
	.option('-display, --display-output', 'Display package.xml as an console output')
	.option('-d, --destructive-changes', 'To Create destructiveChanges.xml file for deleted files under destructive folder.');

program.on('--help', function () {
	console.log(`
  Examples:

  To get help:
    $ sfdx-delta-package --help
    $ sfdx-delta-package -h

  Generate package.xml with delta file:
    $ sfdx-delta-package -f file_path.txt

  Generate package.xml from source and target branch of GitHub:
    $ sfdx-delta-package -sb source_branch -tb target_branch
  
  Generate package.xml from source and target branch of GitHub with package.xml version as 57.0:
    $ sfdx-delta-package -sb source_branch -tb target_branch -v 57.0

  Generate package.xml from local source and target branch of Git branches:
    $ sfdx-delta-package -sb source_branch -tb target_branch -l

  Generate package.xml from delta file and store in different directory or folder:
    $ sfdx-delta-package -f file_path.txt -o main/profiles.xml
  
  Generate package.xml and destructiveChanges.xml for deleted files and store in destructive folder:
    $ sfdx-delta-package -sb source_branch -tb target_branch -v 60.0 -d

`);
});

program.parse(process.argv);
const options = program.opts();

/**
 * @description Options validation for CLI calls
 * @author Gaurav Trivedi
 * @date 01-23-2022
 */
function validateOptions() {
	if (!options.file && (!options.sourceBranch || !options.targetBranch)) {
		console.log('Please enter the file path or source and target branch name of git repo. For help use\n\t$ sfdx-delta-package -h');
		process.exit();
	}
	options.sourceBranch = options.sourceBranch ? options.sourceBranch.replace('origin/', '') : options.sourceBranch;
	options.targetBranch = options.targetBranch ? options.targetBranch.replace('origin/', '') : options.targetBranch;

	if (!options.packageVersion.includes('.0')) {
		options.packageVersion = `${options.packageVersion}.0`;
	}
	
	if (options.destructiveChanges) {
		options.outputPath = 'destructive/destructiveChanges.xml';
	}
}

validateOptions();
export { options };