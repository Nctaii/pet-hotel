<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    // Danh sách phòng, có thể lọc theo branch_id và status
    public function index(Request $request)
    {
        $query = Room::query();

        if ($request->has('branch_id')) {
            $query->where('branch_id', $request->branch_id);
        }
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'branch_id'     => 'required|string',
            'room_number'   => 'required|string',
            'type'          => 'required|string', // small | medium | large
            'price_per_day' => 'required|numeric',
            'status'        => 'nullable|string',
        ]);

        $data['status'] = $data['status'] ?? 'available';
        $room = Room::create($data);
        return response()->json($room, 201);
    }

    public function show($id)
    {
        $room = Room::find($id);
        if (!$room) {
            return response()->json(['message' => 'Không tìm thấy'], 404);
        }
        return response()->json($room);
    }

    public function update(Request $request, $id)
    {
        $room = Room::find($id);
        if (!$room) {
            return response()->json(['message' => 'Không tìm thấy'], 404);
        }
        $room->update($request->all());
        return response()->json($room);
    }

    public function destroy($id)
    {
        $room = Room::find($id);
        if (!$room) {
            return response()->json(['message' => 'Không tìm thấy'], 404);
        }
        $room->delete();
        return response()->json(['message' => 'Đã xóa']);
    }
}