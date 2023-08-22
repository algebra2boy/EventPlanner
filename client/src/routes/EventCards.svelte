<script>
  import { onMount } from "svelte";
  import { EventStore } from "./store";
  import axios from "axios";
  import EventCard from "./EventCard.svelte";

  // a list of events from the event microservices
  let events = {};

  // get all the events from the event service and write it to the store
  // when the website first renders or when the component needs to be re-mounted / re-rendered
  onMount(async () => {
    const response = await axios.get("http://localhost:3004/eventPlans/");
    const events = response.data;
    EventStore.set(events);
  });

  // subscribe any incoming events from eventstore set from onMount
  // or from the component where we create an event where EventStore.update is used from CreateEvent.svelte
  EventStore.subscribe((_events) => {
    console.log(`printing from event cards: ${JSON.stringify(_events)}`);
    events = _events;
  });
</script>

<!-- event card container -->
<div class="container px-4 px-lg-5 mt-5">
  <div
    class="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-3 justify-content-center"
  >
    <!-- this is where the event card view being rendered using a loop -->
    {#each Object.entries(events) as [_, event] (event.event_id)} 
      <EventCard event={event.data} id={event.event_id}/>
    {/each}
  </div>
</div>
