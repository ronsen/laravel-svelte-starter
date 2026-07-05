<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
	@vite(['resources/js/app.ts', 'resources/css/app.css'])
	<x-inertia::head>
		<title>{{ config('app.name', 'Laravel') }}</title>
	</x-inertia::head>
</head>

<body class="font-sans antialiased">
	<x-inertia::app />
</body>

</html>
