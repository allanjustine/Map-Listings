<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ActivityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'coordinate_id' => [Rule::exists('coordinates', 'id')],
            'name'          => ['required', 'string', 'max:50', 'min:2'],
            'description'   => ['required', 'string', 'max:100', 'min:2'],
        ]);

        $activity = Activity::query()->create([
            'coordinate_id' => $request->coordinate_id,
            'name'          => Str::title($request->name),
            'description'   => $request->description,
        ]);

        return to_route('coordinates.index')->with('success', "{$activity->name} activity added to {$activity->coordinate->name} successfully.");
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
