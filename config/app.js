require('dotenv').config()

module.exports = {
    server: process.env.APP_URL,
    ports: {
        http: process.env.PORT || 3000,
    },
    jwt: {
        auth_key: "eyJuZWJ1bGEyMDIzUFQiOiJSUzI1NiIsInR5cCI6IkpXVCJ9",
        service_key: "eyJuZWJ1bGEyMDIzUFRTSyI6IlJTMjU2IiwidHlwIjoiSldUIn0"
    },
    mongo: {
        url: `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.aatxsjw.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`
    }
};

// echo -n '{"nebula2023PT":"RS256","typ":"JWT"}' | base64 | sed s/\+/-/ | sed -E s/=+$//
// echo -n '{"nebula2023PTSK":"RS256","typ":"JWT"}' | base64 | sed s/\+/-/ | sed -E s/=+$//

