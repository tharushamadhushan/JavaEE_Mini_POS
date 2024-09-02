package com.example.mini_pos.db;

import com.example.mini_pos.dto.CustomerDTO;
import com.example.mini_pos.dto.ItemDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class ItemDBProcess {
    Connection connection;

    private static final String SAVE_ITEM_DATA = "INSERT INTO item(code,descr,qty,unitPrice) VALUES (?,?,?,?)";
    private static final String UPDATE_DATA = "UPDATE item SET descr=?, qty=?, unitPrice=? WHERE code=?";
    private static final String DELETE_DATA = "DELETE FROM item WHERE code = ?";
    private static final String SELECT_ALL_ITEMS = "SELECT * FROM item";

    final  static Logger logger = LoggerFactory.getLogger(CustomerDBProcess.class);

    public void saveItem(ItemDTO items, Connection connection) {
        ArrayList<ItemDTO> itemDTOS = new ArrayList<>();
        itemDTOS.add(items);
//        String customItemId = "IT" + UUID.randomUUID();
        for (ItemDTO itemData : itemDTOS) {
            try {
                System.out.println(connection);
                var ps = connection.prepareStatement(SAVE_ITEM_DATA);
                ps.setString(1, itemData.getCode());
//                ps.setString(1, itemData.getCode());
                ps.setString(2, itemData.getDescr());
                ps.setInt(3, itemData.getQty());
                ps.setDouble(4, itemData.getUnitPrice());

                if (ps.executeUpdate() != 0) {
                    System.out.println("Data saved");
                } else {
                    System.out.println("Failed to save");
                }

            } catch (SQLException e) {
                throw new RuntimeException(e);
            }
        }
    }
    public void updateItem(ItemDTO item, Connection connection) {
        try {
            PreparedStatement ps = connection.prepareStatement(UPDATE_DATA);

            ps.setString(1, item.getDescr());
            ps.setInt(2, item.getQty());
            ps.setDouble(3, item.getUnitPrice());
            ps.setString(4, item.getCode());

            int rowsAffected = ps.executeUpdate();
            if (rowsAffected != 0) {
                logger.info("Data Updated");
                System.out.println("Data updated");
            } else {
                logger.error("Failed to update");
                System.out.println("Failed to update");
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error updating item data", e);
        }
    }
    public void deleteItem(String itemId, Connection connection) {
        try {
            PreparedStatement ps = connection.prepareStatement(DELETE_DATA);
            ps.setString(1, itemId);

            int rowsAffected = ps.executeUpdate();
            if (rowsAffected != 0) {
                logger.info("Data Deleted");
                System.out.println("Data deleted");
            } else {
                logger.error("Failed to delete. Item not found.");
                System.out.println("Failed to delete");
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error deleting Item data", e);
        }
    }
    public List<ItemDTO> getAllItem(Connection connection) {
        List<ItemDTO> items = new ArrayList<>();

        try {
            PreparedStatement ps = connection.prepareStatement(SELECT_ALL_ITEMS);
            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                ItemDTO item = new ItemDTO(
                        rs.getString("code"),
                        rs.getString("descr"),
                        rs.getInt("qty"),
                        rs.getDouble("unitPrice")
                );
                items.add(item);
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error retrieving all items", e);
        }

        return items;
    }
}

