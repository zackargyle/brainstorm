const exec      = require('child_process').exec;
const fs        = require('fs');
const invariant = require('invariant')
const path      = require('path');

const COMPONENT_DIR = 'component';
const Regex = {
    FILE_NAME: /{{ FILE_NAME }}/g,
    COMPONENT_NAME: /{{ COMPONENT_NAME }}/g,
};

/**
 * This updates a few file names so that they match the new
 * component name.
 *
 * @param {string} child - the child file/dir name
 * @param {object} args - dict with fileName and componentName
 */
function mapChild(child, args) {
    switch(child) {
        case 'container.js':
            return `${args.fileName}.js`;
        case 'layout.js':
            return `${args.fileName}-layout.js`;
        default:
            return child;
    }
}

/**
 * Recursively copy each file under the <COMPONENT_DIR>, first
 * verifying that the directory does not exist.
 *
 * @param {object} args - dict with fileName and componentName
 */
function createComponentFiles(args) {
    const inputPath = path.join(__dirname, COMPONENT_DIR);
    const outputPath = path.join(process.cwd(), args.fileName);

    invariant(
        !fs.existsSync(outputPath),
        `A directory at <${outputPath}> already exists. Maybe choose a different name?`
    );
    copyDirectory(inputPath, outputPath, args);
}

/**
 * Recursively copy each file from <inputPath> to <outputPath>. The copying
 * will also update the file based on <args>.
 *
 * @param {object} inputPath - the full path to copy from
 * @param {object} outputPath - the full path to copy to
 * @param {object} args - dict with fileName and componentName
 */
function copyDirectory(inputPath, outputPath, args) {
    fs.mkdirSync(outputPath);
    fs.readdirSync(inputPath).forEach(child => {
        const inputPathChild = path.join(inputPath, child);
        const outputPathChild = path.join(outputPath, mapChild(child, args));
        const stats = fs.statSync(inputPathChild);
        if (stats.isDirectory()) {
            copyDirectory(inputPathChild, outputPathChild, args);
        } else {
            copyAndUpdateFile(inputPathChild, outputPathChild, args);
        }
    });
}

/**
 * Write an updated version of the inputPath file that replaces all of the
 * COMPONENT_NAME and FILE_NAME variables with the args variables.
 *
 * @param {object} inputPath - the full path to copy from
 * @param {object} outputPath - the full path to copy to
 * @param {object} args - dict with fileName and componentName
 */
function copyAndUpdateFile(inputPath, outputPath, args) {
    const content = fs.readFileSync(inputPath, 'utf-8');
    const updatedContent = content
        .replace(Regex.FILE_NAME, args.fileName)
        .replace(Regex.COMPONENT_NAME, args.componentName);
    fs.writeFileSync(outputPath, updatedContent)
}

/**
 * Install npm packages and start the development server.
 *
 * @param {object} args - dict with fileName and componentName
 */
function executeShellCommands(args) {
    const fileName = args.fileName;
    const dir = path.join(process.cwd(), fileName);
    const install = `cd ${fileName} && npm install`;
    const openTextEditor = `${args.editor} ${dir}`;
    const startServer = `cd ${fileName} && npm start`;
    const openBrowser = `open -a ${args.browser} http://localhost:3000`;

    console.log('Running `npm install`. This may take a second...');
    execute(install, () => {
        execute(startServer, () => {
            execute(openBrowser);
            execute(openTextEditor);
        });
    });
}

/**
 * Execute shell command, and print out stdout data
 *
 * @param {string} command - valid shell command
 * @param {function} callback - the function to call command finishes
 */
const WEBPACK_READY_COMMAND = 'webpack: bundle is now VALID.';
var WEBPACK_READY = false;
function execute(command, callback) {
    var proc = exec(command, callback);
    proc.stdout.on('data', data => {
        console.log(data);
        // Special case for when the webpack bundle is ready.
        if (!WEBPACK_READY && data.includes(WEBPACK_READY_COMMAND)) {
            WEBPACK_READY = true;
            callback();
        }
    });
}

/**
 * Convert a dash-separated string into a CamelCase string.
 *
 * @param {object} str - the string to convert
 * @returns {str} the CamelCase string
 */
function dashToCamel(str) {
    return ('-' + str).replace(/-([a-z])/g, g => g[1].toUpperCase());
}

/**
 * Convert a dash-separated string into a CamelCase string.
 *
 * @param {object} str - the string to convert
 * @returns {str} the CamelCase string
 */
module.exports = function run(argv) {
    const fileName = argv._[0];
    invariant(
        typeof fileName === 'string',
        'Missing arg "component_name" in command'
    );
    const args = Object.assign({}, argv, {
        fileName: fileName,
        componentName: dashToCamel(fileName),
    });
    createComponentFiles(args);
    executeShellCommands(args);
}
