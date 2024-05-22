import { db } from '../config/db.js';

const getQueries = async (req, res) => {
    try {
        const params = req.query;
        const results = {};

        for (const key in params) {
            if (Object.hasOwnProperty.call(params, key)) {
                const collectionResult = await db.collection(key).find({}, params[key]).toArray();
                collectionResult.forEach(doc => {
                    for (const field in doc) {
                        if (doc.hasOwnProperty(field) && params[key].includes(field)) {
                            if (!results[field]) {
                                results[field] = [];
                            }
                            if (!results[field].includes(doc[field])) {
                                results[field].push(doc[field]);
                            }
                        }
                    }
                });
            }
        }
        res.status(200).json({ success: true, message: "Field values fetched successfully", queries: results });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Internal server error! Team working on it to fix" });
    }
};

const getDocuments = async (req, res) => {
    try {
        const { collection, values, responseFormat } = req.query;
        
        // Parsing the values into a query object
        const fields = values.split(',').reduce((acc, value) => {
            const [key, val] = value.split('=');
            acc[key] = val;
            return acc;
        }, {});
    
        
        // Constructing the projection object
        const projection = responseFormat.split(',').reduce((acc, field) => {
            acc[field] = 1;
            return acc;
        }, {});


        // Fetching documents from the database
        const collectionResult = await db.collection(collection).find(fields).project(projection).toArray();
        
        // Preparing the options object
        const options = {};
        if (collectionResult.length > 0) {
            Object.keys(projection).forEach(key => {
                if (key !== '_id') {
                    options[key] = collectionResult.map(doc => doc[key]);
                }
            });
        } else {
            Object.keys(projection).forEach(key => {
                if (key !== '_id') {
                    options[key] = [`No ${collection} found`];
                }
            });
        }

        // Responding with the fetched documents and options
        res.status(200).json({ success: true, message: "Documents fetched successfully", documents: { [collection]: collectionResult }, options });
    } catch (error) {
        console.error("Error while fetching documents:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


export { getQueries, getDocuments }