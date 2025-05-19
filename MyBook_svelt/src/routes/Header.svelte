<script>
	import { page } from '$app/stores';
</script>

<header>
	<nav>
		<ul>
			<li aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
				<a href="/">My Books</a>
			</li>
			<li aria-current={$page.url.pathname === '/bookstores' ? 'page' : undefined}>
				<a href="/bookstores">Bookstores</a>
			</li>
			<li aria-current={$page.url.pathname === '/stats' ? 'page' : undefined}>
				<a href="/stats">Stats</a>
			</li>
		</ul>
	</nav>
</header>

<style>
	header {
		background-color: #2c3e50;
		padding: 1rem;
		color: white;
	}

	nav ul {
		display: flex;
		list-style: none;
		margin: 0;
		padding: 0;
		gap: 1rem;
	}

	nav a {
		color: white;
		text-decoration: none;
		font-weight: 500;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		transition: background-color 0.2s;
	}

	nav a:hover {
		background-color: #34495e;
	}

	[aria-current='page'] a {
		background-color: #3498db;
	}
</style>