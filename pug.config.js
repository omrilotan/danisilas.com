const MarkdownIt = require('markdown-it');

const md = new MarkdownIt({ html: true });

module.exports = {
	filters: {
		md: text => md.render(text)
	}
};
