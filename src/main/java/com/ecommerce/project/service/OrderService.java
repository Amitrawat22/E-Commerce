package com.ecommerce.project.service;

import com.ecommerce.project.payload.OrderDTO;

import java.util.List;

public interface OrderService {
    OrderDTO placeOrder(String email, Long addressId, String paymentMethod,
                        String pgName, String pgPaymentId, String pgStatus, String pgResponseMessage);
    List<OrderDTO> getOrdersByUser(String email);
    List<OrderDTO> getAllOrders();
    OrderDTO updateOrderStatus(Long orderId, String orderStatus);
}
