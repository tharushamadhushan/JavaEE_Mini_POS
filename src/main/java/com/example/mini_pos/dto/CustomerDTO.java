package com.example.mini_pos.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Data

public class CustomerDTO implements Serializable {
    private String customer_id;
    private String name;
    private String address;
    private String contact;

    public void clear() {
        this.customer_id = null;
        this.name = null;
        this.address = null;
        this.contact = null;
    }

}
