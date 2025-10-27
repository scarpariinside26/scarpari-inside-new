<script>
	import { onMount } from 'svelte';
	
	let eventi = [];
	let nuovoEvento = {
		titolo: '',
		data: '',
		ora: '20:00',
		luogo: '',
		max_giocatori: 10
	};
	
	onMount(async () => {
		// Carica eventi esistenti
		await caricaEventi();
	});
	
	async function caricaEventi() {
		try {
			// Implementeremo dopo
			eventi = [];
		} catch (error) {
			console.error('Errore caricamento eventi:', error);
		}
	}
	
	function aggiungiEvento() {
		if (!nuovoEvento.titolo || !nuovoEvento.data) {
			alert('Compila titolo e data!');
			return;
		}
		
		eventi = [...eventi, { ...nuovoEvento, id: Date.now() }];
		nuovoEvento = {
			titolo: '',
			data: '',
			ora: '20:00',
			luogo: '',
			max_giocatori: 10
		};
		
		alert('Evento aggiunto! (Simulazione)');
	}
</script>

<svelte:head>
	<title>Eventi - Scarpari Inside</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 py-8">
	<!-- Header -->
	<div class="max-w-4xl mx-auto px-4 mb-8">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold text-gray-900">🗓️ Gestione Eventi</h1>
				<p class="text-gray-600">Crea e gestisci gli eventi di calcetto</p>
			</div>
			<a href="/" class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition">
				← Torna alla Home
			</a>
		</div>
	</div>

	<div class="max-w-4xl mx-auto px-4">
		<!-- Form Nuovo Evento -->
		<div class="bg-white rounded-lg shadow p-6 mb-8">
			<h2 class="text-xl font-semibold mb-4">Crea Nuovo Evento</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">Titolo Evento</label>
					<input 
						bind:value={nuovoEvento.titolo}
						type="text" 
						placeholder="Es: Calcetto Venerdì Sera"
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">Data</label>
					<input 
						bind:value={nuovoEvento.data}
						type="date" 
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">Ora</label>
					<input 
						bind:value={nuovoEvento.ora}
						type="time" 
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">Luogo</label>
					<input 
						bind:value={nuovoEvento.luogo}
						type="text" 
						placeholder="Es: Campo Comunale"
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">Max Giocatori</label>
					<input 
						bind:value={nuovoEvento.max_giocatori}
						type="number" 
						min="4"
						max="20"
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
				<div class="flex items-end">
					<button 
						on:click={aggiungiEvento}
						class="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition font-semibold"
					>
						➕ Crea Evento
					</button>
				</div>
			</div>
		</div>

		<!-- Lista Eventi -->
		<div class="bg-white rounded-lg shadow">
			<div class="px-6 py-4 border-b">
				<h2 class="text-xl font-semibold">Eventi Programmati</h2>
			</div>
			
			{#if eventi.length === 0}
				<div class="p-8 text-center text-gray-500">
					<p class="text-lg">Nessun evento programmato</p>
					<p class="text-sm">Crea il primo evento usando il form sopra!</p>
				</div>
			{:else}
				<div class="divide-y">
					{#each eventi as evento (evento.id)}
						<div class="p-6 hover:bg-gray-50 transition">
							<div class="flex items-center justify-between">
								<div class="flex-1">
									<h3 class="text-lg font-semibold text-gray-900">{evento.titolo}</h3>
									<div class="flex items-center space-x-4 mt-2 text-sm text-gray-600">
										<span>📅 {evento.data}</span>
										<span>🕐 {evento.ora}</span>
										<span>📍 {evento.luogo || 'Da definire'}</span>
										<span>👥 Max {evento.max_giocatori} giocatori</span>
									</div>
								</div>
								<div class="flex space-x-2">
									<button class="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition">
										Gestisci
									</button>
									<button class="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition">
										Elimina
									</button>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>
