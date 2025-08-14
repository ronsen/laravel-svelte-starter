<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    const PER_PAGE = 10;

    public function index(): Response
    {
        $posts = Post::orderBy('id', 'desc')->simplePaginate(self::PER_PAGE);

        return Inertia::render('posts/Index', ['posts' => $posts]);
    }
}
