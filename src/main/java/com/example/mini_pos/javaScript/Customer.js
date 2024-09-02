$(document).ready(function (){
    $("#customer-nav").click(function () {
        loadAllCustomer();
    });
    $("#save_customer").click(function (){
        let customer_idF = $("#cust_id").val();
        let nameF = $("#name").val();
        let addressF = $("#address").val();
        let contactF = $("#contact").val();

        $.ajax({
            method:"POST",
            contentType:"application/json",
            url:"http://localhost:8081/mini_pos_war_exploded/customer",
            async:true,
            data:JSON.stringify({
                customer_id:customer_idF,
                name:nameF,
                address:addressF,
                contact:contactF

            }),
            success: function (data) {
                reset();
                alert("saved")

            },
            error: function (xhr, exception) {
                alert("Error")
            }

        })
        loadAllCustomer();

    });


$("#update_customer").click(function (){
    let customer_idF = $("#cust_id").val();
    let nameF = $("#name").val();
    let addressF = $("#address").val();
    let contactF = $("#contact").val();

    $.ajax({
        method:"PUT",
        contentType:"application/json",
        url:"http://localhost:8081/mini_pos_war_exploded/customer",
        async:true,
        data:JSON.stringify({
            customer_id:customer_idF,
            name:nameF,
            address:addressF,
            contact:contactF

        }),
        success: function (data) {
            reset()
            alert("saved")
        },
        error: function (xhr, exception) {
            alert("Error")
        }

    })

});

$("#delete_customer").click(function () {
    let customer_idF = $("#cust_id").val();

    $.ajax({
        method: "DELETE",
        contentType: "application/json",
        url: "http://localhost:8081/mini_pos_war_exploded/customer?customer_id=" + customer_idF,
        async: true,
        success: function (data) {
            reset()
            alert("Customer deleted successfully");
        },
        error: function (xhr, exception) {
            alert("Error deleting customer");
        }
    });
});


$("#customer_reset").click(function () {
    reset();
});
const reset = () => {
    $("#cust_id").val("");
    $("#name").val("");
    $("#address").val("");
    $("#contact").val("");
    loadAllCustomer();
}

const loadAllCustomer = () => {
    $("#customer-tbl-body").empty();
    $.ajax({
        url: "http://localhost:8081/mini_pos_war_exploded/customer",
        method: "GET",
        dataType: "json",
        success: function (resp) {
            console.log(resp);
            for (const customer of resp) {
                let row = `<tr><td>${customer.customer_id}</td><td>${customer.name}</td><td>${customer.address}</td><td>${customer.contact}</td></tr>;`
                $("#customer-tbl-body").append(row);
            }
            callMethod();
        }
    });
}
function callMethod(){
    $("#customer-tbl-body>tr").click(function (){
        let customer_id =$(this).children().eq(0).text();
        let name =$(this).children().eq(1).text();
        let address =$(this).children().eq(2).text();
        let contact =$(this).children().eq(3).text();

        $("#cust_id").val(customer_id);
        $("#name").val(name);
        $("#address").val(address);
        $("#contact").val(contact);
    })
}
});

