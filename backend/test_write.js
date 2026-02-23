
const fs = require('fs');
try {
    fs.writeFileSync('test_write_output.txt', 'hello from node');
} catch (e) {
    // can't log anywhere if write fails
}
