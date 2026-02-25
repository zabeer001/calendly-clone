<?php

namespace App\Services\Auth;

use Exception;
use Illuminate\Support\Facades\Auth;

class SignInService
{
    /**
     * @param array<string, string> $credentials
     * @return array<string, mixed>
     */
    public function __invoke(array $credentials): array
    {
        $token = Auth::guard('api')->attempt($credentials);

        if (! $token) {
            throw new Exception('Invalid credentials.');
        }

        return [
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => Auth::guard('api')->factory()->getTTL() * 60,
            'user' => Auth::guard('api')->user(),
        ];
    }
}
