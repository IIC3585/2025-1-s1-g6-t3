<script>
	import '../app.css';
	import Header from './Header.svelte';
	import Sidebar from './Sidebar.svelte';
</script>

<div class="app">
	<Header />
	<div class="content">
		<Sidebar />
		<main>
			<slot />
		</main>
	</div>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	.content {
		display: flex;
		flex: 1;
	}

	main {
		flex: 1;
		padding: 1rem;
	}

	@media (max-width: 768px) {
		.content {
			flex-direction: column;
		}
	}
</style>