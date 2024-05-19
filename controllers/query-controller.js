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
        const queries = req.query;
        const documents = {};

        const { collection, values, responseFormat } = queries;

        let fields = {}; //program: Undergaduate
        const valuesArray = values.split(',')
        valuesArray.map((value) => {
            const key = value.split("=")[0]
            const fieldValue = value.split("=")[1]
            fields = { ...fields, [key]: fieldValue }
        })
        const projection = {};
        responseFormat.split(',').forEach(field => {
            projection[field] = 1;
        });
        const collectionResult = await db.collection(collection).find(fields).project({ ...projection }).toArray();
        documents[collection] = collectionResult;
        let options = {}
        Object.keys(projection).map((key)=>{
            if(key !== '_id'){
                options[key] = (documents[collection].map(doc => doc[key]))
            }
        })

        res.status(200).json({ success: true, message: "Documents fetched successfully", documents, options });
    } catch (error) {
        console.error("Error while fetching documents:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export { getQueries, getDocuments }