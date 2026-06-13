//Sample data to populate the database for testing purposes
require('dotenv').config();
const mongoose = require('mongoose');
const Entry = require('./models/Entry');

const seedData = [
    {daysAgo:27, bristolScale: 3, symptoms: ['bloating'], foodLogged: ['bread', 'milk'], medications: ['ibuprofen'], notes: 'Felt bloated after eating bread and milk.'},
    {daysAgo:26, bristolScale: 2, symptoms: ['constipation'], foodLogged: ['rice'], medications: [], notes: 'Constipated after eating rice.'},
    {daysAgo:25, bristolScale: 5, symptoms: ['diarrhea'], foodLogged: ['spicy food'], medications: [], notes: 'Had diarrhea after eating spicy food.'},
    {daysAgo:24, bristolScale: 4, symptoms: ['bloating', 'gas'], foodLogged: ['carbonated drinks'], medications: [], notes: 'Bloating and gas after drinking soda.'},
    {daysAgo:23, bristolScale: 1, symptoms: ['constipation', 'pain'], foodLogged: ['fast food'], medications: ['laxatives'], notes: 'Severe constipation and pain after eating fast food.'},
    {daysAgo:22, bristolScale: 6, symptoms: ['diarrhea'], foodLogged: ['sugar'], medications: [], notes: 'Diarrhea after consuming a lot of sugar.'},
    {daysAgo:21, bristolScale: 4, symptoms: [], foodLogged: ['vegetables'], medications: [], notes: 'Normal stool after eating vegetables.'},
    {daysAgo:20, bristolScale: 2, symptoms: ['constipation'], foodLogged: ['cheese'], medications: [], notes: 'Constipated after eating cheese.'},
    {daysAgo:19, bristolScale: 5, symptoms: ['diarrhea'], foodLogged: ['fried food'], medications: [], notes: 'Diarrhea after eating fried food.'},
    {daysAgo:18, bristolScale: 3, symptoms: ['bloating'], foodLogged: ['pasta'], medications: [], notes: 'Slight bloating after eating pasta.'},
    {daysAgo:17, bristolScale: 4, symptoms: ['bloating', 'gas'], foodLogged: ['beans'], medications: [], notes: 'Bloating and gas after eating beans.'},
    {daysAgo:16, bristolScale: 1, symptoms: ['constipation', 'pain'], foodLogged: ['bread'], medications: ['laxatives'], notes: 'Severe constipation and pain after eating bread.'},
    {daysAgo:15, bristolScale: 4, symptoms: ['bloating', 'gas'], foodLogged: ['beans'], medications: [], notes: 'Bloating and gas after eating beans.'},
    {daysAgo:14, bristolScale: 6, symptoms: ['diarrhea'], foodLogged: ['sugar'], medications: [], notes: 'Diarrhea after consuming a lot of sugar.'},
    {daysAgo:13, bristolScale: 2, symptoms: ['constipation'], foodLogged: ['cheese'], medications: [], notes: 'Constipated after eating cheese.'},
    {daysAgo:12, bristolScale: 5, symptoms: ['diarrhea'], foodLogged: ['fried food'], medications: [], notes: 'Diarrhea after eating fried food.'},
    {daysAgo:11, bristolScale: 3, symptoms: ['bloating'], foodLogged: ['pasta'], medications: [], notes: 'Slight bloating after eating pasta.'},
    {daysAgo:10, bristolScale: 6, symptoms: ['diarrhea', 'blood'], foodLogged: ['red meat'], medications: [], notes: 'Diarrhea with blood after eating red meat.'},
    {daysAgo:9, bristolScale: 4, symptoms: ['bloating', 'gas'], foodLogged: ['beans'], medications: [], notes: 'Bloating and gas after eating beans.'},
    {daysAgo:8, bristolScale: 1, symptoms: ['constipation', 'pain'], foodLogged: ['bread'], medications: ['laxatives'], notes: 'Severe constipation and pain after eating bread.'},
    {daysAgo:5, bristolScale: 1, symptoms: ['constipation', 'pain'], foodLogged: ['fast food'], medications: ['laxatives'], notes: 'Severe constipation and pain after eating fast food.'},
    {daysAgo:2, bristolScale: 7, symptoms: ['diarrhea'], foodLogged: ['sugar'], medications: [], notes: 'Diarrhea after consuming a lot of sugar.'},
    {daysAgo:1, bristolScale: 4, symptoms: [], foodLogged: ['vegetables'], medications: [], notes: 'Normal stool after eating vegetables.'},
    {daysAgo:0, bristolScale: 3, symptoms: ['bloating'], foodLogged: ['pasta'], medications: [], notes: 'Slight bloating after eating pasta.'},
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