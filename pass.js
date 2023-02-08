const bcrypt = require('bcrypt');

const getPass = async () => {
    // const hashPassword = await bcrypt.hash('Alex3208', 10);
    const hashPassword = await bcrypt.hash('jmsr06', 10);
    console.log(hashPassword)
}

getPass()
