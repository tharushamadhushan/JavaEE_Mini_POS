package com.example.mini_pos.db;

import com.example.mini_pos.dto.OrderDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class OrderDBProcess {
    private static final String SAVE_DATA = "INSERT INTO orders (order_id, customer_id, customer_name, order_item_id, description, total) VALUES ( ?, ?, ?, ?, ?, ?)";
    private static final Logger logger = LoggerFactory.getLogger(OrderDBProcess.class);

    public void saveOrder(OrderDTO order, Connection connection) {
        try {
            System.out.println("hello1");
            System.out.println(connection);
            PreparedStatement ps = connection.prepareStatement(SAVE_DATA);

            ps.setString(1, order.getOrder_id());
            ps.setString(2, order.getCustomer_id());
            ps.setString(3, order.getCustomer_name());
            ps.setString(4, order.getOrder_item_id());
            ps.setString(5, order.getDescription());
            ps.setDouble(6, order.getTotal());
            int rowsAffected = ps.executeUpdate();
            if (rowsAffected != 0) {
//                logger.info(() -> "Data Saved");
                System.out.println("Data saved");
            } else {
//                logger.error(() -> "Failed to save");
                System.out.println("Failed to save");
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error saving customer data", e);
        }
    }
}
