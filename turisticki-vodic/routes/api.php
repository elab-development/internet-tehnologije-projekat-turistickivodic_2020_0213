<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/register', 'App\Http\Controllers\API\AuthController@register');

Route::post('/login', 'App\Http\Controllers\API\AuthController@login');

//routes
Route::get('/routes', 'App\Http\Controllers\RouteController@index');
Route::get('/routes/{id}', 'App\Http\Controllers\RouteController@show');
Route::post('/routes', 'App\Http\Controllers\RouteController@store');
Route::delete('/routes/{route}', 'App\Http\Controllers\RouteController@destroy');
Route::put('/routes/{route}', 'App\Http\Controllers\RouteController@update');

//locations
Route::get('/locations', 'App\Http\Controllers\LocationController@index');
Route::get('/locations/{id}', 'App\Http\Controllers\LocationController@show');
Route::post('/locations', 'App\Http\Controllers\LocationController@store');
Route::delete('/location/{location}', 'App\Http\Controllers\LocationController@destroy');
Route::put('/locations/{id}', 'App\Http\Controllers\LocationController@update');