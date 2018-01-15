# InventoryManagerNodeMySQL
The app will take in orders from customers and deplete stock from the store's inventory

![alt text][screenshot]

[screenshot]: https://github.com/jpdevspace/InventoryManagerNodeMySQL/blob/master/img/screenshot.gif "Inventory manager Node app GIF"


## Getting started

1. Clone this repo in your project folder 

2. Run:

```
npm install
```
3. Check the store schema in the `storeSchema.sql` file to get an idea of the table and its columns.

4. Populate the table with the dummy data in the `storeSeed.sql` file.

5. Run the Node app with:

```
node app.js
```

## Instructions

After running the app with `node app.js` you have 2 options, go to the (1) Customer's options or (2) Manager's options.

1. Customer's options: You can see a list of the products, price and quantity available. If you decide to buy one, the database is updated to account for the purchased item.

2. Manager's options: The manager can see the list of products (and the same stats as the customer), can also check for items with low inventory leveles (less than 5 items in stock), can add units to products that already exist in the database and finally can create new products and assign them to an existing category in the database.
