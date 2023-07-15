<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Post;

class HomeController extends Controller
{
    const PER_PAGE = 10;

    public function index()
    {
        $posts = Post::orderBy('id', 'desc')->simplePaginate(self::PER_PAGE);
       
        return Inertia::render('Posts/Index', ['posts' => $posts]);
    }
}
