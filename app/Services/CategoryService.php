<?php

namespace App\Services;

use App\Models\Category;
use Illuminate\Support\Facades\Cache;

class CategoryService
{
    public function getAllCategories()
    {
        return Cache::remember('categories_all', 3600, function () {
            return Category::all();
        });
    }

    public function createCategory(array $data)
    {
        $category = Category::create($data);
        Cache::forget('categories_all');
        return $category;
    }
}
