<!-- src/components/events/EventList.svelte -->
<script>
  import EventCard from './EventCard.svelte'
  
  export let events = []
</script>

<div class="event-list">
  {#each events as event}
    <EventCard {event} />
  {:else}
    <div class="empty-state">
      <p>Nessun evento programmato per questo periodo</p>
    </div>
  {/each}
</div>

<style>
  .event-list {
    padding-bottom: 20px;
  }
  
  .empty-state {
    text-align: center;
    padding: 40px 20px;
    color: var(--text-muted);
  }
</style>
