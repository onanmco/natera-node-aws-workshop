const express = require("express");
const yup = require("yup");
const _ = require("lodash");
const app = express();

const knex = require("knex").knex({
  client: "mysql2",
  connection: {
    user: "admin",
    password: "1234",
    host: "localhost",
    port: 3306,
    database: "test"
  }
})

app.use(express.json());

const registerSchema = yup.object({
  first_name: yup.string()
    .required(),
  last_name: yup.string()
    .required(),
  email: yup.string()
    .email()
    .required(),
  password: yup.string()
    .min(8)
    .max(32)
    .matches(/\d/, "password should contain at least 1 digit.")
    .matches(/[a-z]/, "password should containt at least 1 lowercase letter.")
    .matches(/[A-Z]/, "password should contain at least 1 uppercase letter.")
    .required()
});

const loginSchema = yup.object({
  email: yup.string()
    .email()
    .required(),
  password: yup.string()
    .required(),
});

app.post("/register", async (req, res) => {
  try {
    registerSchema.validateSync(req.body, { abortEarly: false })
  } catch (e) {
    res.status(400);
    return res.json({
      error: "Validation error",
      details: e.errors
    })
  }

  const {
    first_name,
    last_name,
    email,
    password
  } = req.body;

  const existingUser = await knex.select("*")
    .from("users")
    .where({ email })
    .first();


  if (existingUser) {
    res.status = 400;
    return res.json({
      error: "Validation error",
      message: `Email ${email} has already taken.`
    });
  }

  const [ id ] = await knex.insert({
    first_name,
    last_name,
    email,
    password
  })
  .into("users");

  const savedUser = await knex.select("*")
    .from("users")
    .where({ id: id })
    .first();

  return res.json({
    data: _.omit(savedUser, [ "id", "password" ])
  })
});

app.post("/login", async (req, res) => {
  try {
    loginSchema.validateSync(req.body);
  } catch (e) {
    res.status(400);
    return res.json({
      error: "Validation error",
      details: e.errors
    })
  }

  const {
    email,
    password
  } = req.body;

  const existingUser = await knex("users")
    .select("*")
    .where({ email, password })
    .first();

  if (!existingUser) {
    res.status = 400;
    return res.json({
      error: "Validation error",
      message: "Incorrect email or password",
    });
  }

  return res.json({
    message: "Logged in successfully",
    data: existingUser,
  });
});

app.listen(3000, () => {
  console.log("Server has just started to running on port 3000.");
});
