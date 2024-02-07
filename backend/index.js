const express = require('express');
const { MongoClient, ObjectID } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const CONNECTION_STRING = "mongodb+srv://patrycja_przybysz:ZUKzsnjw498lz3jE@cluster0.bjn17sa.mongodb.net/?retryWrites=true&w=majority";
const DATABASE_NAME = "domki";
let database;

app.listen(5995, () => {
    MongoClient.connect(CONNECTION_STRING, (error, client) => {
        if (error) {
            console.error("Failed to connect to MongoDB:", error);
            return;
        }
        database = client.db(DATABASE_NAME);
        console.log("Connected to MongoDB successfully");
    });
});

app.get('/api/domki/reservation', (request, response) => {
    database.collection("booking").find({}).toArray((error, result) => {
        if (error) {
            console.error("Error fetching reservations:", error);
            response.status(500).send("Internal Server Error");
            return;
        }
        response.send(result);
    });
});

app.post('/api/domki/addreservation', (req, res) => {
    const { date_start, date_end, email, children, adults } = req.body;
    
    // Validate input
    if (!date_start || !date_end || !email || !children || !adults) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    // Generowanie unikalnego ID
    const reservationId = generateUniqueId();

    // Tworzenie obiektu rezerwacji
    const reservation = {
        _id: reservationId,
        date_start: new Date(date_start),
        date_end: new Date(date_end),
        email,
        children: parseInt(children),
        adults: parseInt(adults)
    };

    // Wstawianie rezerwacji do bazy danych
    database.collection("booking").insertOne(reservation, (error, result) => {
        if (error) {
            console.error("Error adding reservation:", error);
            return res.status(500).json({ message: "Failed to add reservation" });
        }
        console.log("Reservation added successfully");
        res.status(201).json({ message: "Reservation added successfully", reservation });
    });
});

function generateUniqueId() {
    // Tutaj możesz zaimplementować własną logikę generowania unikalnego ID, na przykład używając biblioteki UUID
    // W tym przykładzie używam prostej implementacji generowania losowego ciągu znaków jako ID
    return Math.random().toString(36).substr(2, 9); // Generuje losowy ciąg znaków o długości 9 znaków
}

app.post('/api/domki/checkavailability', (req, res) => {
    const { date_start, date_end } = req.body;
    
    // Sprawdź dostępność daty w bazie danych
    database.collection("booking").findOne({
        $or: [
            {
                date_start: { $gte: new Date(date_start), $lt: new Date(date_end) }
            },
            {
                date_end: { $gt: new Date(date_start), $lte: new Date(date_end) }
            }
        ]
    }, (error, result) => {
        if (error) {
            console.error("Error checking availability:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
        if (result) {
            // Data jest niedostępna
            return res.status(409).json({ message: "Selected dates are not available" });
        } else {
            // Data jest dostępna
            return res.status(200).json({ message: "Selected dates are available" });
        }
    });
});

