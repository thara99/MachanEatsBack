const sendToken = async (user) => {

    // create JWT Token
    const token = user.getJwtToken();

    const option = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    }

    const tokendata = {
        token,
        option
    }

    return tokendata;

}

module.exports = sendToken;