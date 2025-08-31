const { generateDiff } = require('./diffUtil');

const oldText = 'An attempt to acquire sensitive information by masquerading as a trustworthy entity in electronic communication.';
const newText = 'An attempt to trick individuals into revealing sensitive information through fraudulent emails, websites, or messages.';

const result = generateDiff(oldText, newText);
console.log(result);
