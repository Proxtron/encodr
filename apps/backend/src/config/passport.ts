// import { Strategy as LocalStrategy} from "passport-local";
// import { getUserFromUsername, getUserWithId } from "../db/user.js";
// import bcrypt from "bcrypt";
// import passport from "passport";

// const passportConfig = () => {
//     passport.use(new LocalStrategy( async (username, password, done) =>  {
//         try {
//             const user = await getUserFromUsername(username);

//             if(!user) {
//                 return done(null, false, {message: "Username or password is incorrect"});
//             }

//             const passwordCorrect = await bcrypt.compare(password, user.password);
//             if(!passwordCorrect) {
//                 return done(null, false, {message: "Username or password is incorrect"});
//             }

//             return done(null, user);
//         } catch(error) {
//             done(error);
//         }
//     }));

//     passport.serializeUser((user, done) => {
//         done(null, user.id);
//     });

//     passport.deserializeUser(async (id: number, done) => {
//         try {
//             const user = await getUserWithId(id);

//             if(!user) {
//                 return done(null, false);
//             }

//             done(null, user);
//         } catch(err) {
//             done(err);
//         }
//     });
// }

// export default passportConfig;