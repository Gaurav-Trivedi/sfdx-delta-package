## Create delta package.xml from between two branches of Github

### Install
```
npm install -g sfdx-delta-package
```
### Usage
```
sfdx-delta-package -sb develop -tb master
```

### Options
```
  -V, --version                  output the version number
  -u, --user-name <value>        salesforce instance user name or alias, if already defined, the Salesforce instance
  -f, --file <type>              Delta file path
  -sb, --source-branch <type>    Source Branch of Git
  -tb, --target-branch <type>    Target Branch of Git
  -pv, --package-version <type>  Package.xml version (default: "57.0")
  -o, --output-path <type>       Output path (default: "manifest/package.xml")
  -d, --display-output           Display package.xml as an console output
  -h, --help                     display help for command
```

### Examples
```
  To get help:
    $ sfdx-delta-package --help
    $ sfdx-delta-package -h

  Generate package.xml with delta file:
    $ sfdx-delta-package -f file_path.txt

  Generate package.xml from source and target branch of GitHub:
    $ sfdx-delta-package -sb source_branch -tb target_branch
  
  Generate package.xml from source and target branch of GitHub with package.xml version as 57.0:
    $ sfdx-delta-package -sb source_branch -tb target_branch -pv 57.0
  
  Generate package.xml from local source and target branch of Git branches:
    $ sfdx-delta-package -sb source_branch -tb target_branch -l

  Generate package.xml from delta file and store in different directory or folder:
    $ sfdx-delta-package -f file_path.txt -o main/profiles.xml
```

### Note
We can update the metadata coverage using [metadata.js](src/metadata.js) file. For full support on Salesforce metadata use this [metadata coverage report](https://developer.salesforce.com/docs/metadata-coverage).