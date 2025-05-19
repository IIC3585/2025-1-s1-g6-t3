<script>
	import { books } from '$lib/stores/books';
	import BookCard from './BookCard.svelte';
	import AddBookModal from './AddBookModal.svelte';
	import { page } from '$app/stores';

	let showAddModal = false;

	$: category = $page.url.searchParams.get('category') || 'all';
	$: filteredBooks = category === 'all' 
		? $books 
		: category === 'reading'
		? $books.filter(book => book.isReading)
		: category === 'favorites'
		? $books.filter(book => book.isFavorite)
		: $books;
</script>

<svelte:head>
	<title>MyBooks - Your Personal Library</title>
</svelte:head>

<div class="books-grid">
	{#each filteredBooks as book (book.id)}
		<BookCard {book} />
	{:else}
		<p class="no-books">No books found in this category. Add some books to get started!</p>
	{/each}
</div>

<button class="add-book" on:click={() => showAddModal = true}>+</button>

<AddBookModal 
	show={showAddModal} 
	on:close={() => showAddModal = false}
/>

<style>
	.books-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 1rem;
		padding: 1rem;
	}

	.no-books {
		grid-column: 1 / -1;
		text-align: center;
		padding: 2rem;
		color: #6c757d;
	}

	.add-book {
		position: fixed;
		bottom: 2rem;
		right: 2rem;
		width: 60px;
		height: 60px;
		border-radius: 50%;
		background-color: #3498db;
		color: white;
		border: none;
		font-size: 2rem;
		cursor: pointer;
		box-shadow: 0 2px 5px rgba(0,0,0,0.2);
		transition: transform 0.2s;
	}

	.add-book:hover {
		transform: scale(1.1);
	}
</style>