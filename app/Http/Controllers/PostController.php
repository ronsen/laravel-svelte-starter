<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('posts/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'title' => ['required'],
        ]);

        $post = Post::create([
            'title' => $request->input('title'),
            'content' => $request->input('content'),
        ]);

        return to_route('posts.show', $post);
    }

    public function edit(Post $post): Response
    {
        return Inertia::render('posts/Edit', ['post' => $post]);
    }

    public function update(Post $post, Request $request): RedirectResponse
    {
        $request->validate(['title' => ['required']]);

        $post->update($request->only(['title', 'content']));

        return back()->with('message', "<strong>{$post->title}</strong> has been updated.");
    }

    public function show(Post $post): Response
    {
        return Inertia::render('posts/Show', ['post' => $post]);
    }

    public function destroy(Post $post): RedirectResponse
    {
        $title = $post->title;
        $post->delete();

        return to_route('home')->with('message', "<strong>{$title}</strong> has been deleted.");
    }
}
