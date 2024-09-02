import {order_db} from "../db/db.js";

const loadOrderCards = () => {
    const orderDetailsSection = document.querySelector(".order_details_cards");

    while (orderDetailsSection.firstChild) {
        orderDetailsSection.removeChild(orderDetailsSection.firstChild);

    }


    for (let i = 0; i < order_db.length; i++) {
        const order = order_db[i];
        console.log('A')

        // Create a new card element
        const card = document.createElement("div");
        card.className = "card border-primary mb-3";
        card.style = "max-width: 18rem;";
        card.style = "margin-left: 10px";
        card.style = "margin-right: 10px";
        card.style = "box-sizing:content-box";
        card.style = " box-shadow: 5px 5px 10px black";

        // Create card body
        const cardBody = document.createElement("div");
        cardBody.className = "card-body text-primary";

        // Add order details to the card
        const orderIDElement = document.createElement("h5");
        orderIDElement.className = "card-title";
        orderIDElement.textContent = `Order ID: ${order.order_id}`;

        const orderDateElement = document.createElement("p");
        orderDateElement.className = "card-text";
        orderDateElement.textContent = `Order Date: ${order.date}`;

        const customerIDElement = document.createElement("p");
        customerIDElement.className = "card-text";
        customerIDElement.textContent = `Customer ID: ${order.customer_id}`;

        const totalElement = document.createElement("p");
        totalElement.className = "card-text";
        totalElement.textContent = `Total: Rs.${order.total} /=`;

        // Append elements to the card
        cardBody.appendChild(orderIDElement);
        cardBody.appendChild(orderDateElement);
        cardBody.appendChild(customerIDElement);
        cardBody.appendChild(totalElement);

        card.appendChild(cardBody);

        // Append the card to the orderDetailsSection
        orderDetailsSection.appendChild(card);
    }
};

// Call the loadOrderCards function to generate the order cards
loadOrderCards();
export { loadOrderCards}
