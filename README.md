## Create delta package.xml from between two branches of Github

### Install
```
npm install -g sfdx-package-builder
```
### Usage
```
sfdx-package-builder -sb develop -tb master
```

### Options
```
  -V, --version                  output the version number
  -u, --user-name <value>        salesforce instance user name or alias, if already defined, the Salesforce instance
  -f, --file <type>              Delta file path
  -sb, --source-branch <type>    Source Branch of Git
  -tb, --target-branch <type>    Target Branch of Git
  -pv, --package-version <type>  Package.xml version (default: "55.0")
  -o, --output-path <type>       Output path (default: "manifest/package.xml")
  -d, --display-output           Display package.xml as an console output
  -h, --help                     display help for command
```

### Examples
```
  To get help:
    $ sfdx-package-builder --help
    $ sfdx-package-builder -h

  Generate package.xml with delta file:
    $ sfdx-package-builder -f file_path.txt

  Generate package.xml from source and target branch of GitHub:
    $ sfdx-package-builder -sb source_branch -tb target_branch
  
  Generate package.xml from source and target branch of GitHub with package.xml version as 53.0:
    $ sfdx-package-builder -sb source_branch -tb target_branch -pv 53.0

  Generate package.xml from delta file and store in different directory or folder:
    $ sfdx-package-builder -f file_path.txt -o main/profiles.xml
```

### Note
We can update the metadata coverage using [metadata.js](src/metadata.js) file. For full support on Salesforce metadata use this [metadata coverage report](https://developer.salesforce.com/docs/metadata-coverage).