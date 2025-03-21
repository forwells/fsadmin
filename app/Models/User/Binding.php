<?php

namespace App\Models\User;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Binding extends Model
{
    use HasFactory;
    protected $table = 'user_bindings';

    protected $fillable = ['user_id', 'fb'];
    protected $casts = [
        'fb' => 'array'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
