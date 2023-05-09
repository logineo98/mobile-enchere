import { vitepay_api } from "../../redux/constants/constants";


export const Config = {

    // WEBSITE_URL: "https://webhook.site/2d83b591-5722-4e89-9441-c7a5a20ffcd4",
    // dolo
    // WEBSITE_URL: "https://meyr-api.adaptable.app/vitepay/callback",
    // tz nation
    // WEBSITE_URL: "https://enchere-api.adaptable.app/vitepay/callback",
    WEBSITE_URL: vitepay_api,
    // WEBSITE_URL: 'meyere://main/vitepay_success',
    // RETURN_URL: 'https://jigiasso.com',
    RETURN_URL: "https://main--loquacious-souffle-f06037.netlify.app/#/",
    // RETURN_URL: 'meyere://main',

    /* Your website description */
    WEBSITE_DESCRIPTION: 'Paiement enchere',

    /* Put local */
    DEFAULT_LOCAL: 'fr',

    /* Put currency */
    DEFAULT_CURRENCY: 'XOF',

    /* Put country */
    DEFAULT_COUNTRY: 'ML',

    /* Put payment type */
    PAYMENT_TYPE: 'orange_money',

    /* Vitepay api version */
    API_VERSION: 1,

    /* Vitepay key */
    API_KEY: 'Obp4PMWAqg2TNA',

    /* Vitepay secret key */
    API_SECRET_KEY: 'efc0d563ebc65aeb81402f69d9b5bc06',

    /* ENV : sandbox on test mode otherwise ENV : prod on production mode */
    ENV: 'sandbox',

}