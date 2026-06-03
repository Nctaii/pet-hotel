<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Room;
use App\Models\Pet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class BookingController extends Controller
{
    // Danh sách booking
    public function index()
    {
        $user = Auth::user();
        $query = Booking::query();

        if ($user->role === 'customer') {
            $query->where('customer_id', $user->id);
        } elseif ($user->role === 'staff') {
            $query->where('branch_id', $user->branch_id);
        }

        $bookings = $query->orderBy('created_at', 'desc')->get();
        return response()->json($bookings);
    }

    // Tạo booking mới
    public function store(Request $request)
    {
        $data = $request->validate([
            'pet_id'    => 'required|string',
            'room_id'   => 'required|string',
            'check_in'  => 'required|date',
            'check_out' => 'required|date|after:check_in',
        ]);

        // Kiểm tra pet có thuộc về user không
        $pet = Pet::find($data['pet_id']);
        if (!$pet || $pet->owner_id !== Auth::id()) {
            return response()->json(['message' => 'Thú cưng không hợp lệ'], 422);
        }

        // Lấy phòng
        $room = Room::find($data['room_id']);
        if (!$room) {
            return response()->json(['message' => 'Phòng không tồn tại'], 404);
        }

        // Kiểm tra trùng ngày
        $conflict = Booking::where('room_id', $data['room_id'])
            ->whereIn('status', ['pending', 'confirmed', 'checked_in'])
            ->where('check_in', '<', $data['check_out'])
            ->where('check_out', '>', $data['check_in'])
            ->first();

        if ($conflict) {
            return response()->json([
                'message' => 'Phòng đã có người đặt trong khoảng thời gian này. Vui lòng chọn ngày khác.'
            ], 422);
        }

        // Tính số ngày và tổng tiền
        $checkIn  = Carbon::parse($data['check_in']);
        $checkOut = Carbon::parse($data['check_out']);
        $days = $checkIn->diffInDays($checkOut);
        if ($days < 1) $days = 1;

        $total = $days * (float) $room->price_per_day;

        $booking = Booking::create([
            'customer_id' => Auth::id(),
            'pet_id'      => $data['pet_id'],
            'room_id'     => $data['room_id'],
            'branch_id'   => $room->branch_id,
            'check_in'    => $data['check_in'],
            'check_out'   => $data['check_out'],
            'total_price' => $total,
            'status'      => 'pending',
        ]);

        return response()->json($booking, 201);
    }

    // Lấy danh sách khoảng ngày đã đặt của 1 phòng (để frontend làm mờ)
    public function bookedDates($roomId)
    {
        $bookings = Booking::where('room_id', $roomId)
            ->whereIn('status', ['pending', 'confirmed', 'checked_in'])
            ->get(['check_in', 'check_out']);

        $ranges = $bookings->map(function ($b) {
            return [
                'check_in'  => $b->check_in,
                'check_out' => $b->check_out,
            ];
        });

        return response()->json($ranges);
    }

    // Xem chi tiết
    public function show($id)
    {
        $booking = Booking::find($id);
        if (!$booking) {
            return response()->json(['message' => 'Không tìm thấy'], 404);
        }
        return response()->json($booking);
    }

    // Xác nhận booking (staff/admin)
    public function confirm($id)
    {
        $booking = Booking::find($id);
        if (!$booking) {
            return response()->json(['message' => 'Không tìm thấy'], 404);
        }

        $booking->status = 'confirmed';
        $booking->save();

        return response()->json(['message' => 'Đã xác nhận', 'booking' => $booking]);
    }

    // Check-in (staff/admin)
    public function checkin($id)
    {
        $booking = Booking::find($id);
        if (!$booking) {
            return response()->json(['message' => 'Không tìm thấy'], 404);
        }

        $booking->status = 'checked_in';
        $booking->save();

        $room = Room::find($booking->room_id);
        if ($room) {
            $room->status = 'occupied';
            $room->save();
        }

        return response()->json(['message' => 'Đã check-in', 'booking' => $booking]);
    }

    // Check-out (staff/admin)
    public function checkout($id)
    {
        $booking = Booking::find($id);
        if (!$booking) {
            return response()->json(['message' => 'Không tìm thấy'], 404);
        }

        $booking->status = 'completed';
        $booking->save();

        $room = Room::find($booking->room_id);
        if ($room) {
            $room->status = 'available';
            $room->save();
        }

        return response()->json(['message' => 'Đã check-out', 'booking' => $booking]);
    }

    // Hủy booking
    public function cancel($id)
    {
        $booking = Booking::find($id);
        if (!$booking) {
            return response()->json(['message' => 'Không tìm thấy'], 404);
        }

        $user = Auth::user();
        if ($user->role === 'customer' && $booking->customer_id !== $user->id) {
            return response()->json(['message' => 'Không có quyền'], 403);
        }

        $booking->status = 'cancelled';
        $booking->save();

        return response()->json(['message' => 'Đã hủy', 'booking' => $booking]);
    }
}