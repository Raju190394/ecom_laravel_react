<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = ['Electronics', 'Clothing', 'Home & Garden', 'Books'];

        foreach ($categories as $cat) {
            Category::create(['name' => $cat]);
        }
    }
}
