<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Branch extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'branches';

    protected $fillable = [
        'name',
        'address',
        'city',
        'phone',
    ];
}