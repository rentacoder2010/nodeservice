const express = require('express');
const axios = require('axios');
const qs = require('qs');

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

let token = null; // Variable to store the generated token

// Open endpoint to handle items and make API calls
app.post('/receive-items', async (req, res) => {
  try {
    // Log the received items
    const items = req.body;
    console.log('Received items:', items);

    // Data for token generation
    const data = qs.stringify({
      'grant_type': 'client_credentials',
      'client_id': 'KR7nL04C8v1p2tyCTBi4zfpfCd8a',
      'client_secret': 'fj3wGpkMsfoQPPU6vWyCnN4WD7Aa',
      'scope': 'appl_1731057439600'
    });

    // Axios configuration for token generation
    const configToken = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://apim-gw-sit-keu.cevalogistics.com/token',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': 'NSC_mc_wt_l8t-johsftt-bmm=ffffffff09e4407e45525d5f4f58455e445a4a42498d; NSC_mc_wt_l8t-johsftt-bmm=ffffffff09e4407d45525d5f4f58455e445a4a42498d; sticky-east=http://haproxy-tcp.haproxy.svc.cluster.local:8080; sticky-west=http://10.233.65.241:8080'
      },
      data: data
    };

    // First API call to get the token
    const tokenResponse = await axios.request(configToken);
    token = tokenResponse.data.access_token;
    console.log('Generated token:', token);

    // Axios configuration for the second API call
    const configData = {
      method: 'post',
      url: 'https://apim-gw-sit-keu.cevalogistics.com/cl/oms/connectorservice/1.0.0/connector/create-connector', // Replace with the actual endpoint
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'x-shopify-topic': 'orders/create',
        'x-shopify-order-id': '123456',
      },
      data: items   // Kafka Shopify JSON
    };

    // Second API call using the access token
    const dataResponse = await axios.request(configData);
    console.log('Items processed and second API called successfully.', dataResponse.data);

    // Send the second API response back to the client
    res.status(200).send();
  } catch (error) {
    console.error('Error:', error);

    // Send an error response
    res.status(500).send({
      message: 'An error occurred while processing.',
      error: error.message
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
