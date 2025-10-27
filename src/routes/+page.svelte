<svelte:head>
	<title>Scarpari Inside - Il tempio del calcetto</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<header class="bg-white shadow-sm border-b">
		<div class="max-w-7xl mx-auto px-4 py-6">
			<div class="flex items-center justify-between">
				<div class="flex items-center space-x-4">
					<img 
						src="%sveltekit.assets%/Scarpari Inside simplelogo_2023.png" 
						alt="Scarpari Inside" 
						class="h-12 w-12"
					/>
					<div>
						<h1 class="text-2xl font-bold text-gray-900">SCARPARI INSIDE</h1>
						<p class="text-gray-600">Il tempio del calcetto</p>
					</div>
				</div>
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="max-w-7xl mx-auto px-4 py-8">
		<!-- Menu Principale -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			<a href="/eventi" class="block bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
				<div class="flex items-center space-x-4">
					<span class="text-2xl">🗓️</span>
					<div>
						<h3 class="text-lg font-semibold text-gray-900">EVENTI</h3>
						<p class="text-gray-600">Gestione eventi e generazione squadre</p>
					</div>
				</div>
			</a>

			<a href="/giocatori" class="block bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
				<div class="flex items-center space-x-4">
					<span class="text-2xl">👥</span>
					<div>
						<h3 class="text-lg font-semibold text-gray-900">GIOCATORI</h3>
						<p class="text-gray-600">Gestisci la lista dei giocatori</p>
					</div>
				</div>
			</a>

			<a href="/squadre" class="block bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
				<div class="flex items-center space-x-4">
					<span class="text-2xl">⚽</span>
					<div>
						<h3 class="text-lg font-semibold text-gray-900">GENERA SQUADRE</h3>
						<p class="text-gray-600">Crea squadre bilanciate</p>
					</div>
				</div>
			</a>

			<a href="/classifica" class="block bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
				<div class="flex items-center space-x-4">
					<span class="text-2xl">📊</span>
					<div>
						<h3 class="text-lg font-semibold text-gray-900">SCARPAROMETRO</h3>
						<p class="text-gray-600">Classifica e statistiche</p>
					</div>
				</div>
			</a>

			<a href="/profilo" class="block bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
				<div class="flex items-center space-x-4">
					<span class="text-2xl">👤</span>
					<div>
						<h3 class="text-lg font-semibold text-gray-900">IL MIO PROFILO</h3>
						<p class="text-gray-600">Profilo personale</p>
					</div>
				</div>
			</a>

			<a href="/impostazioni" class="block bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
				<div class="flex items-center space-x-4">
					<span class="text-2xl">⚙️</span>
					<div>
						<h3 class="text-lg font-semibold text-gray-900">IMPOSTAZIONI</h3>
						<p class="text-gray-600">Configurazione sistema</p>
					</div>
				</div>
			</a>
		</div>
	</main>

	<!-- Footer -->
	<footer class="bg-white border-t mt-12">
		<div class="max-w-7xl mx-auto px-4 py-6">
			<p class="text-center text-gray-600">
				- proudly made with rabbia in Veneto -
			</p>
		</div>
	</footer>
</div>
