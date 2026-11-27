<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Guardian extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'first_name',
        'middle_name',
        'last_name',
        'suffix',
        'contact_number',
        'email',
        'address',
        'occupation',
    ];

    public function studentGuardians(): HasMany
    {
        return $this->hasMany(StudentGuardian::class);
    }

    public function students()
    {
        return $this->belongsToMany(Student::class, 'student_guardians')
            ->withPivot('relationship', 'is_primary_contact', 'is_emergency_contact')
            ->withTimestamps();
    }
}
