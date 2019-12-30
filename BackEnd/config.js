let SERVER_PORT = "3000";

let DOMAIN_NAME = "localhost:" + SERVER_PORT;

/*
This is used to sign and verify JWT tokens. Replace it with your own secret, it can be any string.
 */
let JWT_SECRET = "THIS IS USED TO SIGN AND VERIFY JWT TOKENS, REPLACE IT WITH YOUR OWN SECRET, IT CAN BE ANY STRING";

let MONGODB_IP = "localhost";
let MONGODB_PORT = "27017";
let MONGODB_DATABASE_NAME = "apphub";

let GITLAB_IP = "http://localhost/api/v4/";
let GITLAB_IP_SUFFIX = "api/v4/";
let GITLAB_PRIVATE_TOKEN = "PRIVATE_GITLAB_TOKEN";

let ANDROID_GROUP = "groups/8/";
let IOS_GROUP = "groups/9/";

let VERSION_REGEX = "^v[0-9]+.[0-9]+.[0-9]+$";
let NO_VERSION_TEXT = "NO_VERSION";

/*
How long will the JWT token be valid.
*/
let LOGIN_TOKEN_VALIDITY = "24h";

/*
On the initial setup this email will be used for first registered user (together with the entered password).
*/
let INITIAL_SETUP_EMAIL = "jan.ficko@gmail.com";

module.exports = {
    DOMAIN_NAME,
    SERVER_PORT,
    JWT_SECRET,
    MONGODB_IP,
    MONGODB_PORT,
    MONGODB_DATABASE_NAME,
    GITLAB_IP,
    GITLAB_IP_SUFFIX,
    GITLAB_PRIVATE_TOKEN,
    ANDROID_GROUP,
    IOS_GROUP,
    VERSION_REGEX,
    NO_VERSION_TEXT,
    LOGIN_TOKEN_VALIDITY,
    INITIAL_SETUP_EMAIL
};
