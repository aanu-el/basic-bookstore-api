const fs = require('fs')
const path = require('path')

// Define the file system database path
const usersDbPath = path.join(__dirname, '..', 'db', 'users.json')
const booksDbPath = path.join(__dirname, '..', 'db', 'books.json')

// Create Users Route
function createUser(req, res) {
    const body = []

    // Get the user information from the body of request
    req.on('data', (chunk) => {
        body.push(chunk)
    })

    req.on('end', () => {
        const parsedBody = Buffer.concat(body).toString()

        if (!parsedBody) {
            res.writeHead(400)
            res.end('User details not found')
        }

        // Parse the user information gotten from the body of user's request
        let newUserDetails = JSON.parse(parsedBody)

        // Get al registered Users from the db
        fs.readFile(usersDbPath, 'utf-8', (err, users) => {
            if (err) {
                res.writeHead(400)
                console.log(err)
                res.end('An error occurred when reading the file')
            }

            // Parse the registered users details gotten from the db
            const registeredUsers = JSON.parse(users)

            // Assign an ID to every new registered users
            let lastRegisteredUsersId = registeredUsers[registeredUsers.length - 1].id
            // console.log(lastRegisteredUsersId)
            newUserDetails.id = lastRegisteredUsersId + 1

            // Add the new registered user to the users db
            const allRegisteredUsers = [...registeredUsers, newUserDetails]

            // Save the updated user details into the db
            fs.writeFile(usersDbPath, JSON.stringify(allRegisteredUsers), (err) => {
                if (err) {
                    res.writeHead(400)
                    console.log(err)
                    res.end('An error occurred when saving the file to database')
                }

                res.end(JSON.stringify(allRegisteredUsers))
            })
        })
    })
}

// Authenticate Users Route
function authenticateUser(req, res) {
    const body = []

    req.on('data', (chunk) => {
        body.push(chunk)
    })

    req.on('end', () => {
        const parsedBody = Buffer.concat(body).toString()

        if (!parsedBody) {
            res.writeHead(400)
            console.log(err)
            res.end('Username and Password not Provided')
        }

        let userDetails = JSON.parse(parsedBody)

        fs.readFile(usersDbPath, 'utf-8', (err, users) => {
            if (err) {
                res.writeHead(400)
                console.log(err)
            }

            const registeredUsers = JSON.parse(users)

            let usernameFound = registeredUsers.find(user => user.username === userDetails.username)

            // console.log(usernameFound)
            if (!usernameFound) {
                res.writeHead(404)
                console.log(err)
                res.end('User not found. Please register')
            }

            console.log(usernameFound)

            if (usernameFound.password !== userDetails.password) {
                res.writeHead(404)
                console.log(err)
                res.end('Invalid Username or Password')
            }

            res.end(`Welcome ${userDetails.username}`)
        })

    })
}

// Get All Users Route
function getAllUsers(req, res) {
    fs.readFile(usersDbPath, 'utf-8', (err, users) => {
        if (err) {
            res.writeHead(400)
            console.log(err)
        }

        res.end(users)
    })
}

function createBook(req, res) {
    res.writeHead(200)
    res.end('Create Book Successfully')
}

function deleteBook(req, res) {
    res.writeHead(200)
    res.end('Delete Book Successfully')
}

function loanBook(req, res) {
    res.writeHead(200)
    res.end('Loaned out book successfully')
}

function returnBook(req, res) {
    res.writeHead(200)
    res.end('Returned Book Successfully')
}

function updateBooks(req, res) {
    res.writeHead(200)
    res.end('Book Updated Successfully')
}

// Export the request Handlers as modules
module.exports = {
    createUser, authenticateUser, getAllUsers, createBook, deleteBook, loanBook, returnBook, updateBooks
}