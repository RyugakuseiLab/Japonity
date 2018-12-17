<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
use App\User;
use APP\Language;
use APP\Level;

use Illuminate\Http\Request;
// use Illuminate\Https\Request;

// Route::get('/', function () {return view('welcome');});

Route::get('/', function () {
    return view('home')
;});

