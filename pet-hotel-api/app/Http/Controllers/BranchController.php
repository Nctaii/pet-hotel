<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use Illuminate\Http\Request;

class BranchController extends Controller
{
    public function index()
    {
        return response()->json(Branch::all());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'    => 'required|string',
            'address' => 'required|string',
            'city'    => 'required|string',
            'phone'   => 'nullable|string',
        ]);

        $branch = Branch::create($data);
        return response()->json($branch, 201);
    }

    public function show($id)
    {
        $branch = Branch::find($id);
        if (!$branch) {
            return response()->json(['message' => 'Không tìm thấy'], 404);
        }
        return response()->json($branch);
    }

    public function update(Request $request, $id)
    {
        $branch = Branch::find($id);
        if (!$branch) {
            return response()->json(['message' => 'Không tìm thấy'], 404);
        }
        $branch->update($request->all());
        return response()->json($branch);
    }

    public function destroy($id)
    {
        $branch = Branch::find($id);
        if (!$branch) {
            return response()->json(['message' => 'Không tìm thấy'], 404);
        }
        $branch->delete();
        return response()->json(['message' => 'Đã xóa']);
    }
}