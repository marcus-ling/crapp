//Sample data to populate the database for testing purposes
require('dotenv').config();
const mongoose = require('mongoose');
const Entry = require('./models/Entry');

const seedData = [
    { daysAgo: 1, bristolScale: 3, color: 'brown', notes: 'Felt bloated after eating bread.' },
    { daysAgo: 2, bristolScale: 5, color: 'light-brown', notes: 'Had a salad for lunch.' },
    { daysAgo: 3, bristolScale: 1, color: 'dark-brown', notes: 'Constipated, no symptoms.' },
    { daysAgo: 4, bristolScale: 6, color: 'yellow', notes: 'Diarrhea after eating spicy food.' },
    { daysAgo: 5, bristolScale: 4, color: 'green', notes: 'Normal day, no symptoms.' },
    { daysAgo: 6, bristolScale: 2, color: 'black', notes: 'Very hard stool, felt uncomfortable.' },
    {daysAgo: 7, bristolScale: 5, color: 'light-brown', notes: 'Had a turkey sandwich for lunch.' },
    { daysAgo: 8, bristolScale: 3, color: 'brown', notes: 'Felt bloated after eating bread.' },
    { daysAgo: 9, bristolScale: 5, color: 'light-brown', notes: 'Had a salad for lunch.' },
    { daysAgo: 10, bristolScale: 1, color: 'dark-brown', notes: 'Constipated, no symptoms.' },
    { daysAgo: 11, bristolScale: 6, color: 'yellow', notes: 'Diarrhea after eating spicy food.' },
    { daysAgo: 12, bristolScale: 4, color: 'green', notes: 'Normal day, no symptoms.' },
    { daysAgo: 13, bristolScale: 2, color: 'black', notes: 'Very hard stool, felt uncomfortable.' },
    {daysAgo: 14, bristolScale: 5, color: 'light-brown', notes: 'Had a turkey sandwich for lunch.'},
    {daysAgo: 15, bristolScale: 3, color: 'brown', notes: 'Felt bloated after eating bread.' },
    {daysAgo: 16, bristolScale: 5, color: 'light-brown', notes: 'Had a salad for lunch.'},
    {daysAgo: 17, bristolScale: 1, color: 'dark-brown', notes: 'Constipated, no symptoms.' },
    {daysAgo: 18, bristolScale: 6, color: 'yellow', notes: 'Diarrhea after eating spicy food.' },
    {daysAgo: 19, bristolScale: 4, color: 'green', notes: 'Normal day, no symptoms.' },
    {daysAgo: 20, bristolScale: 2, color: 'black', notes: 'Very hard stool, felt uncomfortable.' },
    {daysAgo: 21, bristolScale: 5, color: 'light-brown', notes: 'Had a turkey sandwich for lunch.' },
    {daysAgo: 22, bristolScale: 3, color: 'brown', notes: 'Felt bloated after eating bread.' },
    {daysAgo: 23, bristolScale: 5, color: 'light-brown', notes: 'Had a salad for lunch.' },
    {daysAgo: 24, bristolScale: 1, color: 'dark-brown', notes: 'Constipated, no symptoms.' },
    {daysAgo: 25, bristolScale: 6, color: 'yellow', notes: 'Diarrhea after eating spicy food.' },
    {daysAgo: 26, bristolScale: 4, color: 'green', notes: 'Normal day, no symptoms.' },
    {daysAgo: 27, bristolScale: 2, color: 'black', notes: 'Very hard stool, felt uncomfortable.' },
    {daysAgo: 28, bristolScale: 5, color: 'light-brown', notes: 'Had a turkey sandwich for lunch.' },
];

async function seed() {
    await mongoose.connect(process.env.MONGODB_URI);
    await Entry.deleteMany({});//clears existing data
    for (const item of seedData){
        const date = new Date();
        date.setDate(date.getDate() - item.daysAgo); 
        await Entry.create({
            timestamp: date,
            bristolScale: item.bristolScale,
            color: item.color,
            //symptoms: item.symptoms,
            //foodLogged: item.foodLogged,
            //medications: item.medications,
            notes: item.notes,
            //flagged: item.symptoms.includes('blood')
        });
    }
    console.log('Database seeded');
    mongoose.disconnect();
}
seed();