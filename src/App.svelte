<script>
	import RequestHelper from './helpers/request-helper';
	import { QUERIES } from './helpers/queries';
	import { ApolloClient, InMemoryCache } from '@apollo/client';
	import { setClient, subscribe } from "svelte-apollo";
	import { WebSocketLink } from "@apollo/client/link/ws";
	import { Stretch } from 'svelte-loading-spinners'
	import { isDisplayed } from './store';

	let is_online = true;
	let error = '';
	$: error && setTimeout(() => {error = '';}, 2000);
	const add_movie = {};
	const delete_movie = {};


	window.onoffline = () => {
		is_online = false;
	};

	window.ononline = () => {
		is_online = true;
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

		add_movie.name = '';
		add_movie.director = '';
		add_movie.budget = '';
		add_movie.gross = '';

		if (!name) {
			return;
		}

		try {
			const res = await RequestHelper.startExecuteMyMutation(QUERIES.MUTATION_Insert(name, director, budget, gross));
			console.log(res);
		} catch (e) {
			error = e;
			console.error(e);
		}
	};

	const DeleteMovie = async (id) => {
		try {
			const res = await RequestHelper.startExecuteMyMutation(QUERIES.MUTATION_Delete(id));
		} catch (e) {
			error = e;
			console.error(e);
		}
	}
</script>

<main>
	{#if $movies.loading}
		<div>
    		<Stretch />
  		</div>
	{:else if !is_online}
		<div>Offline</div>
 	{:else if $movies.error}
   		<div>Error: {$movies.error.message}</div>
	{:else if error}
		<div> Error: {error}</div>
	{:else if $movies.data}
	<div class="input_block">
		<input bind:value={add_movie.name} placeholder="Title">
		<input bind:value={add_movie.director} placeholder="Director">
		<input bind:value={add_movie.budget} placeholder="Budget">
		<input bind:value={add_movie.gross} placeholder="Gross">
		<button on:click={AddMovie}>Add movie</button>
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
				<button class="delete_btn" on:click={DeleteMovie(movie.id)}>Delete</button>
			</tr>
		{/each}
	</table>
	<div class={$isDisplayed ? "display_block" : "display_none"}>
    	<Stretch />
  	</div>
	{/if}
</main>

<style>
:root {
	--green-color: #01ac2c;
	--purple-color: #7200c2;
	--delete-btn-color: #d60000;
	--black-color: #000;
}

.input_block {
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

.delete_btn {
	font-weight: bold;
	color: var(--black-color);
	background-color: var(--delete-btn-color);
	margin: auto;
	width: 100%;
	height: 100%;
}

tr:nth-child(even) {
	background-color: var(--green-color);
}

tr:nth-child(odd) {
	background-color: var(--purple-color);
}
</style>
