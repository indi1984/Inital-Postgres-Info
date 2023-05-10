const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgres://pi-ai:5432/demo'

const client = new Client ({ connectionString });

const users = [
  {
    name: 'John',
    age: '36',
  },
  {
    name: 'Sara',
    age: '30',
  },
  {
    name: 'Joe',
    age: '45',
  },
  {
    name: 'Remy',
    age: '29',
  },
];

async function dropTables() {
  try {
    await client.query(/*sql*/`
      DROP TABLE IF EXISTS users;
    `);
  } catch(err) {
    console.log('Error dropping tables!');
    console.log(err);
  };
};

async function createTables() {
  try {
    await client.query(/*sql*/`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        age INT
      );
    `);
  } catch(err) {
    console.log('Creating tables failed!');
    console.log(err);
  };
};

async function createUser(user) {
  const { name, age } = user;
  try {
    const { rows: [user] } = await client.query(/*sql*/`
      INSERT INTO users (name, age)
      VALUES ($1, $2)
      RETURNING *;    
    `, [name, age]);
    console.log(user);
    return user;
  } catch(err) {
    console.log('Error creating single user!');
    console.log(err);
  };
};

async function createInitialUsers() {
  try {
    await Promise.all(users.map(createUser));
  } catch(err) {
    console.log('Error creating users!');
    console.log(err);
  } finally {
    client.end();
  }
};

async function buildDB() {
  try {
    console.log('Starting to build the DB!');
    client.connect();
    console.log('Dropping Tables!');
    dropTables();
    console.log('Finished dropping tables!');
    console.log('Creating Tables!');
    createTables();
    console.log('Finished creating Tables!');
    console.log('Creating initial users!');
    createInitialUsers();
    console.log('Finished creating initial users!');
  } catch(err) {
    console.log('Something went wrong building the DB!');
    console.log(err);
  };
};

buildDB();
