<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
	use HasFactory;

	protected $fillable = [
		'title',
		'content',
	];

	protected $appends = [
		'content_to_html',
	];

	public function contentToHtml(): Attribute
	{
		return new Attribute(
			get: fn () => nl2br($this->content)
		);
	}
}
