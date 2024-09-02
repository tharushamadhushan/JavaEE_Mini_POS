package com.example.mini_pos.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Data

public class OrderDTO implements Serializable {
    private String order_id;
    private String customer_id;
    private String customer_name;
    private String order_item_id;
    private String description;
    private double total;
}
