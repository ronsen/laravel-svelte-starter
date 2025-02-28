<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
	public function create(): Response
	{
		return Inertia::render('Auth/Login');
	}

	public function store(LoginRequest $request): RedirectResponse
	{
		$request->authenticate();
		$request->session()->regenerate();

		return redirect()->intended(route('home', absolute: false));
	}

	public function destroy(Request $request): RedirectResponse
	{
		Auth::guard('web')->logout();

		$request->session()->invalidate();
		$request->session()->regenerateToken();

		return redirect('/');
	}
}
