const inquirer = require('inquirer');
const mysql = require('mysql');
require('console.table');

// Connection setup to MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: "root",
    password: "",
    database: "bamazonDB"
});

// Connect to MySQL DB
connection.connect( err => {
    if (err) throw err;
    showInventory();
    bamazon();
});

// Display updated inventory
const showInventory = () => {
    // Creating the query string
    let sql  = "SELECT * FROM products";
    // Query MySQL database
    connection.query(sql, (err, res) => {
        if (err) throw err;
        console.log("\n");
        console.table(res); // Display the table in the console
        console.log("\n");
    });
};

// Initiate with Customer rights
const customer = () => {
    // Ask user the ID and quantity of the item they'd like to purchase
    inquirer.prompt(
        [
            {
                name: "item",
                message: "What is the ID of the item you'd like to buy"
            },
            {
                name: "quantity",
                message: "How many units would you like to buy?"
            }
        ]
    ).then( answer => {
        // Check if item is in stock
        let sql = `SELECT stock_quantity FROM products WHERE item_id = ${answer.item}`;

        connection.query(sql, (err, res) => {
            if (err) throw err;
            
            // If it there's enough items
            if (res[0].stock_quantity > 0) {
                console.log("Thanks for your purchase");
                let sql = `UPDATE products SET stock_quantity = stock_quantity - ${answer.quantity} WHERE item_id = ${answer.item}`;
                connection.query(sql, (err, res) => {
                    if (err) throw err;
                    showInventory();
                    bamazon();
                })
            }
            // If there's not enough quantity alert the user
            else {
                console.log("Insufficient quantity!");
            }
        });
    });
}

// Ask the user what options they'd like to see (customer, manager, supervisor)
const bamazon = () => {
    console.log("\n\n");
    // Prompt user the different options
    inquirer.prompt(
        {
            name: "position",
            type: "list",
            message: "You are:",
            choices: ["Customer", "Manager", "Supervisor"]
        }
    ).then( answer => {
        switch(answer.position) {
            case "Customer":
                customer();
                break;
            case "Manager":
                manager();
                break;
            case "Supervisor":
                supervisor();
                break;
            default:
                console.log("Invalid!!!");
        }
    });
}