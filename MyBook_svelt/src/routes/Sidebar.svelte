<script>
	const categories = [
		{ id: 'all', name: 'All Books' },
		{ id: 'reading', name: 'Currently Reading' },
		{ id: 'favorites', name: 'Favorites' }
	];
</script>

<aside>
	<nav>
		<h2>Categories</h2>
		<ul>
			{#each categories as category}
				<li>
					<a href="/?category={category.id}">{category.name}</a>
				</li>
			{/each}
		</ul>
	</nav>
</aside>

<style>
	aside {
		width: 250px;
		background-color: #f8f9fa;
		padding: 1rem;
		border-right: 1px solid #dee2e6;
	}

	h2 {
		font-size: 1.25rem;
		margin-bottom: 1rem;
		color: #2c3e50;
	}

	ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	li {
		margin-bottom: 0.5rem;
	}

	a {
		color: #2c3e50;
		text-decoration: none;
		padding: 0.5rem;
		display: block;
		border-radius: 4px;
		transition: background-color 0.2s;
	}

	a:hover {
		background-color: #e9ecef;
	}

	@media (max-width: 768px) {
		aside {
			width: 100%;
			border-right: none;
			border-bottom: 1px solid #dee2e6;
		}
	}
</style>