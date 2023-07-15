<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Posts/Create', [
            'csrfToken' => csrf_token()
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $post = Post::create([
            'title' => $request->title,
            'content' => $request->content
        ]);

        return to_route('posts.show', $post);
    }

    public function edit(Post $post): Response
    {
        return Inertia::render('Posts/Edit', [
            'post' => $post,
            'csrfToken' => csrf_token()
        ]);
    }

    public function update(Post $post, Request $request): RedirectResponse
    {
        $post->title = $request->title;
        $post->content = $request->content;
        $post->update();

        return to_route('posts.show', $post);
    }

    public function show(Post $post): Response
    {
        return Inertia::render('Posts/Show', ['post' => $post]);
    }

    public function destroy(Post $post): RedirectResponse
    {
        $post->delete();

        return to_route('home');
    }
}
