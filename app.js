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
        // Get user input
        let userQ = answer.quantity;    // How many items the user wants
        let userProdID = answer.item;   // What is the ID of the item the user wants to buy
        
        // Check if item is in stock
        let sql = `SELECT * FROM products WHERE item_id = ${userProdID}`;

        connection.query(sql, (err, res) => {
            if (err) throw err;

            let q = res[0].stock_quantity;  // How many items in stock for that ID
            let p = res[0].price;           // Item's price
            let prod = res[0].product_name; // Name of item 
            
            // If it there's enough items
            if (q > 0) {
                console.log(`Your total is: $ ${userQ*p}.`);
                console.log(`Thanks for your purchase, enjoy your ${prod}`);
                // Update inventory using the user input
                let sql = `UPDATE products SET stock_quantity = stock_quantity - ${userQ} WHERE item_id = ${userProdID}`;
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