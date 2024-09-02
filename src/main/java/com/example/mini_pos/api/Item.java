package com.example.mini_pos.api;

import com.example.mini_pos.db.CustomerDBProcess;
import com.example.mini_pos.db.ItemDBProcess;
import com.example.mini_pos.dto.CustomerDTO;
import com.example.mini_pos.dto.ItemDTO;
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
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;

@WebServlet(name = "item",urlPatterns = "/item",
        initParams = {
                @WebInitParam(name = "db-user",value = "root"),
                @WebInitParam(name = "db-pw",value = "1234"),
                @WebInitParam(name = "db-url",value = "jdbc:mysql://localhost:3306/javaee?createDatabaseIfNotExist=true"),
                @WebInitParam(name = "db-class",value = "com.mysql.cj.jdbc.Driver"),

        }
)
public class Item extends HttpServlet {
    final  static Logger logger = LoggerFactory.getLogger(Item.class);
    Connection connection;

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
            ItemDTO itemDTOList = jsonb.fromJson(req.getReader(), new ItemDTO() {
            }.getClass().getGenericSuperclass());
            var dbProcess = new ItemDBProcess();

            dbProcess.saveItem(itemDTOList, connection);
            jsonb.toJson(itemDTOList, resp.getWriter());

        }

    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        if (req.getContentType() == null || !req.getContentType().toLowerCase().startsWith("application/json")) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST);

        } else {
            Jsonb jsonb = JsonbBuilder.create();
            ItemDTO itemDTO = jsonb.fromJson(req.getReader(), new ItemDTO() {
            }.getClass().getGenericSuperclass());
            var dbProcess = new ItemDBProcess();

            dbProcess.updateItem(itemDTO, connection);
            jsonb.toJson(itemDTO, resp.getWriter());

        }
    }
    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String itemId = req.getParameter("code");

        if (itemId == null || itemId.isEmpty()) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Item ID is missing in the request.");
            return;
        }

        var dbProcess = new ItemDBProcess();
        dbProcess.deleteItem(itemId, connection);
        resp.getWriter().write("Item deleted successfully.");
    }
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/javaee", "root", "1234");
            ResultSet rst = connection.prepareStatement("select * from item").executeQuery();
            String allRecords = "";
            while (rst.next()) {
                String code = rst.getString("code");
                String description = rst.getString("descr");
                int qty = rst.getInt("qty");
                double unitPrice = rst.getDouble("unitPrice");
//                System.out.println(code + " " + description + " " + qty + " " + unitPrice);

                String item = "{\"code\":\"" + code + "\",\"description\":\"" + description + "\",\"qty\":" + qty + ",\"unitPrice\":" + unitPrice + "},";
                allRecords = allRecords + item;
            }
            String finalJson = "[" + allRecords.substring(0, allRecords.length() - 1) + "]";
            PrintWriter writer = resp.getWriter();
            writer.write(finalJson);
            resp.setContentType("application/json");

        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
