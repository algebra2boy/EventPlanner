<script>
  import Modal from "$components/Modal/PopUpModal.svelte";
  import { PeopleStore } from "$stores/store.js";
  import axios from "axios";
  export let event = {};
  export let id; // the event id

  // people info
  let name = "";
  let email = "";
  let isEmailSelected = false; // whether people has selected email options

  // all the people who has sign up for the event
  let people = [];

  // whether to show the modal
  let showSeePeopleModal = false;
  let showSignUpModal = false;

  // passing this async function to the pop up modal (functional programming practice!!)
  // send request to people service to store user's name and their email
  const sendRequestToStorePeopleInfo = async () => {
    const response = await axios.post("http://localhost:3001/people", {
      headers: { "Content-Type": "application/json" },
      data: {
        event_id: id,
        name: name,
        email: email,
        isEmailSelected, isEmailSelected,
        event: event
      },
    });
  };

  // an async function to send a request to the people service to
  // get a list of people coming with that event id
  const sendRequestToSeePeople = async () => {
    const response = await axios.get(`http://localhost:3001/people/${id}`);
    PeopleStore.set(response.data);
  };

  PeopleStore.subscribe((_people) => {
    people = _people;
  })
</script>

<div class="col mb-5">
  <div class="card h-100">
    <img class="card-img-top" alt={event.eventName} src={event.imageUrl} />
    <div class="card-body">
      <h2 class="card-title">{event.eventName}</h2>
      <h3 class="card-subtitle">
        {event.startDateString} - {event.endDateString}
      </h3>
      <p class="card-text">{event.locationDetails}</p>
      <h5 class="card-text footnote">{event.locationName}</h5>
    </div>
    {#if event.signUpOnLine}
      <div class="text-center button-container">
        <button
          type="button"
          class="btn btn-info"
          on:click={async () => {
            await sendRequestToSeePeople();
            showSeePeopleModal = true;
          }}>Checklist</button
        >
        <button
          type="button"
          class="btn btn-success"
          on:click={() => {
            showSignUpModal = true;
          }}>Sign up!</button
        >
      </div>
    {/if}
  </div>
</div>

<!-- modal to show the user when has signed up for the event -->
<Modal
  bind:showModal={showSeePeopleModal}
  closeMessage={"Ready to attend!"}
  action={() => {}}
>
  <h3 class="display-6">Check who is coming!</h3>
  <div class="container mt-3">
    <table class="table table-bordered table-hover">
      <!-- table head -->
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col"><center>Name</center></th>
          <th scope="col"><center>Email</center></th>
        </tr>
      </thead>

      <tbody>
        <!-- iterate over all the person -->
        {#each people as person, index (person.email)}
          <tr>
            <!-- table data cell -->
            <th scope="row">{index + 1}</th>
            <td><center>{person.name}</center></td>
            <td><center>{person.email}</center></td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</Modal>

<!-- modal to show the user when they want to sign up for the event -->
<Modal
  bind:showModal={showSignUpModal}
  closeMessage={"Finished"}
  action={() => sendRequestToStorePeopleInfo()}
>
  <form>
    <h3 class="display-6">Sign up for this event!</h3>
    <div class="form-group">
      <input
        id="firstName"
        name="firstName"
        type="text"
        class="form-control"
        placeholder="First name"
        required
        bind:value={name}
      />
    </div>
    <div class="form-group">
      <input
        id="userEmail"
        name="userEmail"
        type="email"
        class="form-control"
        placeholder="Email"
        required
        bind:value={email}
      />
    </div>
    <label>
      <input
        id="isEmailSelected"
        name="isEmailSelected"
        type="checkbox"
        bind:checked={isEmailSelected}
      />
      Would you like get an email remainder?
    </label>
  </form>
</Modal>

<style>
  .col {
    font-family: Helvetica;
  }

  .card {
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 30px;
    box-shadow: 0px 2px 20px rgba(0, 0, 0, 0.1);
  }

  /* i got the color from colorhunt */
  .card:hover {
    background-color: #eee0c9;
  }

  .card-img-top {
    max-height: 180px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 30px;
  }

  .card-body {
    padding: 20px;
  }

  .card-title {
    font-size: xx-large;
    font-weight: 600;
    margin-bottom: 15px;
  }
  .card-subtitle {
    font-size: medium;
    font-weight: 350;
    margin-bottom: 15px;
  }

  .footnote {
    font-size: medium;
    font-weight: 300;
  }

  .card-title:hover,
  .card-subtitle:hover,
  .card-text:hover {
    text-decoration: underline;
  }

  .btn {
    margin-bottom: 10px;
  }

  .card-text {
    margin-bottom: 10px;
  }
</style>
