<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class DashboardService
{
    public function getStats()
    {
        return Cache::remember('admin_dashboard_stats', 300, function () {
            $stats = [
                'total_orders' => Order::count(),
                'total_revenue' => Order::where('status', '!=', 'cancelled')->sum('total_amount'),
                'low_stock_products' => Product::where('stock_quantity', '<', 10)->count(),
                'pending_orders' => Order::where('status', 'pending')->count(),
            ];

            $statusCounts = Order::select('status', DB::raw('count(*) as count'))
                ->groupBy('status')
                ->get();

            $dateFunc = config('database.default') === 'mysql' 
                ? 'DATE_FORMAT(created_at, "%Y-%m")' 
                : 'strftime("%Y-%m", created_at)';

            $monthlyRevenue = Order::where('status', '!=', 'cancelled')
                ->select(
                    DB::raw("$dateFunc as month"),
                    DB::raw('sum(total_amount) as revenue')
                )
                ->groupBy('month')
                ->orderBy('month', 'desc')
                ->limit(6)
                ->get();

            return [
                'stats' => $stats,
                'status_counts' => $statusCounts,
                'monthly_revenue' => $monthlyRevenue
            ];
        });
    }
}
