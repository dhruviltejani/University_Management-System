const bcrypt = require("bcrypt");

async function hashPassword() {
  const hashedPassword = await bcrypt.hash("tejani1234", 10);
  console.log(hashedPassword);
}
hashPassword();