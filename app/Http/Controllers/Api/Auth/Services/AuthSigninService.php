<?php

namespace App\Http\Controllers\Api\Auth\Services;

use App\Http\Controllers\Api\Concerns\ApiResponse;
use App\Services\Auth\SignInService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class AuthSigninService
{
    use ApiResponse;

    public function __construct(private readonly SignInService $signInService)
    {
    }

    public function handle(Request $request): JsonResponse
    {
        try {
            $credentials = $request->validate([
                'email' => ['required', 'email'],
                'password' => ['required', 'string'],
            ]);

            $payload = ($this->signInService)($credentials);

            return $this->successResponse($payload, 'Signed in successfully.');
        } catch (Throwable $e) {
            report($e);

            return $this->errorResponse('Failed to sign in.', 401);
        }
    }
}
