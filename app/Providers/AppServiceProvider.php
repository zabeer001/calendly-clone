<?php

namespace App\Providers;

use App\Http\Controllers\Api\Booking\Services\Sahred\Guest\GuestPersistenceService;
use App\Http\Controllers\Api\Booking\Services\Sahred\Guest\GuestStorePersistenceInterface;
use App\Http\Controllers\Api\Booking\Services\Sahred\Guest\GuestUpdatePersistenceInterface;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(GuestStorePersistenceInterface::class, GuestPersistenceService::class);
        $this->app->bind(GuestUpdatePersistenceInterface::class, GuestPersistenceService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
    }
}
