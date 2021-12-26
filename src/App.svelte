<script>
	import RequestHelper from './helpers/request-helper';
	import { QUERIES } from './helpers/queries';
	import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
	import { setClient, subscribe, mutation } from "svelte-apollo";
	import { WebSocketLink } from "@apollo/client/link/ws";

	function createApolloClient() {
		const wsLink = new WebSocketLink({
			uri: "wss://driven-panda-75.hasura.app/v1/graphql",
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

	const AddMovie = async  () => {
		const name = prompt("Movie title: ") ?? "" ;
		const director = prompt("Movie Director: ") ?? "" ;
		const budget = convertToNumber(prompt("Movie budget: ") ?? "");
		const gross = convertToNumber(prompt("Movie gross: ") ?? "");
		if (!name) {
			return;
		}
		const res = await RequestHelper.startExecuteMyMutation(QUERIES.MUTATION_Insert(name, director, budget, gross));
	};
</script>

<main>
	{#if $movies.loading}
   		<div>loading ...</div>
 	{:else if $movies.error}
   		<div>Error!</div>
	{:else if $movies.data}
	<button on:click={AddMovie}>Add movie</button>
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
</style>
