import {customer_db, item_db, order_db} from "../db/db.js";
import {ItemModel} from "../model/ItemModel.js";
import {OrderModel} from "../model/OrderModel.js";

import {loadItemData} from "./item_page_controller.js";
import {loadOrderCards} from "./recent_order_page_controller.js";

var row_index = null;

$('#customer_id').on('click', () => {
    customer_db.forEach(customer => {
        // Check if an option with the same customer_id already exists
        const isCustomerAdded = Array.from(document.getElementById('customer_id').options).some(option => {
            const existingCustomer = JSON.parse(option.value);
            return existingCustomer.customer_id === customer.customer_id;
        });

        if (!isCustomerAdded) {
            // If the customer with the same customer_id doesn't exist, add a new option
            const option = document.createElement("option");
            option.value = JSON.stringify(customer);
            option.text = customer.customer_id;
            document.getElementById('customer_id').appendChild(option);
        }
    });
});
$('#customer_id').on('change', () => {
    const selectedOption = $('#customer_id option:selected');

    if (selectedOption.length > 0) {
        const selectedCustomer = JSON.parse(selectedOption.val());
        let name = selectedCustomer.name;


        $('#customer_name').val(name);


    } else {
        console.log('No option selected');
    }
});


$('#order_item_id').on('click', () => {
    item_db.forEach(item => {
        // Check if an option with the same customer_id already exists
        const isItemAdded = Array.from(document.getElementById('order_item_id').options).some(option => {
            const existingCustomer = JSON.parse(option.value);
            return existingCustomer.item_id === item.item_id;
        });

        if (!isItemAdded) {
            // If the customer with the same customer_id doesn't exist, add a new option
            const option = document.createElement("option");
            option.value = JSON.stringify(item);
            option.text = item.item_id;
            document.getElementById('order_item_id').appendChild(option);
        }
    });
});
$('#order_item_id').on('change', () => {
    let item_id = $('#order_item_id option:selected').text();

    if (item_id) {

        let foundItem = null;
        let description = null;
        let price = 0;
        let qty = 0;


        for (let i = 0; i < item_db.length; i++) {
            if (item_db[i].item_id === item_id) {
                foundItem = item_db[i];
                console.log(foundItem)
                description = foundItem.item_description;
                price = foundItem.item_price;
                qty = foundItem.qty;
                break; // Exit the loop when the item is found
            }
        }


        $('#description').val(description);
        $('#unit_price').val(price);
        $('#qty_on_hand').val(qty);

    } else {
        console.log('No option selected');
    }
});


function calculateTotal() {
    let val = $('#order_qty').val();
    let price = $('#unit_price').val();

    let total = val * price;

    return total;
}


$('#add_cart').on('click', () => {

    // Get the item_id you want to check
    let item_id = $('#order_item_id option:selected').text();

// Check if the item_id already exists in the table body
    let itemExists = false;

    $('#order_table_body .item_id').each(function () {
        if ($(this).text() === item_id) {
            itemExists = true;
            // Update the quantity for the existing item
            let existingQty = parseInt($(this).closest('tr').find('.qty').text());
            let qty = parseInt($('#order_qty').val());
            let newQty = existingQty + qty;


            let existingTotal = parseInt($(this).closest('tr').find('.total').text());
            let add_total = calculateTotal();
            let newTotal = existingTotal + add_total;


            let selectedItem = item_db.find(item => item.item_id === item_id);

            if (selectedItem) {

                if (selectedItem.qty < qty) {
                    toastr.error('Error: Not enough items in stock.');
                    return;
                } else {
                    // Update the item_db to reduce the quantity
                    selectedItem.qty -= qty;
                    let index = item_db.findIndex(item => item.item_id === item_id);

                    // update item in the db
                    let item_object = item_db[index]
                    item_object.item_price -= qty;

                    $(this).closest('tr').find('.qty').text(newQty);
                    $(this).closest('tr').find('.total').text(newTotal);
                    loadItemData();
                }
                // Check if quantity is non-negative

            }

            return false; // Break the loop if a match is found
        }
    });

    if (!itemExists) {
        console.log('Item with ID ' + item_id + ' is not in the table.');

        let desc = $('#description').val();
        let total = calculateTotal();
        let qty = $('#order_qty').val();

        // Find the item in item_db by its item_id
        let selectedItem = item_db.find(item => item.item_id === item_id);

        if (selectedItem) {

            if (selectedItem.qty < qty) {
                toastr.error('Error: Not enough items in stock.');
                return;
            } else {
                // Update the item_db to reduce the quantity

                let index = item_db.findIndex(item => item.item_id === item_id);

                // update item in the db
                let item_object = item_db[index]
                item_object.qty -= parseInt(qty);
                item_db[index] = item_object;

                // other_js_file.js


// Now you can call the loadItem function
                loadItemData();

            }


        }

        // Add the item to the table
        let record = `<tr><td class="item_id">${item_id}</td><td class="desc">${desc}</td><td class="qty">${qty}</td><td class="total">${total}</td></tr>`;
        $("#order_table_body").append(record);


        toastr.success("Add to cart...🛒");


    } else {
        console.log('Item not found in item_db.');

    }


    let final_total = 0;
    for (let i = 0; i < $('#order_table_body tr').length; i++) {
        // Get the current row
        let row = $('#order_table_body tr').eq(i);
        let total = parseFloat(row.find('.total').text());
        final_total += total;


    }

    $('#final_total').val(final_total);

    const cmbItemId = document.getElementById('order_item_id');


    cmbItemId.innerHTML = '';
    $('#description').val('');
    $('#unit_price').val('');
    $('#qty_on_hand').val('');
    $('#order_qty').val('');

})


$("#order_table_body").on("click", "tr", function () {
    row_index = $(this).index();

    $("#order_table_body tr").removeClass("table-danger")
    $("#order_table_body tr").eq(row_index).addClass("table-danger");

});

$('#remove').on("click", () => {
    var $row = $("#order_table_body tr").eq(row_index);


    // Iterate through the cells in the row and get their values


    Swal.fire({
        title: 'Remove Item from Cart',
        text: 'Are you sure you want to remove this item from your cart?',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonColor: '#3085d6',
        confirmButtonColor: '#d33',
        confirmButtonText: 'Yes, remove it'
    }).then((result) => {
        if (result.isConfirmed) {
            $row.find(".total").each(function () {
                var cell_value = parseFloat($(this).text()); // Assuming the value is a number
                let final_total = $('#final_total').val();
                console.log(cell_value)
                final_total -= cell_value;
                $('#final_total').val(final_total);

            });
            $("#order_table_body tr").eq(row_index).remove();
            Swal.fire(
                'Removed from Cart',
                'The item has been successfully removed from your cart.',
                'success'
            );
        }
    });

})

$('#place_ord').on('click', () => {

    let order_id = $('#order_id').val();
    let customer_id = $('#customer_id option:selected').text();
    let total = $('#final_total').val();

    let items = [];
    let itemModel = null;
    var now = new Date();

// Get the local date in various formats
    var date = now.toLocaleDateString(); // R


    for (let i = 0; i < $('#order_table_body tr').length; i++) {

        let row = $('#order_table_body tr').eq(i);
        let item_id = row.find('.item_id').text();
        let desc = row.find('.desc').text();
        let qty = row.find('.qty').text();
        let total = row.find('.total').text();

        itemModel = new ItemModel(item_id, desc, total, qty);


        items.push(itemModel);
    }


    let orderModel = new OrderModel(order_id, customer_id, total, items, date);
    order_db.push(orderModel);
    toastr.success('Order placed successfully...🎁')
    loadOrderCards()
    $('#order_table_body').empty();
    $('#final_total').val('');

    const newOrderID = generateOrderID();
    $('#order_id').val(newOrderID);
    $('#customer_name').val('');
    const cust_id = document.getElementById('customer_id');


    cust_id.innerHTML = '';


    console.log(order_db)
});

function findHighestOrderNumber() {
    let highestOrderNumber = 0;

    for (const order of order_db) {
        const orderNumber = parseInt(order.order_id.slice(1), 10);
        if (!isNaN(orderNumber) && orderNumber > highestOrderNumber) {
            highestOrderNumber = orderNumber;
        }
    }

    return highestOrderNumber;
}

// Function to generate the next order ID
function generateOrderID() {
    const lastOrderNumber = findHighestOrderNumber();
    const nextOrderNumber = lastOrderNumber + 1;

    // Format the order number with leading zeros and "O" prefix
    const orderID = 'O' + nextOrderNumber.toString().padStart(3, '0');

    return orderID;
}

let orderID = generateOrderID();
$('#order_id').val(orderID);

