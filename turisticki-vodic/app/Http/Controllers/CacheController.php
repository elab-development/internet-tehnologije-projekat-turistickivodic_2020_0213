<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Http\JsonResponse;

class CacheController extends Controller
{
    public function index(): JsonResponse
    {
        // Cache the users for 30 minutes
        $users = Cache::remember('users', 1800, function () {
            return User::all();
        });

        return response()->json($users);
    }

    // Method to clear the cached users
    public function clearCache(): JsonResponse
    {
        Cache::forget('users'); // Clear the users cache

        return response()->json(['message' => 'User cache cleared.']);
    }
}
