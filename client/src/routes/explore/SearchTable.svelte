<script>
  import { YelpStore } from "../store";
  let business = []; // an array of business

  YelpStore.subscribe((_yelpData) => {
    business = _yelpData;
  });
</script>

{#if JSON.stringify(business) !== JSON.stringify([])}
  <div class="container mt-3">
    <table class="table table-bordered table-hover">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col" class="center-text">Name</th>
          <th scope="col" class="center-text">Rating</th>
          <th scope="col" class="center-text">Transcations</th>
          <th scope="col" class="center-text">Address</th>
          <th scope="col" class="center-text">Phone Number</th>
          <th scope="col" class="center-text">Image</th>
        </tr>
      </thead>

      <tbody>
        <!-- iterate over all the business places -->
        {#each business as bus, index (bus.id)}
          <tr>
            <th scope="row">{index + 1}</th>
            <td class="center-text"><a href={bus.url}>{bus.name}</a></td>
            <td class="center-text">{bus.rating}</td>

            {#if bus.transactions.length == 0}
              <td class="center-text">None</td>
            {:else}
              <td class="center-text">{bus.transactions.join()}</td>
            {/if}

            <td class="center-text">{bus.location.display_address.join()}</td>

            {#if bus.display_phone.length === 0}
              <td class="center-text">None</td>
            {:else}
              <td class="center-text">{bus.display_phone}</td>
            {/if}
            <td class="center-text"
              ><img
                src={bus.image_url}
                alt={bus.name}
                width="100px"
                height="100px"
              /></td
            >
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}

<style>
  .center-text {
    text-align: center;
  }
</style>
