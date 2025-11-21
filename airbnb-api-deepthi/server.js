const app = require("./app");
const config = require("./config/database");

const port = config.port || process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
