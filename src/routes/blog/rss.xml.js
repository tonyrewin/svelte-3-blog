import get_posts from '../api/blog/_posts.js';
import { website as site } from '../../../package.json';

const months = ',Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec'.split( ',' );

function formatPubdate ( str ) {
	const [ y, m, d ] = str? str.split( '-' ) : [2012, 12, 25]
	return `${d} ${months[+m]} ${y}`;
}

const rss = `
<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">

<channel>
	<title>${site.title}</title>
	<link>${site.url}/blog</link>
	<description>${site.description}/description>
	<image>
		<url>${site.url}/favicon.png</url>
		<title>${site.title}</title>
		<link>${site.url}/blog</link>
	</image>
	${get_posts().map( post => `
		<item>
			<title>${post.metadata.title}</title>
			<link>${site.url}/blog/${post.slug}</link>
			<description>${post.metadata.description}</description>
			<pubDate>${formatPubdate(post.metadata.pubdate)}</pubDate>
		</item>
	` )}
</channel>

</rss>
`.replace( />[^\S]+/gm, '>' ).replace( /[^\S]+</gm, '<' ).trim();

export function get(req, res) {
	res.set({
		'Cache-Control': `max-age=${30 * 60 * 1e3}`,
		'Content-Type': 'application/rss+xml'
	});
	res.end(rss);
}