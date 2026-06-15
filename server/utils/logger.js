const fs = require('fs');
const path = require('path');
const logDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
const file = path.join(logDir, 'server.log');

function write(level, args) {
	const line = `[${new Date().toISOString()}] [${level}] ${args.map(a => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ')}\n`;
	fs.appendFileSync(file, line);
}

const info = (...args) => { console.log('[INFO]', ...args); write('INFO', args); };
const error = (...args) => { console.error('[ERROR]', ...args); write('ERROR', args); };

module.exports = { info, error };
