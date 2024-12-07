<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\RouteController;
use App\Http\Controllers\MyRouteController;
use App\Http\Controllers\UserRouteController;
use App\Http\Controllers\TourController;



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

    //zasticene rute
    Route::resource('user.routes', UserRouteController::class);
    Route::get('/users/{id}/routes', [UserRouteController::class, 'index'])->name('users.posts.index');

    Route::post('/routes', 'App\Http\Controllers\RouteController@store');
    Route::post('/locations', 'App\Http\Controllers\LocationController@store');

    Route::delete('/routes/{route}', 'App\Http\Controllers\RouteController@destroy');
    Route::delete('/locations/{location}', 'App\Http\Controllers\LocationController@destroy');

    Route::post('/routes/{id}/approve', [RouteController::class, 'approveRoute']);
    Route::get('/approved/{id}', [RouteController::class, 'getUserRoutesAndApproved']);

    // API route for logout user
    Route::post('/logout', [AuthController::class, 'logout']);
    
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::get('/users', [UserController::class, 'index']);

Route::get('/approved-routes', [RouteController::class, 'getApprovedRoutes']);

//login
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
//Route::post('/logout', [AuthController::class, 'logout']);

//Route::resource('routes', MyRouteController::class);

//routes
Route::get('/routes', 'App\Http\Controllers\RouteController@index');
Route::get('/routes/{id}', 'App\Http\Controllers\RouteController@show');


Route::put('/routes/{id}', [RouteController::class, 'update']);

//locations
Route::get('/locations', 'App\Http\Controllers\LocationController@index');
Route::get('/locations/{id}', 'App\Http\Controllers\LocationController@show');


Route::put('/locations/{id}', 'App\Http\Controllers\LocationController@update');

//users
Route::get('/users/{id}', [UserController::class, 'show'])->name('users.show');
Route::get('/users', [UserController::class, 'index'])->name('users.index');

//Route::delete('/routes/{id}', [UserRouteController::class, 'destroy']);

Route::get('/routesAll', [UserRouteController::class, 'indexAll'])->name('users.posts.index');


Route::get('tours', [TourController::class, 'index']);

Route::get('/admin/routes', 'RouteController@getUserRoutes')->middleware('admin');

//Route::resource('routesR', MyRouteController::class)->only(['update','store','destroy','index']);


