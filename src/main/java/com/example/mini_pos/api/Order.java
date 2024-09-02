package com.example.mini_pos.api;

import com.example.mini_pos.db.CustomerDBProcess;
import com.example.mini_pos.db.OrderDBProcess;
import com.example.mini_pos.dto.CustomerDTO;
import com.example.mini_pos.dto.OrderDTO;
import jakarta.json.bind.Jsonb;
import jakarta.json.bind.JsonbBuilder;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebInitParam;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;
import java.io.*;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;

@WebServlet(name = "orders",urlPatterns = "/orders",
        initParams = {
                @WebInitParam(name = "db-user",value = "root"),
                @WebInitParam(name = "db-pw",value = "1234"),
                @WebInitParam(name = "db-url",value = "jdbc:mysql://localhost:3306/javaee?createDatabaseIfNotExist=true"),
                @WebInitParam(name = "db-class",value = "com.mysql.cj.jdbc.Driver"),

        }
)
public class Order extends HttpServlet {
    Connection connection;
    final static Logger logger = LoggerFactory.getLogger(Order.class);

    @Override
    public void init() throws ServletException {
        try {
            InitialContext ctx = new InitialContext();
            DataSource pool = (DataSource) ctx.lookup("java:comp/env/jdbc/pos");
            System.out.println(pool);
            this.connection = pool.getConnection();

        } catch (NamingException | SQLException e) {
            e.printStackTrace();
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        if (req.getContentType() == null || !req.getContentType().toLowerCase().startsWith("application/json")) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST);

        } else {
            Jsonb jsonb = JsonbBuilder.create();
            OrderDTO orderDTO = jsonb.fromJson(req.getReader(), new OrderDTO() {
            }.getClass().getGenericSuperclass());
            var dbProcess = new OrderDBProcess();

            dbProcess.saveOrder(orderDTO, connection);
            jsonb.toJson(orderDTO, resp.getWriter());

        }
    }
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/javaee","root","1234");
            ResultSet rst = connection.prepareStatement("select * from orders").executeQuery();
            String allRecords = "";
            while (rst.next()){
                String order_id = rst.getString(1);
                String customer_id = rst.getString(2);
                String customer_name = rst.getString(3);
                String order_item_id = rst.getString(4);
                String description = rst.getString(5);
                double total = rst.getDouble(6);

                String orders="{\"order_id\":\""+order_id+"\",\"customer_id\":\""+customer_id+"\",\"customer_name\":\""+customer_name+"\",\"order_item_id\":\""+order_item_id+"\",\"description\":\""+description+"\",\"total\":"+total+"},";
                allRecords = allRecords + orders;
            }
            String finalJson = "[" + allRecords.substring(0,allRecords.length()-1) + "]";
            PrintWriter writer = resp.getWriter();
            writer.write(finalJson);
            resp.setContentType("application/json");

        } catch (ClassNotFoundException | SQLException e) {
            e.printStackTrace();
        }

    }
}
