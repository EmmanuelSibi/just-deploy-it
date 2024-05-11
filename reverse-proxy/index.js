const express = require('express');
const httpProxy = require('http-proxy');

const app = express();


const PORT = process.env.PORT || 3000;
const proxy = httpProxy.createProxy();

const BASE_PATH = 'https://justdeployit.s3.ap-south-1.amazonaws.com/__output'

app.use((req, res) => {
    const hostname = req.hostname;
    const subdomain = hostname.split('.')[0];

    const resolvesTo = `${BASE_PATH}/${subdomain}`;

   return proxy.web(req, res, { target: resolvesTo,changeOrigin:true });
    
});

proxy.on('proxyReq', (proxyReq, req, res) => {
    const url = req.url;
    if(url === '/'){
        proxyReq.path += 'index.html'
    }
    return proxyReq;
});



app.listen(PORT, () => {
    console.log(`Reverse Proxy is running on port ${PORT}`);
});