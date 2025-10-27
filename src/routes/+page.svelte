  import { page } from '$app/stores'
  import EventList from '../../components/events/EventList.svelte'
  
  export let data
  
  let activeTab = 'questa-settimana'
  const tabs = [
    { id: 'questa-settimana', label: 'Questa settimana' },
    { id: 'prossima-settimana', label: 'La prossima settimana' },
    { id: 'novembre', label: '10 - 16 novembre' }
  ]
  
  // Filtra eventi in base al tab selezionato
  $: filteredEvents = data.events?.filter(event => {
    const eventDate = new Date(event.event_date)
    const today = new Date()
    
    switch(activeTab) {
      case 'questa-settimana':
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1))
        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(startOfWeek.getDate() + 6)
        return eventDate >= startOfWeek && eventDate <= endOfWeek
        
      case 'prossima-settimana':
        const nextWeekStart = new Date(today)
        nextWeekStart.setDate(today.getDate() + (8 - today.getDay()))
        const nextWeekEnd = new Date(nextWeekStart)
        nextWeekEnd.setDate(nextWeekStart.getDate() + 6)
        return eventDate >= nextWeekStart && eventDate <= nextWeekEnd
        
      default:
        return true
    }
  }) || []
</script>

<div class="home-page">
  <!-- HEADER ESATTO come nello screenshot -->
  <header class="app-header">
    <h1>Home</h1>
  </header>

  <!-- NAVIGATION TABS esatta -->
  <nav class="events-nav">
    <div class="nav-tabs">
      {#each tabs as tab}
        <button 
          class:active={activeTab === tab.id}
          on:click={() => activeTab = tab.id}
        >
          {tab.label}
        </button>
      {/each}
    </div>
  </nav>

  <!-- SEZIONE EVENTI identica -->
  <section class="events-section">
    <div class="section-header">
      <h2>Eventi</h2>
      <div class="event-filters">
        <button class="filter-btn active">Post</button>
        <button class="filter-btn">Pagamenti</button>
        <button class="filter-btn">Sondaggi</button>
      </div>
    </div>

    <div class="time-indicator">
      <span>In programma ▼</span>
    </div>

    <!-- LISTA EVENTI -->
    <EventList events={filteredEvents} />
  </section>
</div>

<style>
  .home-page {
    background: var(--bg-primary);
    min-height: 100vh;
  }
  
  .app-header {
    padding: 16px;
    border-bottom: 1px solid var(--border-light);
    background: var(--bg-card);
  }
  
  .app-header h1 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    color: var(--text-primary);
  }
  
  .events-nav {
    border-bottom: 1px solid var(--border-light);
    background: var(--bg-card);
  }
  
  .nav-tabs {
    display: flex;
    padding: 0 16px;
  }
  
  .nav-tabs button {
    padding: 12px 16px;
    border: none;
    background: none;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    font-size: 14px;
    color: var(--text-secondary);
    transition: all 0.2s ease;
  }
  
  .nav-tabs button.active {
    border-bottom-color: var(--primary-color);
    color: var(--primary-color);
    font-weight: 500;
  }
  
  .section-header {
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--border-light);
    background: var(--bg-card);
  }
  
  .section-header h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: var(--text-primary);
  }
  
  .event-filters {
    display: flex;
    gap: 8px;
  }
  
  .filter-btn {
    padding: 6px 12px;
    border: 1px solid var(--border-light);
    border-radius: 16px;
    background: var(--bg-card);
    font-size: 12px;
    cursor: pointer;
    color: var(--text-secondary);
  }
  
  .filter-btn.active {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
  }
  
  .time-indicator {
    padding: 12px 16px;
    background: var(--bg-secondary);
    font-size: 14px;
    color: var(--text-secondary);
    border-bottom: 1px solid var(--border-light);
  }
</style>
