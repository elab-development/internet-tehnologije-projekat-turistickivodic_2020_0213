<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\RouteController;
use App\Http\Controllers\MyRouteController;
use App\Http\Controllers\UserRouteController;



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



Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::get('/profile', function(Request $request) {
        return auth()->user();
    });
    Route::resource('routes', MyRouteController::class)->only(['update','store','destroy','index']);

    // API route for logout user
    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::get('/users', [UserController::class, 'index']);



//login
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
//Route::post('/logout', [AuthController::class, 'logout']);

//Route::resource('routes', MyRouteController::class);

//routes
//Route::get('/routes', 'App\Http\Controllers\RouteController@index');
//Route::get('/routes/{id}', 'App\Http\Controllers\RouteController@show');
//Route::post('/routes', 'App\Http\Controllers\RouteController@store');
//Route::delete('/routes/{route}', 'App\Http\Controllers\RouteController@destroy');
//Route::put('/routes/{route}', 'App\Http\Controllers\RouteController@update');

//locations
Route::get('/locations', 'App\Http\Controllers\LocationController@index');
Route::get('/locations/{id}', 'App\Http\Controllers\LocationController@show');
Route::post('/locations', 'App\Http\Controllers\LocationController@store');
Route::delete('/location/{location}', 'App\Http\Controllers\LocationController@destroy');
Route::put('/locations/{id}', 'App\Http\Controllers\LocationController@update');

//nested
Route::get('/users/{id}', [UserController::class, 'show'])->name('users.show');
Route::get('/users', [UserController::class, 'index'])->name('users.index');
Route::resource('user.routes', UserRouteController::class);
//Route::get('/users/{id}/routes', [UserRouteController::class, 'index'])->name('users.posts.index');