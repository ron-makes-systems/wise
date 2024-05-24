
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const configApp = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'config.app.json')));
const configSync = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'config.sync.json')));
const schema = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'schema.json')));

const API_BASE_URL = 'https://api.wise.com';

async function fetchTransactions(token, startDate, endDate) {
  const response = await axios.get(`${API_BASE_URL}/v1/transactions`, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    params: {
      startDate,
      endDate
    }
  });
  return response.data;
}

async function syncData() {
  const token = process.env.WISE_ACCESS_TOKEN;
  const lastSyncDate = new Date(); // Replace with actual last sync date
  const currentDate = new Date();

  const transactions = await fetchTransactions(token, lastSyncDate.toISOString(), currentDate.toISOString());

  // Process and map transactions to the defined schema
  const mappedTransactions = transactions.map(tx => ({
    id: tx.id,
    amount: tx.amount.value,
    currency: tx.amount.currency,
    timestamp: new Date(tx.createdAt),
    description: tx.details.description
  }));

  // Logic to save mappedTransactions into the custom app's database
}

syncData()
  .then(() => console.log('Sync completed successfully'))
  .catch(err => console.error('Error during sync:', err));
