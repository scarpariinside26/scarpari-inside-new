<!-- src/routes/+page.svelte -->
<script>
  import EventList from '../../components/events/EventList.svelte'
  
  export let data
  
  let activeTab = 'questa-settimana'
  const tabs = [
    { id: 'questa-settimana', label: 'Questa settimana' },
    { id: 'prossima-settimana', label: 'La prossima settimana' },
    { id: 'novembre', label: '10 - 16 novembre' }
  ]
  
  $: filteredEvents = data.events || []
</script>

<!-- resto del codice invariato -->
