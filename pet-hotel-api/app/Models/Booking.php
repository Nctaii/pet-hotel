<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Booking extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'bookings';

    protected $fillable = [
        'customer_id',
        'pet_id',
        'room_id',
        'branch_id',
        'check_in',
        'check_out',
        'total_price',
        'status',     // pending | confirmed | checked_in | completed | cancelled
    ];
}