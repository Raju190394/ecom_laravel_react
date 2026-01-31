<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Support\Facades\Cache;

class ProductService
{
    public function getAllProducts(array $filters)
    {
        // Generate a unique cache key based on filters
        $cacheKey = 'products_list_' . md5(json_encode($filters) . request('page', 1));

        return Cache::remember($cacheKey, 600, function () use ($filters) {
            $query = Product::with('category');

            if (isset($filters['category_id'])) {
                $query->where('category_id', $filters['category_id']);
            }

            if (isset($filters['search'])) {
                $query->where('name', 'like', '%' . $filters['search'] . '%');
            }

            return $query->latest()->paginate(12);
        });
    }

    public function createProduct(array $data)
    {
        $product = Product::create($data);
        $this->clearProductCache();
        return $product;
    }

    public function updateProduct(Product $product, array $data)
    {
        $product->update($data);
        $this->clearProductCache();
        return $product;
    }

    public function deleteProduct(Product $product)
    {
        $res = $product->delete();
        $this->clearProductCache();
        return $res;
    }

    /**
     * Clear all product related caches.
     * In a production environment with Redis, we could use cache tags.
     */
    protected function clearProductCache()
    {
        // Simple strategy: Clear everything starting with products_
        // Note: For file cache, we'd need a more specific strategy or just clear it all.
        // For simplicity in this demo, we can use a versioning key or just clear the main list.
        Cache::flush(); // This is aggressive but safe for this single-purpose project.
    }
}
