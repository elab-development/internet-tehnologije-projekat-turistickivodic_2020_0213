<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Location;

class LocationController extends Controller
{
    public function index()
    {
        $locations = Location::all();
        return $locations;
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'route_id' => 'required|exists:routes,id',
            'latitude' => 'required',
            'longitude' => 'required',
            'order' => 'required',
        ]);

        $location = new Location([
            'name' => $request->name,
            'route_id' => $request->route_id,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'order' => $request->order,
        ]);

        $location->save();

        return response()->json([
            'message' => 'Location created successfully!',
            'location' => $location
        ], 201);
    }
    
    public function show($id)
    {
        $location = Location::find($id);
        return $location;
    }

    public function update(Request $request, $id)
    {
        // Validate the request data
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'latitude' => 'required',
            'longitude' => 'required',
        ]);

        // Find the route by ID
        $location = Location::find($id);

        // Check if the route exists
        if (!$location) {
            return redirect('/locations')->with('error', 'Location not found');
        }

        // Update the route with the validated data
        $location->name = $validatedData['name'];
        $location->longitude = $validatedData['longitude'];
        $location->latitude = $validatedData['latitude'];

        // Save the updated route
        $location->save();

        // Redirect with success message
        return response()->json([
            'message' => 'Location altered successfully!',
            'location' => $location
        ], 201);
    }

    public function destroy(Location $location)
    {
        // Attempt to delete the route
        try {
            $location->delete();
            return response()->json([
                'message' => 'Location deleted successfully!',
            ], 200);
        } catch (\Exception $e) {
            // Handle any errors that might occur
            return response()->json([
                'message' => 'Failed to delete the location.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}

