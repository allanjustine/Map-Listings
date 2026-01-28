<?php

namespace App\Http\Controllers;

use App\Models\Coordinate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CoordinateController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = Coordinate::all();

        return Inertia::render('welcome', [
            'coordinates' => $data,
            'storage'     => Storage::url(''),
        ]);
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
            'title' => ['required', 'string', 'max:255', 'min:2'],
            'icon'  => ['required', 'image', 'mimes:jpeg,png,jpg,gif,svg,ico,webp', 'max:2048'],
        ]);

        $path = "";

        if ($request->hasFile('icon')) {
            $file = $request->file('icon');
            $name = time() . "-" . $file->getClientOriginalName();
            $path = $file->storeAs('marker-icons', $name, 'public');
        }

        $coordinate = Coordinate::query()->create([
            'lat'  => $request->lat,
            'lng'  => $request->lng,
            'name' => Str::of($request->title)->title()->trim(),
            'icon' => $path,
        ]);

        return to_route('coordinates.index')->with('success', "{$coordinate->name} coordinate added successfully.");
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
    public function destroy(Coordinate $coordinate)
    {
        $coordinate->icon && Storage::disk('public')->delete($coordinate->icon);

        $coordinate->delete();

        return to_route('coordinates.index')->with('success', "{$coordinate->name} coordinate deleted successfully.");
    }
}
