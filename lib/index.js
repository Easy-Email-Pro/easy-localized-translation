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
    shell
        .exec(`${grep} -Phrzoe "(?<=[^a-zA-Z]${keyword}\\()[\\n\\s\\t]*([\\"\`\\'])([\\d\\D]*?)\\1(?=([\\n\\s\\t]*)[\\),])" ${config.path}`, { silent: true })
        .exec(`${grep} -Pzoe "(?<=([\\"\\\`\\']))[\\d\\D]*(?=\\1)" `, { silent: true })
        .to(tempFile);
    const content = fs.readFileSync(tempFile, {
        encoding: 'utf-8',
    });
    fs.rmSync(tempFile);
    const groups = content.split('\x00').filter(Boolean);
    words.push(...groups);
    return [...new Set(words)];
}
exports.extract = extract;
const a = extract({
    path: path.join(process.cwd(), 'example/default.tsx'),
});
console.log(a);
