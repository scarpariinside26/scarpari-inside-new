<script>
  export let event
  
  $: dateDisplay = formatEventDate(event.event_date)
  $: timeString = event.event_time?.substring(0, 5) || '19:40'
  
  function formatEventDate(dateString) {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    if (date.toDateString() === today.toDateString()) return 'Oggi'
    if (date.toDateString() === tomorrow.toDateString()) return 'Domani'
    
    return date.toLocaleDateString('it-IT', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'short' 
    })
  }
</script>

<div class="event-card">
  <div class="event-header">
    <h3 class="event-title">{event.title}</h3>
    <div class="event-meta">
      <span class="event-date">{dateDisplay} alle {timeString}</span>
    </div>
  </div>
  
  <div class="event-details">
    <span class="event-location">{event.location}</span>
    <span class="event-level">● {event.level}</span>
  </div>
  
  {#if !event.invitation_sent}
    <div class="invitation-notice">
      L'invito {#if event.invitation_schedule}parte alle 3 giorni prima{:else}partirà in 19 ore{/if}
    </div>
  {/if}
  
  <div class="event-stats">
    <div class="stat">
      <span class="stat-icon">⏰️</span>
      <span class="stat-count">{event.current_participants || 12}</span>
    </div>
    <div class="stat">
      <span class="stat-icon">⏰️</span>
      <span class="stat-count">2</span>
    </div>
    <div class="stat">
      <span class="stat-icon">⏰️</span>
      <span class="stat-count">51</span>
    </div>
    <div class="stat">
      <span class="stat-icon">⏰️</span>
      <span class="stat-count">26</span>
    </div>
  </div>
</div>

<style>
  .event-card {
    background: var(--bg-card);
    border-radius: 12px;
    padding: 16px;
    margin: 8px 16px;
    box-shadow: var(--shadow);
    border: 1px solid var(--border-light);
  }
  
  .event-header {
    margin-bottom: 8px;
  }
  
  .event-title {
    margin: 0 0 4px 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
  }
  
  .event-meta {
    font-size: 14px;
    color: var(--text-secondary);
  }
  
  .event-details {
    font-size: 14px;
    color: var(--text-secondary);
    margin-bottom: 12px;
  }
  
  .event-location {
    font-weight: 500;
    color: var(--text-primary);
  }
  
  .event-level {
    color: var(--primary-color);
  }
  
  .invitation-notice {
    font-size: 13px;
    color: var(--warning-color);
    margin-bottom: 12px;
    padding: 8px;
    background: color-mix(in srgb, var(--warning-color) 10%, transparent);
    border-radius: 6px;
    border: 1px solid color-mix(in srgb, var(--warning-color) 20%, transparent);
  }
  
  .event-stats {
    display: flex;
    gap: 16px;
  }
  
  .stat {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
    color: var(--text-muted);
  }
  
  .stat-icon {
    font-size: 16px;
  }
  
  .stat-count {
    font-weight: 500;
    color: var(--text-secondary);
  }
</style>
