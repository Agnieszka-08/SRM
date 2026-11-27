<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();

            // Student IDentification
            $table->string('srm_student_id')->unique();
            $table->string('lrn',12)->nullable()->unique();
            $table->string('school_student_id')->nullable();

            //Personal Information
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('last_name');
            $table->string('suffix')->nullable();

            $table->string('date_of_birth');
            $table->string('sex');
            $table->string('place_of_birth');
            $table->string('nationality')->default('Filipino');

            //Contact Information
            $table->string('email')->nullable();
            $table->string('contact_number')->nullable();
            $table->string('current_address')->nullable();

            //Previous School Information
            $table->string('previous_school')->nullable();
            $table->string('previous_grade_level')->nullable();

            //Profile
            $table->string('photo_path')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

   
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
