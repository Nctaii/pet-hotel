<?php

namespace App\Http\Controllers;

use App\Models\Pet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PetController extends Controller
{
    // Danh sách pet của user đang đăng nhập
    public function index()
    {
        $pets = Pet::where('owner_id', Auth::id())->get();
        return response()->json($pets);
    }

    // Thêm pet mới
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'    => 'required|string',
            'species' => 'required|string',
            'breed'   => 'nullable|string',
            'age'     => 'nullable|numeric',
            'weight'  => 'nullable|numeric',
            'note'    => 'nullable|string',
        ]);

        $data['owner_id'] = Auth::id();
        $pet = Pet::create($data);

        return response()->json($pet, 201);
    }

    // Xem chi tiết 1 pet
    public function show($id)
    {
        $pet = Pet::where('_id', $id)->where('owner_id', Auth::id())->first();
        if (!$pet) {
            return response()->json(['message' => 'Không tìm thấy'], 404);
        }
        return response()->json($pet);
    }

    // Cập nhật pet
    public function update(Request $request, $id)
    {
        $pet = Pet::find($id);
        if ($pet && $pet->owner_id !== Auth::id()) {
            $pet = null;
        }
        if (!$pet) {
            return response()->json(['message' => 'Không tìm thấy'], 404);
        }

        $data = $request->validate([
            'name'    => 'sometimes|string',
            'species' => 'sometimes|string',
            'breed'   => 'nullable|string',
            'age'     => 'nullable|numeric',
            'weight'  => 'nullable|numeric',
            'note'    => 'nullable|string',
        ]);

        $pet->update($data);
        return response()->json($pet);
    }

    // Xóa pet
    public function destroy($id)
    {
        $pet = Pet::where('_id', $id)->where('owner_id', Auth::id())->first();
        if (!$pet) {
            return response()->json(['message' => 'Không tìm thấy'], 404);
        }
        $pet->delete();
        return response()->json(['message' => 'Đã xóa']);
    }
}