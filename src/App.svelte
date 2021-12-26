<script>
	import RequestHelper from './helpers/request-helper';
	import {QUERIES} from './helpers/queries';

	RequestHelper.startFetchMyQuery(QUERIES.QUERY_Get_All());

	let movies = [];

	window.onload = async () => {
		const {lab3_movies} = await RequestHelper.startFetchMyQuery(QUERIES.QUERY_Get_All());
		movies = lab3_movies;
		renderTable();
	}

	const renderTable = () => {
		const table = document.querySelector('table');
		table.innerHTML = `
		<caption>Movies</caption>
			<tr>
				<th>Name</th>
				<th>Director</th>
				<th>Budget</th>
				<th>Gross</th>
			</tr>`
		movies.forEach((movie) => {
			table.innerHTML += `
			<tr>
				<td>${movie.title}</td>
				<td>${movie.director}</td>
				<td>${movie.budget}$</td>
				<td>${movie.gross}$</td>
			</tr>
			`;
		});
	};

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
	<button on:click={AddMovie}>Add movie</button>
	<table border="1"></table>
</main>

<style>
</style>
