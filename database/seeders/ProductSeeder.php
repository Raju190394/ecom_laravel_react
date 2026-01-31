<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $electronics = Category::where('name', 'Electronics')->first();
        $clothing = Category::where('name', 'Clothing')->first();

        Product::create([
            'category_id' => $electronics->id,
            'name' => 'Smartphone X',
            'sku' => 'ELEC-SMP-X',
            'description' => 'A high-end smartphone.',
            'price' => 999.99,
            'stock_quantity' => 50,
        ]);

        Product::create([
            'category_id' => $electronics->id,
            'name' => 'Laptop Pro',
            'sku' => 'ELEC-LTP-P',
            'description' => 'A powerful laptop for professionals.',
            'price' => 1499.99,
            'stock_quantity' => 30,
        ]);

        Product::create([
            'category_id' => $clothing->id,
            'name' => 'Cotton T-Shirt',
            'sku' => 'CLOT-TSH-C',
            'description' => 'Comfortable cotton t-shirt.',
            'price' => 19.99,
            'stock_quantity' => 200,
        ]);
    }
}
