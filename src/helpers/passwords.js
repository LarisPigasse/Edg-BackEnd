import bcrypt from "bcrypt";

export const cryptaPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

export const verifyPassword = async function (password,passwordDb) {
    return await bcrypt.compare(password, passwordDb);
}