<?php

namespace App\Models;

use Database\Factories\PostFactory;
use Illuminate\Database\Eloquent\Attributes\Appends;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\UseFactory;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

#[UseFactory(PostFactory::class)]
#[Fillable(['title', 'content'])]
#[Appends(['content_to_html'])]
class Post extends Model
{
    public function contentToHtml(): Attribute
    {
        return new Attribute(
            get: fn () => nl2br($this->content)
        );
    }
}
