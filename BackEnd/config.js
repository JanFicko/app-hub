let DOMAIN_NAME = "server:3000";

let WEB_PORT = "3000";

let JWT_SECRET = "THIS IS USED TO SIGN AND VERIFY JWT TOKENS, REPLACE IT WITH YOUR OWN SECRET, IT CAN BE ANY STRING";

let MONGODB_IP = "database";
let MONGODB_PORT = "27017";
let MONGODB_DATABASE_NAME = "app-hub";

let GITLAB_IP = "http://localhost/api/v4/";
let GITLAB_IP_SUFFIX = "api/v4/";
let GITLAB_PRIVATE_TOKEN = "PRIVATE_GITLAB_TOKEN";

let ANDROID_GROUP = "groups/8";
let IOS_GROUP = "groups/9";

let VERSION_REGEX = "^v[0-9]+.[0-9]+.[0-9]+$";
let NO_VERSION_TEXT = "No version";

module.exports = {
    DOMAIN_NAME,
    JWT_SECRET,
    WEB_PORT,
    MONGODB_IP,
    MONGODB_PORT,
    MONGODB_DATABASE_NAME,
    GITLAB_IP,
    GITLAB_IP_SUFFIX,
    GITLAB_PRIVATE_TOKEN,
    ANDROID_GROUP,
    IOS_GROUP,
    VERSION_REGEX,
    NO_VERSION_TEXT
};
