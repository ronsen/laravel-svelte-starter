<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\Post;

class HomeController extends Controller
{
	const PER_PAGE = 10;

	public function index(): Response
	{
		$posts = Post::orderBy('id', 'desc')->simplePaginate(self::PER_PAGE);

		return Inertia::render('Posts/Index', ['posts' => $posts]);
	}
}
