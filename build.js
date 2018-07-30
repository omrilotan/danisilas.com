process.on('unhandledRejection', error => console.error(error));

const {readdir, readFile, writeFile} = require('fs').promises;
const read = async file => (await readFile(file)).toString();
const phrase = require('paraphrase/double');
const reduce = require('await-reduce');
const marked = require('marked');
const {minify} = require('uglify-js');
const {transform} = require('babel-core');
const {promisify} = require('util');
const tocss = async(data) => (
	await promisify(
		require('node-sass').render
	)({data})
).css.toString();
const {processString} = require('uglifycss');

(async() => {
	const template = await read('./template.html');

	const data = await reduce(
		(await readdir('./chunks')).filter(name => !name.startsWith('.')),
		async(accumulator, slide) => Object.assign(
			accumulator,
			{
				[slide.replace(/^\d-/, '').replace(/.(\w*)$/, '')]: (await (async() => {
					const content = await read(`./chunks/${slide}`);

					switch (slide.split('.').pop()) {
						case 'md':
							return await marked(content, {});
						case 'js':
							return [
								transform,
								minify,
							].reduce(
								(input, fn) => fn(input).code,
								content
							);
						case 'scss':
							return await reduce(
								[
									tocss,
									processString,
								],
								async(input, fn) => await fn(input),
								content
							);
						default:
							return content;
					}
				})()).trim()
			}
		),
		{}
	);

	writeFile(
		'./docs/index.html',
		phrase(template, data)
	);

	writeFile(
		'./docs/sitemap.xml',
		sitemap()
	);
})();

const sitemap = (d = new Date()) => `<urlset xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  <url>
    <loc>https://danisilas.com/</loc>
    <lastmod>${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}T09:00:00+00:00</lastmod>
  </url>
</urlset>
`;

