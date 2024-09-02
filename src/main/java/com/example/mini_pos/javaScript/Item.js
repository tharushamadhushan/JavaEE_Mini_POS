$(document).ready(function () {
    $("#nav-item").click(function () {
        loadAllItem();
    });
    $("#save_item").click(function () {
        console.log("sss")
        let codeF = $("#item_id").val();
        let descriptionF = $("#desc").val();
        let qtyF = $("#qty").val();
        let unitPriceF = $("#price").val();
        $.ajax({
            method: "POST",
            contentType: "application/json",
            url: "http://localhost:8081/mini_pos_war_exploded/item",
            async: true,
            data: JSON.stringify({
                code: codeF,
                descr: descriptionF,
                qty: qtyF,
                unitPrice: unitPriceF
            }),
            success: function (data) {
                reset()
                alert("saved")
            },
            error: function (xhr, exception) {
                alert("Error")
            }
        })
    })

$("#update_item").click(function (){
    let codeF = $("#item_id").val();
    let descrF = $("#desc").val();
    let qtyF = $("#qty").val();
    let unitPriceF = $("#price").val();

    $.ajax({
        method:"PUT",
        contentType:"application/json",
        url:"http://localhost:8081/mini_pos_war_exploded/item",
        async:true,
        data:JSON.stringify({
            code:codeF,
            descr:descrF,
            qty:qtyF,
            unitPrice:unitPriceF

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

$("#delete_item").click(function () {
    let item_idF = $("#item_id").val();

    $.ajax({
        method: "DELETE",
        contentType: "application/json",
        url: "http://localhost:8081/mini_pos_war_exploded/item?code=" + item_idF,
        async: true,
        success: function (data) {
            reset()
            alert("Item deleted successfully");
        },
        error: function (xhr, exception) {
            alert("Error deleting customer");
        }
    });
});


        $("#item_reset").click(function () {
            reset();
        });
        const reset = () => {
            $("#item_id").val("");
            $("#desc").val("");
            $("#qty").val("");
            $("#price").val("");
            loadAllItem();
        }


        const loadAllItem = () => {
            $("#item-tbl-body").empty();
            $.ajax({
                url: "http://localhost:8081/mini_pos_war_exploded/item",
                method: "GET",
                dataType: "json",
                success: function (resp) {
                    console.log(resp);
                    for (const item of resp) {
                        let row = `<tr><td>${item.code}</td><td>${item.description}</td><td>${item.qty}</td><td>${item.unitPrice}</td></tr>;`
                        $("#item-tbl-body").append(row);
                    }
                    callMethod();
                }
            });
        }

function callMethod(){
    $("#item-tbl-body>tr").click(function (){
        let code =$(this).children().eq(0).text();
        let descr =$(this).children().eq(1).text();
        let qty =$(this).children().eq(2).text();
        let unitPrice =$(this).children().eq(3).text();

        $("#item_id").val(code);
        $("#desc").val(descr);
        $("#qty").val(qty);
        $("#price").val(unitPrice);
    })
}
});
