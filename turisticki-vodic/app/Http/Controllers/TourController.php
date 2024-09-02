<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Route;

class TourController extends Controller
{
    public function index(Request $request)
    {
        $query = Route::query(); // Create a new query builder for the Route model

        // Filtering by name
        if ($request->has('name')) {
            $query->where('name', 'like', '%' . $request->input('name') . '%');
        }

        // Filtering by user_id (or any other attribute)
        if ($request->has('user_id')) {
            $query->where('user_id', $request->input('user_id'));
        }

        // Add more filtering conditions as needed

        // Pagination
        $perPage = $request->input('per_page', 10); // Get the per_page parameter, default to 10
        $tours = $query->paginate($perPage); // Paginate results

        return response()->json($tours); // Return JSON with paginated results
    }
}
