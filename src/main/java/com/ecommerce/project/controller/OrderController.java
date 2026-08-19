package com.ecommerce.project.controller;

import com.ecommerce.project.payload.OrderDTO;
import com.ecommerce.project.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/order/users/payments/{paymentMethod}")
    public ResponseEntity<OrderDTO> placeOrder(
            @PathVariable String paymentMethod,
            @RequestParam Long addressId,
            @RequestParam(required = false, defaultValue = "") String pgName,
            @RequestParam(required = false, defaultValue = "") String pgPaymentId,
            @RequestParam(required = false, defaultValue = "") String pgStatus,
            @RequestParam(required = false, defaultValue = "") String pgResponseMessage) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        OrderDTO orderDTO = orderService.placeOrder(username, addressId, paymentMethod,
                pgName, pgPaymentId, pgStatus, pgResponseMessage);
        return new ResponseEntity<>(orderDTO, HttpStatus.CREATED);
    }

    @GetMapping("/order/users/myorders")
    public ResponseEntity<List<OrderDTO>> getMyOrders() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        List<OrderDTO> orders = orderService.getOrdersByUser(username);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @GetMapping("/admin/orders")
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        List<OrderDTO> orders = orderService.getAllOrders();
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @PutMapping("/admin/orders/{orderId}/orderStatus/{orderStatus}")
    public ResponseEntity<OrderDTO> updateOrderStatus(@PathVariable Long orderId,
                                                       @PathVariable String orderStatus) {
        OrderDTO updatedOrder = orderService.updateOrderStatus(orderId, orderStatus);
        return new ResponseEntity<>(updatedOrder, HttpStatus.OK);
    }
}
