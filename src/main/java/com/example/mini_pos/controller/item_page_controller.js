import {item_db} from "../db/db.js";
import {ItemModel} from "../model/ItemModel.js";


var row_index = null;

const priceRegex = /^\$?\d+(,\d{3})*(\.\d{2})?$/;
const regPrice = new RegExp(priceRegex);

const quantityRegex = /^\d+$/;
const regQuantity = new RegExp(quantityRegex);

const loadItemData = () => {
    $('#item-tbl-body').empty(); // make tbody empty
    item_db.map((item, index) => {
        let record = `<tr><td class="item_id">${item.item_id}</td><td class="description">${item.item_description}</td><td class="price">${item.item_price}
        </td><td class="qty">${item.qty}</td></tr>`;
        $("#item-tbl-body").append(record);
    });
}


// save
$("#save_item[type='button']").on("click", () => {
    let item_id = $("#item_id").val();
    console.log(item_id);
    let validity = -1;
    validity = item_db.findIndex(item => item.item_id === item_id);

    if (validity === -1) {


        let desc = $("#desc").val();
        let price = $("#price").val();
        let qty = $("#qty").val();

        if (item_id) {
            if (desc) {

                var priceValid = regPrice.test(price);

                if (price && priceValid) {

                    var qtyValid = regQuantity.test(qty);

                    if (qty && qtyValid) {
                        let item_object = new ItemModel(item_id, desc, price, qty);

                        // save in the db
                        item_db.push(item_object);

                        // clear();
                        $("#item_reset[type='reset']").click();

                        // load student data
                        loadItemData();
                        toastr.success("Item successfully added...✅");

                    } else {
                        toastr.error("Qty is empty or Qty is invalid...❌");
                    }
                } else {
                    toastr.error("Price is empty or  Price is invalid...❌");
                }
            } else {
                toastr.error("Description is empty...❌");
            }
        } else {
            toastr.error("Item ID is empty...❌");
        }

    } else {
        window.alert("Item ID is Already Exist :(");
    }


});

/*update*/
$("#update_item[type='button']").on("click", () => {

    let item_id = $("#item_id").val();
    let desc = $("#desc").val();
    let price = $("#price").val();
    let qty = $("#qty").val();


    let item_object = new ItemModel(item_id, desc, price, qty);

    // find item index
    let index = item_db.findIndex(item => item.item_id === item_id);

    // update item in the db
    item_db[index] = item_object;

    // clear();
    $("#item_reset[type='reset']").click();

    // load student data
    loadItemData();
})

// delete
$("#delete_item[type='button']").on("click", () => {
    let item_id = $("#item_id").val();

    // find item index
    let index = item_db.findIndex(item => item.item_id === item_id);

    // remove the item from the db
    item_db.splice(index, 1);

    $("#item_reset[type='reset']").click();

    // load student data
    loadItemData();
})

$("#item-tbl-body").on("click", "tr", function () {
    row_index = $(this).index();
    console.log(row_index);
    let item_id = $(this).find(".item_id").text();
    let description = $(this).find(".description").text();
    let price = $(this).find(".price").text();
    let qty = $(this).find(".qty").text();
    $("#item_id").val(item_id);
    $("#desc").val(description);
    $("#price").val(price);
    $("#qty").val(qty);
})
loadItemData();
export {loadItemData}


