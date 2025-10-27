<script>
	import { onMount } from 'svelte';
	import { database } from '$lib/database/index.js';
	
	let giocatori = [];
	let nuovoGiocatore = {
		nome: '',
		email: '',
		telefono: '',
		livello: 3
	};
	let isLoading = true;
	
	onMount(async () => {
		await caricaGiocatori();
	});
	
	async function caricaGiocatori() {
		try {
			isLoading = true;
			giocatori = await database.getGiocatori();
		} catch (error) {
			console.error('Errore caricamento giocatori:', error);
			alert('Errore nel caricamento dei giocatori');
		} finally {
			isLoading = false;
		}
	}
	
	async function aggiungiGiocatore() {
		if (!nuovoGiocatore.nome) {
			alert('Inserisci almeno il nome!');
			return;
		}
		
		try {
			const giocatoreAggiunto = await database.addGiocatore(nuovoGiocatore);
			giocatori = [...giocatori, giocatoreAggiunto];
			
			nuovoGiocatore = {
				nome: '',
				email: '',
				telefono: '',
				livello: 3
			};
			
			alert('Giocatore aggiunto con successo!');
		} catch (error) {
			console.error('Errore aggiunta giocatore:', error);
			alert('Errore nell\'aggiunta del giocatore');
		}
	}
	
	async function eliminaGiocatore(id) {
		if (!confirm('Sei sicuro di voler eliminare questo giocatore?')) {
			return;
		}
		
		try {
			await database.deleteGiocatore(id);
			giocatori = giocatori.filter(g => g.id !== id);
			alert('Giocatore eliminato con successo!');
		} catch (error) {
			console.error('Errore eliminazione giocatore:', error);
			alert('Errore nell\'eliminazione del giocatore');
		}
	}
</script>

<svelte:head>
	<title>Giocatori - Scarpari Inside</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 py-8">
	<!-- Header -->
	<div class="max-w-7xl mx-auto px-4 mb-8">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold text-gray-900">👥 Gestione Giocatori</h1>
				<p class="text-gray-600">Gestisci la lista dei giocatori</p>
			</div>
			<a href="/" class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition">
				← Torna alla Home
			</a>
		</div>
	</div>

	<div class="max-w-7xl mx-auto px-4">
		<!-- Form Nuovo Giocatore -->
		<div class="bg-white rounded-lg shadow p-6 mb-8">
			<h2 class="text-xl font-semibold mb-4">Aggiungi Nuovo Giocatore</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<!-- I campi del form rimangono uguali -->
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
					<input 
						bind:value={nuovoGiocatore.nome}
						type="text" 
						placeholder="Nome e Cognome"
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
					<input 
						bind:value={nuovoGiocatore.email}
						type="email" 
						placeholder="email@esempio.com"
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">Telefono</label>
					<input 
						bind:value={nuovoGiocatore.telefono}
						type="tel" 
						placeholder="333 1234567"
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">Livello (1-5)</label>
					<select 
						bind:value={nuovoGiocatore.livello}
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="1">1 - Principiante</option>
						<option value="2">2 - Intermedio Basso</option>
						<option value="3" selected>3 - Intermedio</option>
						<option value="4">4 - Avanzato</option>
						<option value="5">5 - Esperto</option>
					</select>
				</div>
			</div>
			<div class="mt-4">
				<button 
					on:click={aggiungiGiocatore}
					class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition font-semibold"
				>
					➕ Aggiungi Giocatore
				</button>
			</div>
		</div>

		<!-- Lista Giocatori -->
		<div class="bg-white rounded-lg shadow">
			<div class="px-6 py-4 border-b">
				<h2 class="text-xl font-semibold">Lista Giocatori ({giocatori.length})</h2>
			</div>
			
			{#if isLoading}
				<div class="p-8 text-center text-gray-500">
					<p class="text-lg">Caricamento giocatori in corso...</p>
				</div>
			{:else if giocatori.length === 0}
				<div class="p-8 text-center text-gray-500">
					<p class="text-lg">Nessun giocatore registrato</p>
					<p class="text-sm">Aggiungi il primo giocatore usando il form sopra!</p>
				</div>
			{:else}
				<div class="overflow-x-auto">
					<table class="w-full">
						<thead class="bg-gray-50">
							<tr>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giocatore</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contatti</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Livello</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Azioni</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-200">
							{#each giocatori as giocatore (giocatore.id)}
								<tr class="hover:bg-gray-50 transition">
									<td class="px-6 py-4 whitespace-nowrap">
										<div class="text-sm font-medium text-gray-900">{giocatore.nome}</div>
									</td>
									<td class="px-6 py-4 whitespace-nowrap">
										<div class="text-sm text-gray-500">
											{#if giocatore.email}
												<div>📧 {giocatore.email}</div>
											{/if}
											{#if giocatore.telefono}
												<div>📞 {giocatore.telefono}</div>
											{/if}
										</div>
									</td>
									<td class="px-6 py-4 whitespace-nowrap">
										<div class="flex items-center">
											{#each Array(5) as _, i}
												<span class="text-lg {i < giocatore.livello ? 'text-yellow-500' : 'text-gray-300'}">
													★
												</span>
											{/each}
											<span class="ml-2 text-sm text-gray-500">({giocatore.livello}/5)</span>
										</div>
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm">
										<button 
											on:click={() => eliminaGiocatore(giocatore.id)}
											class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
										>
											Elimina
										</button>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</div>
	</div>
</div>
