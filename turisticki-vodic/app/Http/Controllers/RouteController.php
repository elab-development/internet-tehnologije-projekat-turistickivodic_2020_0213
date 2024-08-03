<?php

namespace App\Http\Controllers;

use App\Models\Route;
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
        $routes = Route::all();
        return $routes;
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
            'is_approved' => 'boolean'
        ]);

        $route = new Route([
            'name' => $request->name,
            'description' => $request->description,
            'user_id' => $request->user_id,
            'is_approved' => $request->is_approved ?? false,
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
        $route = Route::find($id);
        return $route;
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
            'user_id' => 'required|integer|exists:users,id',
        ]);

        // Find the route by ID
        $route = Route::find($id);

        // Check if the route exists
        if (!$route) {
            return redirect('/routes')->with('error', 'Route not found');
        }

        // Update the route with the validated data
        $route->name = $validatedData['name'];
        $route->description = $validatedData['description'];
        $route->user_id = $validatedData['user_id'];

        // Save the updated route
        $route->save();

        // Redirect with success message
        return redirect('/routes')->with('success', 'Route updated successfully');
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
}
