// const {google} = require('googleapis');
// const {people} = google.people("v1");
// const SCOPES = ['https://www.googleapis.com/auth/contacts.readonly'];

// const oauth2Client = new google.auth.OAuth2({
//     client_id: "285264006457-ijdkhjtqa6suge9n102phskbthejea2u.apps.googleusercontent.com",
//     client_secret: "JNUTntkFVBPXRitLEURV_WzQ",

// })

// people.connections.list({
//     resourceName:'people/me',
//     personFields:'names,phoneNumbers'
// })
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/user/getContactList"
  },
  function(accessToken, refreshToken, contact, done) {
        console.log("access : ",accessToken);
        console.log("refresh :",refreshToken);
        console.log("contact : " , contact);
        return done();
  }
));

