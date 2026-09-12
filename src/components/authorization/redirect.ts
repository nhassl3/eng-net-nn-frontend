// Only for embedded mode paths: '//evil.com' and 'https://...' - this is open redirect vulnerability.
export function resolveNext(search: string): string {
	const next = new URLSearchParams(search).get('next');
	if (!next || !next.startsWith('/') || next.startsWith('//')) {
		return '/';
	}
	return next;
}