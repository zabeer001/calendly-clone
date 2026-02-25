<?php

namespace App\Http\Controllers\Api\User\Services;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserUpdateService
{
    public function handle(Request $request, User $user): JsonResponse
    {
        $validatedData = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => [
                'sometimes',
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
            'role' => 'sometimes|required|string|in:admin,user,editor',
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        if (empty($validatedData['password'])) {
            unset($validatedData['password']);
        }

        $user->update($validatedData);

        return response()->json([
            'status' => 'success',
            'message' => 'User updated successfully.',
            'data' => $user->only(['id', 'name', 'email', 'role']),
        ]);
    }
}
