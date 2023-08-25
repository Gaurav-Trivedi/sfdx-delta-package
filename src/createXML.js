#!/usr/bin/env node

import fs from 'fs';
import { metadata } from './metadata.js';
import { options } from './index.js';

const trailingPath = "force-app/main/default/";
let contents;
let componentMap = new Object();

/**
 * @description Building the XML file 
 * @author Gaurav Trivedi
 * @date 01-23-2022
 * @param {*} fContantMap
 */
function buildPackageXml(fContantMap) {
	let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n<Package xmlns="http://soap.sforce.com/2006/04/metadata">\n';
	Object.keys(fContantMap).forEach((a) => {
		xmlContent += '\t<types>\n';
		fContantMap[a].forEach((x) => {
			xmlContent += '\t\t<members>' + x + '</members>\n';
		});
		xmlContent += '\t\t<name>' + a + '</name>\n';
		xmlContent += '\t</types>\n';
	});
	xmlContent += `\t<version>${options.packageVersion}</version>\n`;
	xmlContent += '</Package>';
	if (options.displayOutput) {
		console.log(xmlContent);
	}
	createFile(xmlContent);
}

/**
 * @description file creation 
 * @author Gaurav Trivedi
 * @date 01-23-2022
 * @param {*} xml data for xml file creation
 */
function createFile(xml) {
	let filePath;
	const outputPath = options.outputPath;
	const fileName = outputPath.lastIndexOf('.xml') > -1 ? outputPath.substring(outputPath.lastIndexOf('/') + 1) : 'package.xml';
	const dir = outputPath.substring(0, outputPath.lastIndexOf('/'));
	if (dir) {
		filePath = dir.split('/').reduce(
			(directories, directory) => {
				directories += `${directory}/`;
				if (!fs.existsSync(directories)) {
					fs.mkdirSync(directories);
				}
				return directories;
			},
			'',
		);
	} else {
		filePath = outputPath;
		if (!fs.existsSync(outputPath)) {
			fs.mkdirSync(outputPath);
		}
	}
	fs.writeFile(`${filePath}/${fileName}`, xml, function (err) {
		if (err) {
			console.log(err);
		}
	});
}
/**
 * @description read the flat file generate the xml object
 * @author Gaurav Trivedi
 * @date 01-23-2022
 */
function filterMetadataEntries() {
	Object.entries(metadata).forEach((entry) => {
		const componentArray = [];
		contents.split("\n").forEach(function (row) {
			if (row.includes(trailingPath)) {
				row = row.replace(trailingPath, "");
				if (
					!row.includes("jsconfig") &&
					((row.split("/")[0].toLowerCase() === entry[0].toLocaleLowerCase() &&
						row.split("/")[1]) ||
						(row.split("/")[2] &&
							row.split("/")[2].toLocaleLowerCase() ===
							entry[0].toLocaleLowerCase()))
				) {
					let create = false,
						folder,
						element;
					const splitPath = row.split("/");
					if (entry[1].all) {
						element = "*";
						create = true;
					} else if (entry[1].folder) {
						let comp = "";
						if (splitPath[2]) {
							comp = "/" + splitPath[2].split(".")[0];
						}
						if (splitPath[1] && splitPath[1].split(".")[0]) {
							folder = splitPath[1].split(".")[0];
						} else if (splitPath[1]) {
							folder = splitPath[1];
						}
						element = folder + comp;
						create = true;
					} else if (
						splitPath[2] &&
						splitPath[3] &&
						entry[1].objectRelated &&
						splitPath[2].toLocaleLowerCase() === entry[0].toLocaleLowerCase()
					) {
						// For Fields, compactLayouts, businessprocess, listview, FieldSets, weblinks, recordTypes, sharingReasons and validationrule
						row = row.split("/")[3].substr(0, splitPath[3].lastIndexOf("."));
						element = splitPath[1] + "." + row.substr(0, row.lastIndexOf("."));
						create = true;
					} else if (entry[1].dotNotation) {
						const dotElements = splitPath[1].split(".");
						element = dotElements[0] + "." + dotElements[1];
						create = true;
					} else if (!entry[1].objectRelated && row.includes(".")) {
						element = splitPath[1].split(".")[0];
						create = true;
					}
					if (create) {
						// add folders to the package
						if (folder && !componentArray.includes(folder)) {
							componentArray.push(folder);
						}
						if (!componentArray.includes(element)) {
							componentArray.push(element);
						}
						componentMap[entry[1].name] = componentArray;
					}
				}
			}
		});
	});
	buildPackageXml(componentMap);
}


/**
 * @description invoke the process for package.xml creation
 * @author Gaurav Trivedi
 * @date 01-23-2022
 */
function initiateProcess() {
	contents = fs.readFileSync(options.file, "utf8");
	if (options.deleteFile) {
		fs.unlinkSync(options.file);
	}
	if (!contents) {
		console.log("No change found.");
		process.exit();
	} else {
		contents = contents.replace(/\\/g,"/");
	}
	filterMetadataEntries();
}
export { initiateProcess };
