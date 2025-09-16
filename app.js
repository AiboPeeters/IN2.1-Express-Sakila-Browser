require('dotenv').config();

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const logger = require("./src/util/logger");

const indexRouter = require("./src/routes/index.routes");
const usersRouter = require("./src/routes/users.routes");
const moviesRouter = require("./src/routes/movie.routes")
const authRouter = require("./src/routes/auth.routes")

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

//app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
    session({
        secret: "geheime_sleutel",
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
            maxAge: 1000 * 60 * 60
        }

    })
)

app.use((req, res, next) => {
    res.locals.isAuthenticated = !!req.session.user
    res.locals.username = req.session.user ? req.session.user.username : null
    next()
})

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/movies", moviesRouter);
app.use("/auth", authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;

