<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Coordinate extends Model
{
    protected $guarded = [];

    public function activities()
    {
        return $this->hasMany(Activity::class);
    }
}
