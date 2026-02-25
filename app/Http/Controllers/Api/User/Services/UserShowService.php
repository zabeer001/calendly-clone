<?php

namespace App\Http\Controllers\Api\User\Services;

use App\Models\User;
use Illuminate\Http\JsonResponse;

class UserShowService
{
    public function handle(User $user): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data' => $user->only(['id', 'name', 'email', 'role', 'created_at']),
        ]);
    }
}
