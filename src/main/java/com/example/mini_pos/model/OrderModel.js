export class OrderModel{

    constructor(order_id,customer_id,customer_name,order_item_id,description,total) {
        this.order_id = order_id;
        this.customer_id = customer_id;
        this.customer_name = customer_name;
        this.order_item_id = order_item_id;
        this.description = description;
        this.total = total;
    }

}