import cluster from 'cluster';
import os from 'os';
import { startServer } from './app.js';

const numCPUs = os.cpus().length;

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
        console.log('Forking a new worker...');
        cluster.fork();
    });
} else {
    // Workers can share any TCP connection
    // In this case, it is an HTTP server
    console.log(`Worker ${process.pid} started`);
    startServer();
}
