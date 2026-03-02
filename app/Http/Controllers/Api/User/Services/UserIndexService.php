<?php

namespace App\Http\Controllers\Api\User\Services;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserIndexService
{
    public function handle(Request $request): JsonResponse
    {
        $query = User::query()->latest();

        if ($request->filled('search')) {
            $search = (string) $request->input('search');

            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->filled('role')) {
            $query->where('role', (string) $request->input('role'));
        }

        return response()->json([
            'status' => 'success',
            'data' => $query->paginate(10),
        ]);
    }
}
