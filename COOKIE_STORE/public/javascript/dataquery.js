const mssql = require('mssql')

var database_user = {
    user: 'foo',
    password: 'foo',
    server: 'localhost',
    database: 'Proj',
    options: {
        trustServerCertificate: true
    }
}

async function update_productname(id, name) {
    var user_pool = new mssql.ConnectionPool( database_user )
    await user_pool.connect()
    var request = new mssql.Request( user_pool )
    request.input('id', id)
    request.input('name', name)
    var result = await request.query( 'UPDATE PRODUCTDATA SET NAME=@name WHERE ID=@id' )
    await user_pool.close()
}

async function update_productprice(id, price) {
    var user_pool = new mssql.ConnectionPool( database_user )
    await user_pool.connect()
    var request = new mssql.Request( user_pool )
    request.input('id', id)
    request.input('price', price)
    var result = await request.query( 'UPDATE PRODUCTDATA SET PRICE=@price WHERE ID=@id' )
    await user_pool.close()
}

async function get_userdata(column, user_desc, data = '*') {
    var user_pool = new mssql.ConnectionPool(database_user)
    await user_pool.connect()
    var request = new mssql.Request(user_pool)
    var result = await request.query(`SELECT ${data} FROM USERDATA WHERE ${column}='${user_desc}'`)
    await user_pool.close()
    data = []
    result.recordset.forEach(r => {
        data.push(r)
    })
    return data
}

async function get_user_cart(user_id) {
    try {
        const user_pool = new mssql.ConnectionPool(database_user)
        await user_pool.connect()

        const request = new mssql.Request(user_pool)
        const query = 'SELECT * FROM CART WHERE USER_ID = @user_id'

        request.input('user_id', mssql.Int, user_id);
        const result = await request.query(query)

        await user_pool.close()

        const data = result.recordset
        return data
    } catch (error) {
        console.error('Error:', error.message)
    }
}

async function add_to_user_cart(user_id, product_id) {
    try {
        const user_pool = new mssql.ConnectionPool(database_user)
        await user_pool.connect()

        const request = new mssql.Request(user_pool)
        const query = `INSERT INTO CART (USER_ID, PRODUCT_ID) VALUES (@user_id, @product_id)`

        request.input('user_id', mssql.Int, user_id)
        request.input('product_id', mssql.Int, product_id)

        await request.query(query)
        await user_pool.close()
    } catch (error) {
        console.error('Error:', error.message)
    }
}

async function delete_data(table, id) {
    var user_pool = new mssql.ConnectionPool(database_user)
    await user_pool.connect()

    var cartRequest = new mssql.Request(user_pool)
    await cartRequest.query(`DELETE FROM CART WHERE PRODUCT_ID =${id}`)

    var request = new mssql.Request(user_pool)
    await request.query(`DELETE FROM ${table} WHERE ID=${id}`)
    await user_pool.close()
}

async function get_productdata(column, product_desc, data = '*') {
    var user_pool = new mssql.ConnectionPool(database_user)
    await user_pool.connect()
    var request = new mssql.Request(user_pool)
    var result = await request.query(`SELECT ${data} FROM PRODUCTDATA WHERE ${column}='${product_desc}'`)
    await user_pool.close()
    data = []
    result.recordset.forEach(r => {
        data.push(r)
    })
    return data
}

async function get_products() {
    var user_pool = new mssql.ConnectionPool(database_user)
    await user_pool.connect()
    var request = new mssql.Request(user_pool)
    var result = await request.query(`SELECT * FROM PRODUCTDATA`)
    await user_pool.close()
    data = []
    result.recordset.forEach(r => {
        data.push(r)
    })
    return data
}

async function set_productdata(product) {
    var user_pool = new mssql.ConnectionPool(database_user)
    await user_pool.connect()
    var request = new mssql.Request(user_pool)
    await request.query(`INSERT INTO PRODUCTDATA(NAME, PRICE) VALUES('${product.name}', ${product.price})`)
    await user_pool.close()
}

async function set_userdata(user) {
    var user_pool = new mssql.ConnectionPool(database_user)
    await user_pool.connect()
    var request = new mssql.Request(user_pool)
    await request.query(`INSERT INTO USERDATA(NAME, PSSWRD) VALUES('${user.name}', '${user.psswrd}')`)
    await user_pool.close()
}

async function save_user_info(username, password) {
    var hash_password = await bcrypt.hash(password, 12)
    await database.set_userdata({ name: username, psswrd: hash_password })
}

async function check_if_id_exists(id) {
    var user_pool = new mssql.ConnectionPool(database_user)
    await user_pool.connect()
    var request = new mssql.Request(user_pool)
    request.input('id', id)
    var result = await request.query('SELECT COUNT(*) AS res FROM PRODUCTDATA WHERE ID=@id')
    await user_pool.close()
    return result.recordset[0].res == 1
}

module.exports = {
    get_productdata: get_productdata,
    get_userdata: get_userdata,
    set_productdata: set_productdata,
    set_userdata: set_userdata,
    get_products: get_products,
    delete_data: delete_data,
    add_to_user_cart: add_to_user_cart,
    get_user_cart: get_user_cart,
    save_user_info: save_user_info,
    update_productname: update_productname,
    update_productprice: update_productprice,
    check_if_id_exists: check_if_id_exists
};

