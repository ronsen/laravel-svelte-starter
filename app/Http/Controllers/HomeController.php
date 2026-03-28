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
        $posts = Post::query()
            ->latest('id')
            ->simplePaginate(self::PER_PAGE)
            ->through(fn ($post) => [
                ...$post->toArray(),
                'show_url' => route('posts.show', $post),
                'edit_url' => route('posts.edit', $post),
            ]);

        return Inertia::render('posts/Index', ['posts' => $posts]);
    }
}
