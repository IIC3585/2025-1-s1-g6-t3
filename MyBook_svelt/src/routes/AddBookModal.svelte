<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { books } from '$lib/stores/books';

	interface BookResult {
    id: string;
    title: string;
    author: string;
    coverUrl: string;
    description: string;
    rating: number;
    category: string;
  }

	export let show = false;
	const dispatch = createEventDispatcher();
	
	let searchQuery = '';
	let searchResults: BookResult[] = [];
	let loading = false;
	let error: string | null = null;

	async function searchBooks() {
		if (!searchQuery.trim()) return;
		
		loading = true;
		error = null;
		
		try {
			const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}`);
			const data = await response.json();
			
			searchResults = data.items?.map(item => ({
				id: item.id,
				title: item.volumeInfo.title,
				author: item.volumeInfo.authors?.[0] || 'Unknown',
				coverUrl: item.volumeInfo.imageLinks?.thumbnail || '/placeholder-cover.png',
				description: item.volumeInfo.description || '',
				rating: 0,
				category: 'to-read'
			})) || [];
		} catch (e) {
			error = 'Failed to fetch books. Please try again.';
		} finally {
			loading = false;
		}
	}

	function addBook(book) {
		books.addBook(book);
		dispatch('close');
	}

	function handleKeydown(event) {
		if (event.key === 'Enter') {
			searchBooks();
		}
	}
</script>

{#if show}
	<div class="modal-backdrop" on:click={() => dispatch('close')}>
		<div class="modal" on:click|stopPropagation>
			<div class="modal-header">
				<h2>Add New Book</h2>
				<button class="close-button" on:click={() => dispatch('close')}>×</button>
			</div>
			
			<div class="search-container">
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search for a book..."
					on:keydown={handleKeydown}
				/>
				<button on:click={searchBooks} disabled={loading}>Search</button>
			</div>

			{#if error}
				<p class="error">{error}</p>
			{/if}

			{#if loading}
				<p class="loading">Searching...</p>
			{/if}

			<div class="results">
				{#each searchResults as book}
					<div class="book-result">
						<img src={book.coverUrl} alt={book.title} />
						<div class="book-info">
							<h3>{book.title}</h3>
							<p>{book.author}</p>
						</div>
						<button on:click={() => addBook(book)}>Add</button>
					</div>
				{/each}
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
	}

	.modal {
		background: white;
		border-radius: 8px;
		width: 90%;
		max-width: 600px;
		max-height: 80vh;
		overflow-y: auto;
		padding: 1rem;
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.close-button {
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
	}

	.search-container {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	input {
		flex: 1;
		padding: 0.5rem;
		border: 1px solid #ddd;
		border-radius: 4px;
	}

	button {
		padding: 0.5rem 1rem;
		background: #3498db;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}

	button:disabled {
		background: #95a5a6;
		cursor: not-allowed;
	}

	.results {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.book-result {
		display: flex;
		gap: 1rem;
		align-items: center;
		padding: 0.5rem;
		border: 1px solid #ddd;
		border-radius: 4px;
	}

	.book-result img {
		width: 60px;
		height: 90px;
		object-fit: cover;
	}

	.book-info {
		flex: 1;
	}

	.book-info h3 {
		margin: 0;
		font-size: 1rem;
	}

	.book-info p {
		margin: 0.5rem 0 0 0;
		color: #666;
	}

	.error {
		color: #e74c3c;
		text-align: center;
	}

	.loading {
		text-align: center;
		color: #666;
	}
</style>