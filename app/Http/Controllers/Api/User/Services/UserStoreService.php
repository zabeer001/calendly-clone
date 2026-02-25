<?php

namespace App\Http\Controllers\Api\User\Services;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserStoreService
{
    public function handle(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'role' => 'required|string|in:admin,user,editor',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create($validatedData);

        return response()->json([
            'status' => 'success',
            'message' => 'User created successfully.',
            'data' => $user->only(['id', 'name', 'email', 'role']),
        ], 201);
    }
}
