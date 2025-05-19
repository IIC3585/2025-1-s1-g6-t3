<script context="module" lang="ts">
  export interface Book {
	id: string;
	title: string;
	author: string;
	coverUrl: string;
	rating: number;
	isFavorite: boolean;
	isReading: boolean;
  }
</script>

<script lang="ts">
  import { books } from '$lib/stores/books';

  export let book: Book;

  function handleClick(): void {
	// …
  }
</script>


<div class="book-card">
	<div class="cover-container">
		<img src={book.coverUrl} alt={book.title} class="cover" on:click={handleClick} />
		<div class="indicators">
			{#if book.isFavorite}
				<span class="indicator favorite">★</span>
			{/if}
			{#if book.isReading}
				<span class="indicator reading">📖</span>
			{/if}
		</div>
	</div>
	<div class="info">
		<h3>{book.title}</h3>
		<p class="author">{book.author}</p>
		<div class="rating">
			{#each Array(5) as _, i}
				<span class={i < book.rating ? 'star filled' : 'star'}>★</span>
			{/each}
		</div>
		<div class="actions">
			<button 
				class="action-btn reading" 
				class:active={book.isReading}
				on:click={() => books.toggleReading(book.id)}
			>
				{book.isReading ? 'Remove from Reading' : 'Add to Reading'}
			</button>
			<button 
				class="action-btn favorite" 
				class:active={book.isFavorite}
				on:click={() => books.toggleFavorite(book.id)}
			>
				{book.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
			</button>
		</div>
	</div>
</div>

<style>
	.book-card {
		background: white;
		border-radius: 8px;
		overflow: hidden;
		box-shadow: 0 2px 5px rgba(0,0,0,0.1);
		transition: transform 0.2s;
	}

	.book-card:hover {
		transform: translateY(-5px);
	}

	.cover-container {
		position: relative;
	}

	.cover {
		width: 100%;
		height: 300px;
		object-fit: cover;
		cursor: pointer;
	}

	.indicators {
		position: absolute;
		top: 10px;
		right: 10px;
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.indicator {
		font-size: 24px;
		text-shadow: 0 2px 4px rgba(0,0,0,0.3);
	}

	.indicator.favorite {
		color: #FFD700;
	}

	.indicator.reading {
		color: #3498db;
	}

	.info {
		padding: 1rem;
	}

	h3 {
		margin: 0;
		font-size: 1.1rem;
		color: #2c3e50;
	}

	.author {
		color: #6c757d;
		margin: 0.5rem 0;
	}

	.rating {
		color: #ffd700;
		margin-bottom: 1rem;
	}

	.star {
		font-size: 1.2rem;
	}

	.star.filled {
		color: #ffd700;
	}

	.actions {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.action-btn {
		padding: 0.5rem;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		transition: background-color 0.2s;
		color: white;
		font-size: 0.9rem;
	}

	.action-btn.reading {
		background-color: #3498db;
	}

	.action-btn.favorite {
		background-color: #4CAF50;
	}

	.action-btn:hover {
		opacity: 0.9;
	}

	.action-btn.active {
		background-color: #2c3e50;
	}
</style>