<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;


class Student extends Model
{
     use SoftDeletes;

      protected $fillable = [
        'srm_student_id',
        'lrn',
        'school_student_id',
        'first_name',
        'middle_name',
        'last_name',
        'suffix',
        'date_of_birth',
        'sex',
        'place_of_birth',
        'nationality',
        'email',
        'contact_number',
        'current_address',
        'previous_school',
        'previous_grade_level',
        'photo_path',
    ];

    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
        ];
    }

    public function studentGuardians(): HasMany
    {
        return $this->hasMany(StudentGuardian::class);
    }

    public function guardians()
    {
        return $this->belongsToMany(Guardian::class, 'student_guardians')
            ->withPivot('relationship', 'is_primary_contact', 'is_emergency_contact')
            ->withTimestamps();
    }
}
