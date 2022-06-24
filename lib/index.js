"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extract = void 0;
const fs = require("fs");
const path = require("path");
const shell = require("shelljs");
const os = require("os");
function extract(config) {
    const { keyword = 't' } = config;
    const grep = os.platform() === 'darwin' ? 'ggrep' : 'grep';
    const words = [];
    const tempFile = path.join(process.cwd(), `./_translate${+new Date()}.txt`);
    const result = shell.exec(`${grep} -Phrzoe "(?<=[^a-zA-Z]${keyword}\\()[\\n\\s\\t]*([\\"\\\`\\'])([\\d\\D]*?)(?=\\1([\\n\\s]*)(\\)|,))" ${config.path} | ${grep} -Phzoe "(?<=[\\"\\\`\\']).*" > ${tempFile}`);
    if (result.code === 1) {
        fs.rmSync(tempFile);
        console.log('\x1b[31m', 'No match content');
        return [];
    }
    if (result.code !== 0)
        throw new Error(result.stderr);
    const content = fs.readFileSync(tempFile, {
        encoding: 'utf-8',
    });
    fs.rmSync(tempFile);
    const groups = content.split('\x00').filter(Boolean);
    words.push(...groups);
    return [...new Set(words)];
}
exports.extract = extract;
