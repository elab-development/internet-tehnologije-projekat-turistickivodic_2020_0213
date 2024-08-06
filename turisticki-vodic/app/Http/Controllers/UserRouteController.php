<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Route;

class UserRouteController extends Controller
{
    
    public function index($user_id) {
        $routes = Route::get()->where('user_id', $user_id);
        if (is_null($routes)) {
            return response()->json('Data not found', 404);
        }
        return response()->json($routes);
    }
}
