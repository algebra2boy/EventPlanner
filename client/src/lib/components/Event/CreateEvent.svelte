<script>
  import { onMount } from "svelte";
  import axios from "axios";
  import { EventStore } from "../../../stores/store.js";
  import { convertDateToString } from "$lib/utils/convertDate.js";

  // event card information
  let eventName = "";
  let startDateString = "";
  let endDateString = "";
  let image_Url = "";
  let locationName = "";
  let locationDetails = "";
  let signUpOnLine = false;

  // check the status of request
  let isSuccess = false;
  let isError = false;
  let requestError = "";

  // automatically convert date to string whenever user changes the date
  onMount(() => {
    startDateString = endDateString = convertDateToString();
    requestError = "";
  });

  // clear all the event details
  const clearEvent = () => {
    eventName = locationDetails = image_Url = locationName = "";
    startDateString = endDateString = "";
    signUpOnLine = false;
  };

  // send a request to event microservice to create an event
  const createEventBySendingRequestToEvents = async () => {
    try {
      const response = await axios.post("http://localhost:3004/eventPlans", {
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          eventName: eventName,
          startDateString: startDateString,
          endDateString: endDateString,
          imageUrl: image_Url,
          locationName: locationName,
          locationDetails: locationDetails,
          signUpOnLine: signUpOnLine,
        },
      });

      if (response.status === 201) {
        isError = false;
        isSuccess = true;
        const data = response.data;
        console.log(data);

        // update the store with the newest event
        EventStore.update((events) => {
          return { ...events, [data.event_id]: data };
        });
      }
    } catch (error) {
      isError = true;
      isSuccess = false;
      const response = error.response;
      const data = response.data;
      const _error = data.error;
      requestError = _error;
    }
  };
</script>

<div class="container">
  <div class="p-4 border rounded-corner">
    <h2 class="text-center">Create Event</h2>
    <form>
      <div class="form-group">
        <!-- svelte-ignore a11y-autofocus -->
        <input
          id="eventName"
          name="eventName"
          type="text"
          class="form-control"
          placeholder="Event Name"
          bind:value={eventName}
          autofocus
        />
      </div>

      <div class="form-group">
        <label for="startDate">Start Date: </label>
        <input id="startDate" type="date" class="form-control" bind:value={startDateString} />
      </div>

      <div class="form-group">
        <label for="endDate">End Date: </label>
        <input id ="endDate" type="date" class="form-control" bind:value={endDateString} />
      </div>

      <div class="form-group">
        <input
          id="imageURL"
          name="imageURL"
          type="text"
          class="form-control"
          placeholder="Image URL"
          bind:value={image_Url}
        />
      </div>

      <div class="form-group">
        <input
          id="locationName"
          name="locationName"
          type="text"
          class="form-control"
          placeholder="Location Name"
          bind:value={locationName}
        />
      </div>

      <div class="form-group">
        <textarea
          id="locationDetails"
          name="locationDetails"
          rows="3"
          bind:value={locationDetails}
          placeholder="Give this location a bit more details!"
        />
      </div>

      <label>
        <input
          id="signUpOnline"
          name="signUpOnline"
          type="checkbox"
          bind:checked={signUpOnLine}
        />
        Would you like people to sign up online?
      </label>

      <hr />

      <center>
        <button
          type="button"
          class="btn btn-danger"
          on:click={() => clearEvent()}>Clear Event</button
        >
        <button
          type="button"
          class="btn btn-primary"
          on:click={() => createEventBySendingRequestToEvents()}
          >Create Event</button
        >
      </center>
    </form>
  </div>
</div>

{#if isError}
  <center>
    <div class="alert alert-danger text-center" role="alert">
      {requestError}
    </div>
  </center>
{/if}

{#if isSuccess}
  <center>
    <div class="alert alert-success text-center">
      An event request has been successfully made
    </div>
  </center>
{/if}

<style>
  .container {
    margin-top: 20px;
    /* shrink ~ 50% of original size */
    width: 50%;
  }
  .rounded-corner {
    border-radius: 30px;
  }
  textarea {
    width: 100%;
    height: 100px;
  }
  .alert {
    margin-top: 20px;
    width: 45%;
  }
</style>
