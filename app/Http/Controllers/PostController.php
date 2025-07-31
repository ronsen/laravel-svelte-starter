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
        return Inertia::render('Posts/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $post = Post::create($request->validate([
            'title' => ['required'],
            'content' => [],
        ]));

        return to_route('posts.show', $post);
    }

    public function edit(Post $post): Response
    {
        return Inertia::render('Posts/Edit', ['post' => $post]);
    }

    public function update(Post $post, Request $request): RedirectResponse
    {
        $request->validate(['title' => ['required']]);

        $post->title = $request->input('title');
        $post->content = $request->input('content');
        $post->update();

        return back()->with('message', "<strong>{$post->title}</strong> has been updated.");
    }

    public function show(Post $post): Response
    {
        return Inertia::render('Posts/Show', ['post' => $post]);
    }

    public function destroy(Post $post): RedirectResponse
    {
        Session::flash('message', "<strong>{$post->title}</strong> has been deleted.");

        $post->delete();

        return to_route('home');
    }
}
