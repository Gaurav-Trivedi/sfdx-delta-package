#!/usr/bin/env node
import { Command } from 'commander';
const program = new Command();

program
	.name('sfdx-delta-package')
	.description('Create delta package.xml from between two branches of Github')
	.version('1.0.0')
	.usage('-sb develop -tb master')
	.option('-u, --user-name <value>', 'salesforce instance user name or alias, if already defined, the Salesforce instance')
	.option('-f, --file <type>', 'Delta file path')
	.option('-sb, --source-branch <type>', 'Source Branch of Git')
	.option('-tb, --target-branch <type>', 'Target Branch of Git')
	.option('-pv, --package-version <type>', 'Package.xml version', '55.0')
	.option('-o, --output-path <type>', 'Output path', 'manifest/package.xml')
	.option('-d, --display-output', 'Display package.xml as an console output');

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
  
  Generate package.xml from source and target branch of GitHub with package.xml version as 53.0:
    $ sfdx-delta-package -sb source_branch -tb target_branch -pv 53.0

  Generate package.xml from delta file and store in different directory or folder:
    $ sfdx-delta-package -f file_path.txt -o main/profiles.xml

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
}

validateOptions();
export { options };