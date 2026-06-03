<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Room extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'rooms';

    protected $fillable = [
        'branch_id',
        'room_number',
        'type',           // small | medium | large
        'price_per_day',
        'status',         // available | occupied | maintenance
    ];
}