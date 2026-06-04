<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Branch;
use App\Models\Room;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::truncate();
        Branch::truncate();
        Room::truncate();

        // 1. Tạo Admin
        User::create([
            'name'      => 'Admin',
            'email'     => 'admin@gmail.com',
            'password'  => Hash::make('123456'),
            'phone'     => '0900000000',
            'role'      => 'admin',
            'branch_id' => null,
        ]);

        // 2. Tạo 2 chi nhánh
        $branch1 = Branch::create([
            'name'    => 'Pet Hotel Quận 1',
            'address' => '123 Lê Lợi',
            'city'    => 'TP. Hồ Chí Minh',
            'phone'   => '0281111111',
        ]);

        $branch2 = Branch::create([
            'name'    => 'Pet Hotel Quận 3',
            'address' => '456 Võ Văn Tần',
            'city'    => 'TP. Hồ Chí Minh',
            'phone'   => '0282222222',
        ]);

        // 3. Tạo nhân viên cho chi nhánh 1
        User::create([
            'name'      => 'Nhân viên 1',
            'email'     => 'staff@gmail.com',
            'password'  => Hash::make('123456'),
            'phone'     => '0901111111',
            'role'      => 'staff',
            'branch_id' => (string) $branch1->_id,
        ]);

        // 4. Tạo phòng cho chi nhánh 1
        Room::create([
            'branch_id'     => (string) $branch1->_id,
            'room_number'   => 'A101',
            'type'          => 'small',
            'price_per_day' => 150000,
            'status'        => 'available',
        ]);
        Room::create([
            'branch_id'     => (string) $branch1->_id,
            'room_number'   => 'A102',
            'type'          => 'medium',
            'price_per_day' => 250000,
            'status'        => 'available',
        ]);

        // 5. Tạo phòng cho chi nhánh 2
        Room::create([
            'branch_id'     => (string) $branch2->_id,
            'room_number'   => 'B201',
            'type'          => 'large',
            'price_per_day' => 400000,
            'status'        => 'available',
        ]);

        echo "Seed dữ liệu thành công!\n";
    }
}