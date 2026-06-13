//Sample data to populate the database for testing purposes
require('dotenv').config();
const mongoose = require('mongoose');
const Entry = require('./models/Entry');

const seedData = [
    //Example entry
];

async function seed() {
    await mongoose.connect(process.env.MONGODB_URI);
    await Entry.deleteMany({});//clears existing data
    for (const item of seedData){
        const date = new Date();
        date.setDate(date.getDate() - item.daysAgo); 
        awaitEntry.create({
            timestamp: date,
            bristolScale: item.bristolScale,
            symptoms: item.symptoms,
            foodLogged: item.foodLogged,
            medications: item.medications,
            notes: item.notes,
            flagged: item.symptoms.includes('blood')
        });
    }
    console.log('Database seeded');
    mongoose.disconnect();
}
seed();