<script>
	import axios from 'axios';
	import { YelpStore } from '$stores/store.js';

	let location = ''; // this string indicates the geographic area to be used when searching for businesses.
	let limit = 1; // Number of results to return.
	let sort_by = 'best_match'; // Suggestion to the search algorithm that the results be sorted by one of the these modes: best_match, rating, review_count or distance.
	let term = ''; // Search term, e.g. "food" or "restaurants". The term may also be the business's name, such as "Starbucks".
	let price = '1'; // 1 is the cheapest, 4 is the most expensive

	function setToDefault() {
		location = '';
		limit = 1;
		sort_by = 'best_match';
		term = '';
		price = '1';
	}

	// send a request to the yelp microservice for the info
	async function getSearchFromYelpAPI() {
		const response = await axios.post('http://localhost:3003/business', {
			headers: {
				'Content-Type': 'application/json'
			},
			// in axios, we don't need to include the body manually like in fetch api
			// the following data is already in the request body
			data: {
				location: location,
				limit: limit,
				sort_by: sort_by,
				term: term,
				price: price
			}
		});

		// in axios, we don't need to manually await response.json()
		// the response already included the data as long as we do response.data
		YelpStore.set(response.data.businesses);
	}
</script>

<div class="container">
	<div class="p-4 border rounded-corner">
		<h2 class="text-center">Advanced Search</h2>
		<form>
			<div class="form-group">
				<!-- svelte-ignore a11y-autofocus -->
				<input
					id="location"
					name="location"
					type="text"
					class="form-control"
					placeholder="Location"
					autofocus
					bind:value={location}
				/>
			</div>

			<div class="form-group">
				<input
					id="term"
					name="term"
					type="text"
					class="form-control"
					placeholder="Search term"
					bind:value={term}
				/>
			</div>

			<div class="form-group">
				<label for="limit">Search limit:</label>
				<input
					id="limit"
					name="limit"
					type="number"
					class="form-control"
					min="1"
					max="10"
					bind:value={limit}
				/>
			</div>

			<div class="form-group">
				<label for="sort_by">Sort by:</label>
				<select id="sort_by" class="form-select" bind:value={sort_by}>
					<option value="best_match">best_match</option>
					<option value="rating">rating</option>
					<option value="review_count">review_count</option>
					<option value="distance">distance</option>
				</select>

				<label for="price">Price:</label>
				<select id="price" class="form-select" bind:value={price}>
					<option value="1">$</option>
					<option value="2">$$</option>
					<option value="3">$$$</option>
					<option value="4">$$$$</option>
				</select>
			</div>

			<hr />

			<center>
				<button type="button" class="btn btn-danger" on:click={() => setToDefault()}
					>Reset Search</button
				>
				<button type="button" class="btn btn-primary" on:click={() => getSearchFromYelpAPI()}
					>Search Place</button
				>
			</center>
		</form>
	</div>
</div>

<div>
	<center>
		<p>
			The <strong>Advanced Search</strong> utilizes the Yelp API to find the search result that fits
			your taste.
		</p></center
	>
</div>

<style>
	.container {
		margin-top: 20px;
		/* shrink ~ 50% of original size */
		width: 50%;
	}
	.rounded-corner {
		border-radius: 30px;
	}
</style>
