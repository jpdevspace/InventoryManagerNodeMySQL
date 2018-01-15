require('console.table');
const inquirer = require('inquirer');
const mysql = require('mysql');

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
        console.log("\n \n");
    });
};

// Checks for low inventory items (stock < 5 units)
const lowInv = () => {
    let sql = `SELECT * FROM products WHERE stock_quantity < 5`;

    connection.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res);
        bamazon();
    })
    
};

const addInv = () => {
    inquirer.prompt(
        [
            {
                name: "item",
                message: "What is the ID of the item you'd like to ADD"
            },
            {
                name: "quantity",
                message: "How many units would you like to ADD?"
            }
        ]
    ).then( answer => {
        let sql = `UPDATE products SET stock_quantity = stock_quantity + ${answer.quantity} WHERE item_id = ${answer.item}`;
        connection.query(sql, (err, res) => {
            console.log("Item added!");
            showInventory();
            bamazon();
        });
    });
}

// Initiate with Customer rights
const customer = () => {
    showInventory();
    // Ask user the ID and quantity of the item they'd like to purchase
    inquirer.prompt(
        [
            {
                name: "item",
                message: "What is the ID of the item you'd like to purhcase"
            },
            {
                name: "quantity",
                message: "How many units would you like to get?"
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
                // Update inventory using the user input
                let sql = `UPDATE products SET stock_quantity = stock_quantity - ${userQ} WHERE item_id = ${userProdID}`;
                connection.query(sql, (err, res) => {
                    if (err) throw err;
                    showInventory();
                    console.log(`Your total is: $ ${userQ*p}.`);
                    console.log(`Thanks for your purchase, enjoy your ${prod}`);
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

const manager = () => {
    // Display options for the manager
    inquirer.prompt(
        {
            name: "action",
            type: "list",
            message: "What would you like to do Mr. Manager?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        }
    ).then( answer => {
        switch(answer.action) {
            case "View Products for Sale":
                showInventory();
                manager();
                break;
            case "View Low Inventory":
                lowInv();
                break;
            case "Add to Inventory":
                addInv();
                break;
            case "Add New Product":
                newProd();
                break;
            default:
                console.log("Invalid!!!"); 
        }
    });
}

// Ask the user what options they'd like to see (customer, manager, supervisor)
const bamazon = () => {
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