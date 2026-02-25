<?php

namespace App\Http\Controllers\Api\Auth\Services;

use App\Http\Controllers\Api\Concerns\ApiResponse;
use App\Services\Auth\RefreshTokenService;
use Illuminate\Http\JsonResponse;
use Throwable;

class AuthRefreshService
{
    use ApiResponse;

    public function __construct(private readonly RefreshTokenService $refreshTokenService)
    {
    }

    public function handle(): JsonResponse
    {
        try {
            $payload = ($this->refreshTokenService)();

            return $this->successResponse($payload, 'Token refreshed successfully.');
        } catch (Throwable $e) {
            report($e);

            return $this->errorResponse('Failed to refresh token.', 401);
        }
    }
}
