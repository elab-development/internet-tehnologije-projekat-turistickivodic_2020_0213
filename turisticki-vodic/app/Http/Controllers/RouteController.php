<?php

namespace App\Http\Controllers;

use App\Models\Route;
use App\Http\Resources\RouteResource;
use Illuminate\Http\Request;

class RouteController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // Eager load the locations relationship
        $routes = Route::with('locations')->get(); 
    
        // Check if routes exist
        if ($routes->isEmpty()) {
            return response()->json('Data not found', 404);
        }
    
        // Return the routes with their locations
        return response()->json($routes);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
 
    

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
{
    $request->validate([
        'name' => 'required|string|max:255',
        'description' => 'required|string',
        'user_id' => 'required|exists:users,id',
        'total_duration' => 'string',
    ]);

    $route = new Route([
        'name' => $request->name,
        'description' => $request->description,
        'user_id' => $request->user_id,
        'total_duration' => $request->total_duration, // Store the total_duration
    ]);

    $route->save();

    return response()->json([
        'message' => 'Route created successfully!',
        'route' => $route
    ], 201);
}


    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Route  $route
     * @return \Illuminate\Http\Response
     */
    public function show($id)
{
    // Find the route by ID, including the locations
    $route = Route::with('locations')->find($id);
    
    // Check if the route exists
    if (!$route) {
        return response()->json('Route not found', 404);
    }

    // Return the route data in the desired format, including locations
    return response()->json([
        'id' => $route->id,
        'name' => $route->name,
        'description' => $route->description,
        'locations' => $route->locations, // Return the locations relationship
    ]);
}
    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Route  $route
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $route = Route::find($id);
        return view('routes.edit', compact('route'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Route  $route
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        // Validate the request data
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        // Find the route by ID
        $route = Route::find($id);

        // Check if the route exists
        if (!$route) {
            return response()->json(['error' => 'Route not found'], 404);
        }
        
        // Update the route with the validated data
        $route->name = $validatedData['name'];
        $route->description = $validatedData['description'];
        
        // Save the updated route
        $route->save();
        
        // Return a success response
        return response()->json(['success' => 'Route updated successfully', 'route' => $route], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Route  $route
     * @return \Illuminate\Http\Response
     */
    public function destroy(Route $route)
    {
        // Attempt to delete the route
        try {
            $route->delete();
            return response()->json([
                'message' => 'Route deleted successfully!',
            ], 200);
        } catch (\Exception $e) {
            // Handle any errors that might occur
            return response()->json([
                'message' => 'Failed to delete the route.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getUserRoutes($userId)
    {
        if (auth()->user()->role == 'admin') {
            return Route::all(); // Admin can view all routes
        }
        return Route::where('user_id', $userId)->get(); // Regular users only see their routes
    }

    public function getApprovedRoutes()
    {
        $approvedRoutes = Route::with('locations')->where('approved', true)->get();
        return response()->json($approvedRoutes);
    }

    public function approveRoute($id)
    {
        // Find the route by its ID
        $route = Route::find($id);

        // Check if the route exists
        if (!$route) {
            return response()->json(['error' => 'Route not found'], 404);
        }

        // Approve the route
        $route->approved = true;
        $route->save();

        return response()->json(['message' => 'Route approved successfully', 'route' => $route], 200);
    }

    public function getUserRoutesAndApproved(Request $request, $userId)
    {

        // Fetch all routes created by the user
        $userRoutes = Route::with('locations')
            ->where('user_id', $userId)
            ->get();

        // Fetch all approved routes that don't belong to the user
        $approvedRoutes = Route::with('locations')
            ->where('approved', true)
            ->where('user_id', '!=', $userId)
            ->get();

        $combinedRoutes = $userRoutes->merge($approvedRoutes);

        // Return a combined response
        return response()->json(
            $combinedRoutes   
        );

        
    }
}
