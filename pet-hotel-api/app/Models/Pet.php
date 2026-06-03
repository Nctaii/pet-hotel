<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Pet extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'pets';

    protected $fillable = [
        'owner_id',
        'name',
        'species',   // dog | cat | other
        'breed',
        'age',
        'weight',
        'note',
    ];
}