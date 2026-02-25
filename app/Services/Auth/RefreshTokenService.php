<?php

namespace App\Services\Auth;

use Illuminate\Support\Facades\Auth;

class RefreshTokenService
{
    /**
     * @return array<string, mixed>
     */
    public function __invoke(): array
    {
        $token = Auth::guard('api')->refresh();

        return [
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => Auth::guard('api')->factory()->getTTL() * 60,
        ];
    }
}
