<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Product;
use App\Models\OrderStatusHistory;
use Illuminate\Support\Facades\DB;

class OrderService
{
    public function createOrder(array $data, $user)
    {
        return DB::transaction(function () use ($data, $user) {
            $order = Order::create([
                'user_id' => $user->id,
                'total_amount' => 0,
                'status' => 'pending',
                'shipping_address' => $data['shipping_address']
            ]);

            $totalAmount = 0;

            foreach ($data['items'] as $item) {
                $product = Product::lockForUpdate()->findOrFail($item['product_id']);

                if ($product->stock_quantity < $item['quantity']) {
                    throw new \Exception("Insufficient stock for product: {$product->name}");
                }

                $subtotal = $product->price * $item['quantity'];
                
                $order->items()->create([
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $product->price,
                    'subtotal' => $subtotal
                ]);

                $product->decrement('stock_quantity', $item['quantity']);
                $totalAmount += $subtotal;
            }

            $order->update(['total_amount' => $totalAmount]);

            // Create initial status history
            $order->statusHistories()->create([
                'status' => 'pending',
                'changed_by' => $user->id,
                'notes' => 'Order placed successfully'
            ]);

            return $order->load('items.product');
        });
    }

    public function updateStatus(Order $order, string $newStatus, int $userId, ?string $notes = null)
    {
        return DB::transaction(function () use ($order, $newStatus, $userId, $notes) {
            $oldStatus = $order->status;
            
            // Logic for restoring stock on cancellation
            if (($newStatus === 'cancelled' || $newStatus === 'returned') && $oldStatus !== 'cancelled' && $oldStatus !== 'returned') {
                foreach ($order->items as $item) {
                    $item->product()->increment('stock_quantity', $item->quantity);
                }
            }

            $order->update(['status' => $newStatus]);

            $order->statusHistories()->create([
                'status' => $newStatus,
                'changed_by' => $userId,
                'notes' => $notes
            ]);

            return $order;
        });
    }
}
