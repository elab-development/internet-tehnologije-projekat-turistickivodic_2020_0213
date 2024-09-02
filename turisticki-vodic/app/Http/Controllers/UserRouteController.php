<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Route;

class UserRouteController extends Controller
{
    public function index($user_id) {
        $routes = Route::with('locations')->where('user_id', $user_id)->get();
        if ($routes->isEmpty()) {
            return response()->json('Data not found', 404);
        }
        return response()->json($routes);
    }

    public function destroy($id) {
        $route = Route::find($id);
        
        if (!$route) {
            return response()->json('Route not found', 404);
        }

        // Ensure the route belongs to the user before deleting
        // You can modify the logic here depending on your user authentication setup
        if ($route->user_id !== auth()->id()) {
            return response()->json('Unauthorized', 403);
        }

        $route->delete();
        return response()->json('Route deleted successfully', 200);
    }
}


