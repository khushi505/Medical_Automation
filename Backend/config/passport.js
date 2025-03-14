// Backend/config/passport.js
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID, // from your .env
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // from your .env
      callbackURL: "http://localhost:5000/api/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Try to find a user with the given googleId.
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          // If not found by googleId, check by email.
          const email = profile.emails[0].value.toLowerCase();
          user = await User.findOne({ email });
          if (user) {
            // User exists via local signup. Update with googleId.
            user.googleId = profile.id;
            await user.save();
          } else {
            // No user exists, create a new one.
            user = await User.create({
              googleId: profile.id,
              name: profile.displayName,
              email,
              role: "patient", // You can update this if needed
              password: null, // Google users have no local password
            });
          }
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Serialize/deserialize for sessions
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
