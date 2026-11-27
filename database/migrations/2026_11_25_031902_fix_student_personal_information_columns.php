<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->date('date_of_birth')->nullable()->change();

            $table->string('sex')->nullable()->change();

            $table->string('place_of_birth')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->string('date_of_birth')->nullable(false)->change();

            $table->string('sex')->nullable(false)->change();

            $table->string('place_of_birth')->nullable(false)->change();
        });
    }
};
