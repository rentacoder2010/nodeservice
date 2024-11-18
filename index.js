const express = require('express');
const axios = require('axios');
const qs = require('qs');

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

let token = null; // Variable to store the generated token

// Open endpoint to receive items
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

    // Axios configuration
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://apim-gw-sit-keu.cevalogistics.com/token',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded', 
        'Cookie': 'NSC_mc_wt_l8t-johsftt-bmm=ffffffff09e4407e45525d5f4f58455e445a4a42498d; NSC_mc_wt_l8t-johsftt-bmm=ffffffff09e4407d45525d5f4f58455e445a4a42498d; sticky-east=http://haproxy-tcp.haproxy.svc.cluster.local:8080; sticky-west=http://10.233.65.241:8080'
      },
      data: data
    };

    // Make the API request
    const response = await axios.request(config);

    // Store the token and log it
    token = response.data;
    console.log('Generated token:', token);

    // Send a response back
    res.status(200).send({
      message: 'Items received and token generated successfully.',
      token: token
    });
  } catch (error) {
    console.error('Error generating token:', error);

    // Send an error response
    res.status(500).send({
      message: 'Failed to generate token.',
      error: error.message
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
