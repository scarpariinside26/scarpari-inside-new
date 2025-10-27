<script>
	import { onMount } from 'svelte';
	
	let giocatori = [];
	let eventi = [];
	let squadreGenerate = [];
	let eventoSelezionato = '';
	let algoritmo = 'bilanciato'; // 'bilanciato' o 'casuale'
	
	// Giocatori di esempio per testing
	const giocatoriEsempio = [
		{ id: 1, nome: 'Mario Rossi', livello: 4 },
		{ id: 2, nome: 'Luca Bianchi', livello: 3 },
		{ id: 3, nome: 'Paolo Verdi', livello: 5 },
		{ id: 4, nome: 'Giuseppe Neri', livello: 2 },
		{ id: 5, nome: 'Antonio Gialli', livello: 4 },
		{ id: 6, nome: 'Francesco Blu', livello: 3 },
		{ id: 7, nome: 'Roberto Marroni', livello: 3 },
		{ id: 8, nome: 'Marco Arancioni', livello: 2 },
		{ id: 9, nome: 'Stefano Viola', livello: 4 },
		{ id: 10, nome: 'Andrea Celesti', livello: 3 }
	];
	
	onMount(async () => {
		// Carica dati per testing
		giocatori = giocatoriEsempio;
		eventi = [
			{ id: 1, titolo: 'Calcetto Venerdì Sera', data: '2024-12-20' },
			{ id: 2, titolo: 'Torneo Domenicale', data: '2024-12-22' }
		];
	});
	
	function generaSquadre() {
		if (giocatori.length < 4) {
			alert('Servono almeno 4 giocatori per generare le squadre!');
			return;
		}
		
		const giocatoriDisponibili = [...giocatori];
		
		if (algoritmo === 'bilanciato') {
			// Ordina per livello (migliori primi)
			giocatoriDisponibili.sort((a, b) => b.livello - a.livello);
			
			// Dividi in due squadre bilanciate
			const squadraA = [];
			const squadraB = [];
			
			for (let i = 0; i < giocatoriDisponibili.length; i++) {
				if (i % 2 === 0) {
					squadraA.push(giocatoriDisponibili[i]);
				} else {
					squadraB.push(giocatoriDisponibili[i]);
				}
			}
			
			squadreGenerate = [
				{ nome: 'Squadra A 🟥', giocatori: squadraA, livelloMedio: calcolaLivelloMedio(squadraA) },
				{ nome: 'Squadra B 🟦', giocatori: squadraB, livelloMedio: calcolaLivelloMedio(squadraB) }
			];
		} else {
			// Algoritmo casuale
			const giocatoriMescolati = [...giocatoriDisponibili].sort(() => Math.random() - 0.5);
			const meta = Math.ceil(giocatoriMescolati.length / 2);
			
			const squadraA = giocatoriMescolati.slice(0, meta);
			const squadraB = giocatoriMescolati.slice(meta);
			
			squadreGenerate = [
				{ nome: 'Squadra A 🟥', giocatori: squadraA, livelloMedio: calcolaLivelloMedio(squadraA) },
				{ nome: 'Squadra B 🟦', giocatori: squadraB, livelloMedio: calcolaLivelloMedio(squadraB) }
			];
		}
	}
	
	function calcolaLivelloMedio(giocatori) {
		if (giocatori.length === 0) return 0;
		const somma = giocatori.reduce((acc, g) => acc + g.livello, 0);
		return (somma / giocatori.length).toFixed(1);
	}
	
	function rigeneraSquadre() {
		generaSquadre();
	}
	
	function scambiaGiocatore(giocatore, daSquadra, aSquadra) {
		const squadraOrigine = squadreGenerate.find(s => s.nome === daSquadra);
		const squadraDestinazione = squadreGenerate.find(s => s.nome === aSquadra);
		
		if (squadraOrigine && squadraDestinazione) {
			// Rimuovi dalla squadra origine
			squadraOrigine.giocatori = squadraOrigine.giocatori.filter(g => g.id !== giocatore.id);
			// Aggiungi alla squadra destinazione
			squadraDestinazione.giocatori.push(giocatore);
			
			// Ricalcola livelli medi
			squadraOrigine.livelloMedio = calcolaLivelloMedio(squadraOrigine.giocatori);
			squadraDestinazione.livelloMedio = calcolaLivelloMedio(squadraDestinazione.giocatori);
			
			// Aggiorna l'array per triggerare il re-render
			squadreGenerate = [...squadreGenerate];
		}
	}
</script>

<svelte:head>
	<title>Genera Squadre - Scarpari Inside</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 py-8">
	<!-- Header -->
	<div class="max-w-7xl mx-auto px-4 mb-8">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold text-gray-900">⚽ Genera Squadre</h1>
				<p class="text-gray-600">Crea squadre bilanciate per le partite</p>
			</div>
			<a href="/" class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition">
				← Torna alla Home
			</a>
		</div>
	</div>

	<div class="max-w-7xl mx-auto px-4">
		<!-- Pannello Controlli -->
		<div class="bg-white rounded-lg shadow p-6 mb-8">
			<h2 class="text-xl font-semibold mb-4">Configura Generazione Squadre</h2>
			
			<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">Seleziona Evento</label>
					<select 
						bind:value={eventoSelezionato}
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="">-- Nessun evento selezionato --</option>
						{#each eventi as evento}
							<option value={evento.id}>{evento.titolo} - {evento.data}</option>
						{/each}
					</select>
				</div>
				
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">Algoritmo</label>
					<select 
						bind:value={algoritmo}
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="bilanciato">Bilanciato (per livello)</option>
						<option value="casuale">Casuale</option>
					</select>
				</div>
				
				<div class="flex items-end">
					<button 
						on:click={generaSquadre}
						class="w-full bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition font-semibold text-lg"
					>
						🎯 Genera Squadre
					</button>
				</div>
			</div>
			
			<div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
				<div class="flex items-start">
					<span class="text-blue-600 text-lg mr-2">💡</span>
					<div>
						<h3 class="font-semibold text-blue-800">Info Algoritmi</h3>
						<p class="text-blue-700 text-sm">
							<strong>Bilanciato:</strong> Crea squadre con livello medio simile<br>
							<strong>Casuale:</strong> Distribuzione casuale dei giocatori
						</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Giocatori Disponibili -->
		<div class="bg-white rounded-lg shadow mb-8">
			<div class="px-6 py-4 border-b">
				<h2 class="text-xl font-semibold">Giocatori Disponibili ({giocatori.length})</h2>
			</div>
			<div class="p-6">
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
					{#each giocatori as giocatore}
						<div class="border border-gray-200 rounded-lg p-4 text-center">
							<div class="text-lg font-semibold">{giocatore.nome}</div>
							<div class="flex justify-center mt-2">
								{#each Array(5) as _, i}
									<span class="text-lg {i < giocatore.livello ? 'text-yellow-500' : 'text-gray-300'}">
										★
									</span>
								{/each}
							</div>
							<div class="text-sm text-gray-500 mt-1">Liv. {giocatore.livello}</div>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Squadre Generate -->
		{#if squadreGenerate.length > 0}
			<div class="mb-6">
				<div class="flex items-center justify-between mb-4">
					<h2 class="text-2xl font-bold text-gray-900">Squadre Generate</h2>
					<button 
						on:click={rigeneraSquadre}
						class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition font-semibold"
					>
						🔄 Rigenera
					</button>
				</div>
				
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					{#each squadreGenerate as squadra}
						<div class="bg-white rounded-lg shadow-lg border-2 {squadra.nome.includes('A') ? 'border-red-200' : 'border-blue-200'}">
							<div class="bg-gradient-to-r {squadra.nome.includes('A') ? 'from-red-500 to-red-600' : 'from-blue-500 to-blue-600'} text-white px-6 py-4 rounded-t-lg">
								<h3 class="text-xl font-bold">{squadra.nome}</h3>
								<div class="flex items-center justify-between mt-2">
									<span>{squadra.giocatori.length} giocatori</span>
									<span class="bg-white bg-opacity-20 px-2 py-1 rounded text-sm">
										Liv. medio: {squadra.livelloMedio}
									</span>
								</div>
							</div>
							
							<div class="p-6">
								{#each squadra.giocatori as giocatore, index}
									<div class="flex items-center justify-between py-3 {index < squadra.giocatori.length - 1 ? 'border-b border-gray-100' : ''}">
										<div class="flex items-center space-x-3">
											<div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-semibold">
												{index + 1}
											</div>
											<div>
												<div class="font-medium">{giocatore.nome}</div>
												<div class="flex text-sm text-yellow-500">
													{#each Array(giocatore.livello) as _}
														★
													{/each}
												</div>
											</div>
										</div>
										
										{#if squadreGenerate.length === 2}
											<button 
												on:click={() => scambiaGiocatore(giocatore, squadra.nome, squadra.nome.includes('A') ? 'Squadra B 🟦' : 'Squadra A 🟥')}
												class="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition"
											>
												↔ Sposta
											</button>
										{/if}
									</div>
								{/each}
							</div>
						</div>
					{/each}
				</div>
				
				<!-- Bilanciamento -->
				<div class="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
					<div class="flex items-center justify-between">
						<div class="flex items-center">
							<span class="text-yellow-600 text-lg mr-2">⚖️</span>
							<div>
								<h3 class="font-semibold text-yellow-800">Bilanciamento Squadre</h3>
								<p class="text-yellow-700 text-sm">
									Differenza livello: <strong>{Math.abs(squadreGenerate[0].livelloMedio - squadreGenerate[1].livelloMedio)}</strong>
								</p>
							</div>
						</div>
						{#if Math.abs(squadreGenerate[0].livelloMedio - squadreGenerate[1].livelloMedio) <= 0.5}
							<span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
								✅ Ottimo bilanciamento!
							</span>
						{:else}
							<span class="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
								⚠️ Bilanciamento da migliorare
							</span>
						{/if}
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
