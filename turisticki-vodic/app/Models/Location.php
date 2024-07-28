<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    protected $fillable = ['tour_id', 'latitude', 'longitude', 'order'];

    public function route()
    {
        return $this->belongsTo(Route::class);
    }
}