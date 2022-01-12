<script>
	import RequestHelper from './helpers/request-helper';
	import { QUERIES } from './helpers/queries';
	import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
	import { setClient, subscribe, mutation } from "svelte-apollo";
	import { WebSocketLink } from "@apollo/client/link/ws";
	import { Stretch } from 'svelte-loading-spinners'
	import { writable } from 'svelte/store';

	const is_online = writable(true);
	const add_movie = {};
	const delete_movie = {};
	const is_displayed = writable(false);

	window.onoffline = () => {
		is_online.set(false);
	};

	window.ononline = () => {
		is_online.set(true);
	};

	function createApolloClient() {
		const wsLink = new WebSocketLink({
			uri: URI,
			options: {
				reconnect: true,
			},
		});

   		const cache = new InMemoryCache();
   		const client = new ApolloClient({
     		link: wsLink,
     		cache,
   		});

   		return client;
 	}


	const client = createApolloClient();
 	setClient(client);

	const movies = subscribe(QUERIES.SUBSCRIPTION_All_Movies);

	const convertToNumber = (string) => {
		return isNaN(+string) ? 0 : +string;
	};

	const AddMovie = async () => {
		const name = add_movie.name;
		const director = add_movie.director ? add_movie.director : "";
		const budget = convertToNumber(add_movie.budget);
		const gross = convertToNumber(add_movie.gross);

		if (!name) {
			return;
		}

		try {
			$is_displayed = true;
			const res = await RequestHelper.startExecuteMyMutation(QUERIES.MUTATION_Insert(name, director, budget, gross));
			$is_displayed = false;
		} catch (e) {
			console.error(e);
		}
	};

	const DeleteMovie = async (id) => {
		try {
			$is_displayed = true;
			const res = await RequestHelper.startExecuteMyMutation(QUERIES.MUTATION_Delete(id));
			$is_displayed = false;
		} catch (e) {
			console.error(e);
		}
	}
</script>

<main>
	{#if $movies.loading}
		<div>
    		<Stretch />
  		</div>
	{:else if !$is_online}
		<div>Offline</div>
 	{:else if $movies.error}
   		<div>Error: {$movies.error.message}</div>
	{:else if $movies.data}
	<div class="input_block">
		<input bind:value={add_movie.name} placeholder="Title" id="name">
		<input bind:value={add_movie.director} placeholder="Director" id="director">
		<input bind:value={add_movie.budget} placeholder="Budget" id="budget">
		<input bind:value={add_movie.gross} placeholder="Gross" id="gross">
		<button on:click={AddMovie}>Add movie</button>
	</div>
	<div class="delete_block">
		<input bind:value={delete_movie.name} placeholder="Title" id="delete_name" class="delete_name">
		<button on:click={DeleteMovie}>Delete movie</button>
	</div>
	<table border="1">
		<caption>Movies</caption>
			<tr>
				<th>Name</th>
				<th>Director</th>
				<th>Budget</th>
				<th>Gross</th>
			</tr>

		{#each $movies.data.lab3_movies as movie (movie.id)}
			<tr>
				<td>{movie.title}</td>
				<td>{movie.director}</td>
				<td>{movie.budget}</td>
				<td>{movie.gross}</td>
				<button class="delete_btn" id={movie.id} on:click={DeleteMovie(movie.id)}>Delete</button>
			</tr>
		{/each}
	</table>
	<div class={$is_displayed ? "display_block" : "display_none"}>
    	<Stretch />
  	</div>
	{/if}
</main>

<style>
:root {
	--green-color: #01ac2c;
	--purple-color: #7200c2;
}

.input_block {
	display: flex;
	width: 100%;
	justify-content: space-between;
}

.delete_block {
	display: flex;
	width: 100%;
	justify-content: space-between;
}

button {
	background-color: var(--green-color);
}

.display_block {
	display: block;
}

.display_none {
	display: none;
}

table {
	width: 100%;
}

tr:nth-child(even) {
	background-color: var(--green-color);
}

tr:nth-child(odd) {
	background-color: var(--purple-color);
}
</style>
