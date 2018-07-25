process.on('unhandledRejection', error => console.error(error));

const {readdir, readFile, writeFile} = require('fs').promises;
const phrase = require('paraphrase/double');
const marked = require('marked');
const reduce = require('await-reduce');

(async() => {
	const template = (await readFile('./template.html')).toString();

	const data = await reduce(
		(await readdir('./slides')).filter(name => name.endsWith('.md')),
		async(accumulator, slide) => Object.assign(
			accumulator,
			{[slide.replace(/^\d-/, '').replace(/.md$/, '')]: (
					await marked(
						(await readFile(`./slides/${slide}`)).toString(),
						{}
					)
				).trim()
			}
		),
		{}
	);

	writeFile(
		'./docs/index.html',
		phrase(template, data)
	);
})();
