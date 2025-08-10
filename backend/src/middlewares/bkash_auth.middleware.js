import axios from "axios";


const bkash_auth = async (req, res, next) => {


//  console.log(process.env.bkash_grant_token_url)
//  console.log(process.env.bkash_api_key)
//  console.log(process.env.bkash_secret_key)
//  console.log(process.env.bkash_username)
//  console.log(process.env.bkash_password)

  try {
    const { data } = await axios.post(
      process.env.bkash_grant_token_url,
      {
        app_key: process.env.bkash_api_key,
        app_secret: process.env.bkash_secret_key,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          username: process.env.bkash_username,
          password: process.env.bkash_password,
        },
      }
    );

  

    req.id_token = data.id_token
    // console.log("Response data:", data);
    // console.log("id_token:", data.id_token);

    next();
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

export { bkash_auth }
