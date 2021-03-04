const { Pool, Client } = require('pg')

const client = new Client({
    connectionString: 'postgres://lovxfdpqyjvyry:5eced6719f4671aeec98218c39ad824cbd6143b7139ddbdba274baf807f6f825@ec2-52-205-3-3.compute-1.amazonaws.com:5432/dbtrmbvqej4gro',
    ssl: {
      rejectUnauthorized: false
    }
  });

client.connect();

module.exports = client; 
