<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
                  $table->foreignId('host_user_id')->nullable()->after('id')->constrained('users')->nullOnDelete();
            $table->string('event_type', 120)->after('host_user_id');
            $table->string('title', 160)->after('event_type');
            $table->string('guest_name', 120)->after('title');
            $table->string('guest_email')->after('guest_name')->index();
            $table->string('guest_phone', 30)->nullable()->after('guest_email');
            $table->string('timezone', 80)->after('guest_phone');
            $table->timestamp('start_at')->after('timezone');
            $table->timestamp('end_at')->after('start_at');
            $table->unsignedSmallInteger('duration_minutes')->after('end_at');
            $table->enum('status', ['pending', 'confirmed', 'cancelled', 'completed'])->default('pending')->after('duration_minutes')->index();
            $table->text('notes')->nullable()->after('status');
            $table->text('cancel_reason')->nullable()->after('notes');
            $table->timestamp('cancelled_at')->nullable()->after('cancel_reason');
            $table->index(['start_at', 'end_at']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
