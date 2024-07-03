#!/usr/bin/env node

import { exec } from 'child_process';
import fs from 'fs';
import { options } from './commands.js';
import { initiateProcess } from './createXML.js';
const os = new os_func();

/**
 * @description make promise call for shell command
 * @author Gaurav Trivedi
 * @date 01-23-2022
 */
function os_func() {
	this.execCommand = function (cmd, callback) {
		exec(cmd, (error, stdout, stderr) => {
			if (error) {
				console.error(`exec error: ${error}`);
				return;
			}
			callback(stdout);
		});
	}
}

/**
 * @description to check the file with delta changes for creating package.xml
 * @author Gaurav Trivedi
 * @date 01-23-2022
 */
function checkDelta() {
	if (!options.file && options.sourceBranch && options.targetBranch) {
		options.sourceBranch = options.localGit ? options.sourceBranch : `origin/${options.sourceBranch}`;
		options.targetBranch = options.localGit ? options.targetBranch : `origin/${options.targetBranch}`;
		const mergeIdCommand = `git merge-base ${options.sourceBranch} ${options.targetBranch}`;
		os.execCommand(mergeIdCommand, function (mergeId) {
			mergeId = mergeId.replace('\n', '').trim();
			const diffCommand = options.destructiveChanges ? `git diff --name-only --diff-filter=D ${mergeId} ${options.sourceBranch}` : `git diff --name-only --diff-filter=ACMRTUXB ${mergeId} ${options.sourceBranch}`;
			os.execCommand(diffCommand, function (gitDiffResponse) {
				options.file = options.file ? options.file : `${process.cwd()}/diff-file-git.txt`;
				options.deleteFile = true;
				fs.writeFileSync(options.file, gitDiffResponse);
				initiateProcess();
			});
		});
	} else if (options.file) {
		initiateProcess();
	}
}

checkDelta();
export { options };