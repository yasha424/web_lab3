<script>
	import RequestHelper from './helpers/request-helper';
	import { QUERIES } from './helpers/queries';
	import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
	import { setClient, subscribe, mutation } from "svelte-apollo";
	import { WebSocketLink } from "@apollo/client/link/ws";

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
		const name = document.getElementById('name').value;
		const director = document.getElementById('director').value;
		const budget = convertToNumber(document.getElementById('budget').value);
		const gross = convertToNumber(document.getElementById('gross').value);

		if (!name) {
			return;
		}
		const res = await RequestHelper.startExecuteMyMutation(QUERIES.MUTATION_Insert(name, director, budget, gross));
	};

	const DeleteMovie = async () => {
		const name = document.getElementById('delete_name').value;
		if (!name) {
			return;
		}
		const res = await RequestHelper.startExecuteMyMutation(QUERIES.MUTATION_Delete(name));
	}
</script>

<main>
	{#if $movies.loading}
   		<div>loading ...</div>
 	{:else if $movies.error}
   		<div>Error!</div>
	{:else if $movies.data}
	<div class="input_block">
		<input placeholder="Name" id="name">
		<input placeholder="Director" id="director">
		<input placeholder="Budget" id="budget">
		<input placeholder="Gross" id="gross">
		<button on:click={AddMovie}>Add movie</button>
	</div>
	<div class="delete_block">
		<input placeholder="Name" id="delete_name" class="delete_name">
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

		{#each $movies.data.lab3_movies as movie}
			<tr>
				<td>{movie.title}</td>
				<td>{movie.director}</td>
				<td>{movie.budget}</td>
				<td>{movie.gross}</td>
			</tr>
		{/each}
	</table>
	{/if}
</main>

<style>
.input_block {
	display: flex;
	width: 100%;
	justify-content: space-between;
}

.delete_name {
	width: 100%;
}

button {
	min-width: 20%;
}

.delete_block {
	display: flex;
	justify-content: space-between;
}

table {
	width: 100%;
}
</style>
