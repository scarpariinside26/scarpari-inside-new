<script>
	import { onMount } from 'svelte';
	import { database } from '$lib/database/index.js';
	
	let giocatori = [];
	let statistiche = [];
	let filtroLivello = 'tutti';
	let ordinamento = 'punteggio';
	
	onMount(async () => {
		await caricaDati();
	});
	
	async function caricaDati() {
		giocatori = await database.getGiocatori();
		calcolaStatistiche();
	}
	
	function calcolaStatistiche() {
		statistiche = giocatori.map(giocatore => {
			// Simula statistiche basate sul livello e partite giocate
			const partiteGiocate = Math.floor(Math.random() * 20) + 5;
			const golFatti = Math.floor(partiteGiocate * giocatore.livello * 0.8);
			const assist = Math.floor(partiteGiocate * giocatore.livello * 0.5);
			const vittorie = Math.floor(partiteGiocate * 0.6);
			
			// Calcola punteggio complessivo
			const punteggio = 
				(giocatore.livello * 20) + 
				(golFatti * 3) + 
				(assist * 2) + 
				(vittorie * 5);
			
			return {
				...giocatore,
				partiteGiocate,
				golFatti,
				assist,
				vittorie,
				sconfitte: partiteGiocate - vittorie,
				punteggio,
				efficienza: ((golFatti + assist) / partiteGiocate).toFixed(2)
			};
		});
		
		applicaOrdinamento();
	}
	
	function applicaOrdinamento() {
		statistiche.sort((a, b) => {
			switch(ordinamento) {
				case 'punteggio':
					return b.punteggio - a.punteggio;
				case 'gol':
					return b.golFatti - a.golFatti;
				case 'assist':
					return b.assist - a.assist;
				case 'vittorie':
					return b.vittorie - a.vittorie;
				case 'efficienza':
					return b.efficienza - a.efficienza;
				default:
					return b.punteggio - a.punteggio;
			}
		});
	}
	
	function filtraPerLivello() {
		if (filtroLivello === 'tutti') {
			calcolaStatistiche();
		} else {
			const giocatoriFiltrati = giocatori.filter(g => g.livello == filtroLivello);
			// Ricalcola statistiche solo per giocatori filtrati
			statistiche = giocatoriFiltrati.map(giocatore => {
				const partiteGiocate = Math.floor(Math.random() * 20) + 5;
				const golFatti = Math.floor(partiteGiocate * giocatore.livello * 0.8);
				const assist = Math.floor(partiteGiocate * giocatore.livello * 0.5);
				const vittorie = Math.floor(partiteGiocate * 0.6);
				const punteggio = (giocatore.livello * 20) + (golFatti * 3) + (assist * 2) + (vittorie * 5);
				
				return {
					...giocatore,
					partiteGiocate,
					golFatti,
					assist,
					vittorie,
					sconfitte: partiteGiocate - vittorie,
					punteggio,
					efficienza: ((golFatti + assist) / partiteGiocate).toFixed(2)
				};
			});
			applicaOrdinamento();
		}
	}
	
	function cambiaOrdinamento(nuovoOrdinamento) {
		ordinamento = nuovoOrdinamento;
		applicaOrdinamento();
	}
	
	// Classifica per livello
	const giocatoriPerLivello = {
		5: giocatori.filter(g => g.livello === 5).length,
		4: giocatori.filter(g => g.livello === 4).length,
		3: giocatori.filter(g => g.livello === 3).length,
		2: giocatori.filter(g => g.livello === 2).length,
		1: giocatori.filter(g => g.livello === 1).length
	};
</script>

<svelte:head>
	<title>Scarparometro - Scarpari Inside</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 py-8">
	<!-- Header -->
	<div class="max-w-7xl mx-auto px-4 mb-8">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold text-gray-900">📊 Scarparometro</h1>
				<p class="text-gray-600">Classifica e statistiche dettagliate dei giocatori</p>
			</div>
			<a href="/" class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition">
				← Torna alla Home
			</a>
		</div>
	</div>

	<div class="max-w-7xl mx-auto px-4">
		<!-- Statistiche Generali -->
		<div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
			<div class="bg-white rounded-lg shadow p-6 text-center">
				<div class="text-2xl font-bold text-blue-600">{giocatori.length}</div>
				<div class="text-gray-600">Giocatori Totali</div>
			</div>
			<div class="bg-white rounded-lg shadow p-6 text-center">
				<div class="text-2xl font-bold text-green-600">
					{statistiche.reduce((acc, g) => acc + g.partiteGiocate, 0)}
				</div>
				<div class="text-gray-600">Partite Giocate</div>
			</div>
			<div class="bg-white rounded-lg shadow p-6 text-center">
				<div class="text-2xl font-bold text-yellow-600">
					{statistiche.reduce((acc, g) => acc + g.golFatti, 0)}
				</div>
				<div class="text-gray-600">Gol Totali</div>
			</div>
			<div class="bg-white rounded-lg shadow p-6 text-center">
				<div class="text-2xl font-bold text-purple-600">
					{statistiche.reduce((acc, g) => acc + g.vittorie, 0)}
				</div>
				<div class="text-gray-600">Vittorie Totali</div>
			</div>
		</div>

		<!-- Filtri e Controlli -->
		<div class="bg-white rounded-lg shadow p-6 mb-8">
			<div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
				<div class="flex items-center space-x-4">
					<label class="text-sm font-medium text-gray-700">Filtra per livello:</label>
					<select 
						bind:value={filtroLivello}
						on:change={filtraPerLivello}
						class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="tutti">Tutti i livelli</option>
						<option value="5">⭐️⭐️⭐️⭐️⭐️ (5)</option>
						<option value="4">⭐️⭐️⭐️⭐️ (4)</option>
						<option value="3">⭐️⭐️⭐️ (3)</option>
						<option value="2">⭐️⭐️ (2)</option>
						<option value="1">⭐️ (1)</option>
					</select>
				</div>
				
				<div class="flex flex-wrap gap-2">
					<button 
						on:click={() => cambiaOrdinamento('punteggio')}
						class="px-3 py-2 rounded text-sm font-medium transition {ordinamento === 'punteggio' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}"
					>
						🏆 Punteggio
					</button>
					<button 
						on:click={() => cambiaOrdinamento('gol')}
						class="px-3 py-2 rounded text-sm font-medium transition {ordinamento === 'gol' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}"
					>
						⚽ Gol
					</button>
					<button 
						on:click={() => cambiaOrdinamento('assist')}
						class="px-3 py-2 rounded text-sm font-medium transition {ordinamento === 'assist' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}"
					>
						🎯 Assist
					</button>
					<button 
						on:click={() => cambiaOrdinamento('vittorie')}
						class="px-3 py-2 rounded text-sm font-medium transition {ordinamento === 'vittorie' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}"
					>
						✅ Vittorie
					</button>
					<button 
						on:click={() => cambiaOrdinamento('efficienza')}
						class="px-3 py-2 rounded text-sm font-medium transition {ordinamento === 'efficienza' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}"
					>
						📈 Efficienza
					</button>
				</div>
			</div>
		</div>

		<!-- Classifica Giocatori -->
		<div class="bg-white rounded-lg shadow mb-8">
			<div class="px-6 py-4 border-b">
				<h2 class="text-xl font-semibold">
					Classifica Giocatori 
					{#if filtroLivello !== 'tutti'}
						- Livello {filtroLivello}
					{/if}
				</h2>
			</div>
			
			{#if statistiche.length === 0}
				<div class="p-8 text-center text-gray-500">
					<p class="text-lg">Nessun giocatore trovato</p>
					<p class="text-sm">Prova a cambiare i filtri</p>
				</div>
			{:else}
				<div class="overflow-x-auto">
					<table class="w-full">
						<thead class="bg-gray-50">
							<tr>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pos.</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giocatore</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Livello</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Partite</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gol</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assist</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vittorie</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Efficienza</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Punteggio</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-200">
							{#each statistiche as stat, index (stat.id)}
								<tr class="hover:bg-gray-50 transition {index < 3 ? 'bg-yellow-50' : ''}">
									<td class="px-6 py-4 whitespace-nowrap">
										<div class="flex items-center">
											{#if index === 0}
												<span class="text-2xl">🥇</span>
											{:else if index === 1}
												<span class="text-2xl">🥈</span>
											{:else if index === 2}
												<span class="text-2xl">🥉</span>
											{:else}
												<span class="text-lg font-medium text-gray-900">#{index + 1}</span>
											{/if}
										</div>
									</td>
									<td class="px-6 py-4 whitespace-nowrap">
										<div class="text-sm font-medium text-gray-900">{stat.nome}</div>
									</td>
									<td class="px-6 py-4 whitespace-nowrap">
										<div class="flex">
											{#each Array(5) as _, i}
												<span class="text-lg {i < stat.livello ? 'text-yellow-500' : 'text-gray-300'}">
													★
												</span>
											{/each}
										</div>
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{stat.partiteGiocate}
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{stat.golFatti}
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{stat.assist}
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{stat.vittorie}
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{stat.efficienza}
									</td>
									<td class="px-6 py-4 whitespace-nowrap">
										<div class="text-sm font-bold text-blue-600">{stat.punteggio}</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</div>

		<!-- Distribuzione Livelli -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
			<div class="bg-white rounded-lg shadow p-6">
				<h3 class="text-lg font-semibold mb-4">📈 Distribuzione per Livello</h3>
				<div class="space-y-3">
					{#each Object.entries(giocatoriPerLivello) as [livello, count]}
						{#if count > 0}
							<div class="flex items-center justify-between">
								<div class="flex items-center space-x-2">
									<div class="flex">
										{#each Array(5) as _, i}
											<span class="text-sm {i < livello ? 'text-yellow-500' : 'text-gray-300'}">
												★
											</span>
										{/each}
									</div>
									<span class="text-sm text-gray-600">({livello}/5)</span>
								</div>
								<div class="flex items-center space-x-2">
									<div class="w-32 bg-gray-200 rounded-full h-2">
										<div 
											class="bg-blue-600 h-2 rounded-full" 
											style="width: {(count / giocatori.length) * 100}%"
										></div>
									</div>
									<span class="text-sm font-medium text-gray-900">{count}</span>
								</div>
							</div>
						{/if}
					{/each}
				</div>
			</div>

			<div class="bg-white rounded-lg shadow p-6">
				<h3 class="text-lg font-semibold mb-4">🎯 Statistiche Medie</h3>
				<div class="space-y-3 text-sm">
					<div class="flex justify-between">
						<span class="text-gray-600">Partite per giocatore:</span>
						<span class="font-medium">{(statistiche.reduce((acc, g) => acc + g.partiteGiocate, 0) / statistiche.length).toFixed(1)}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-gray-600">Gol per partita:</span>
						<span class="font-medium">{(statistiche.reduce((acc, g) => acc + g.golFatti, 0) / statistiche.reduce((acc, g) => acc + g.partiteGiocate, 0)).toFixed(2)}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-gray-600">% Vittorie:</span>
						<span class="font-medium">{((statistiche.reduce((acc, g) => acc + g.vittorie, 0) / statistiche.reduce((acc, g) => acc + g.partiteGiocate, 0)) * 100).toFixed(1)}%</span>
					</div>
					<div class="flex justify-between">
						<span class="text-gray-600">Punteggio medio:</span>
						<span class="font-medium">{(statistiche.reduce((acc, g) => acc + g.punteggio, 0) / statistiche.length).toFixed(0)}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
