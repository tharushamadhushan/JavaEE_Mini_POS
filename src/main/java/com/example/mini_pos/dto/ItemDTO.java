package com.example.mini_pos.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Data

public class ItemDTO implements Serializable {
    private String code;
    private String descr;
    private int qty;
    private double unitPrice;

    public void clear() {
        this.code = null;
        this.descr = null;
        this.qty = 0;
        this.unitPrice = 0;
    }
}
