<?php

use App\Http\Controllers\Api\FeedbackController as ApiFeedbackController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/feedback', ApiFeedbackController::class);
