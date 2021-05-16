# DiscordCurrency
Discord bot that manages user currency with a google spreadsheet database. 

# Setup   
  1. Setup your Google Spreadsheets Database
      1. Go to https://console.developers.google.com/
      2. Create a new project and select **ENABLE APIS AND SERVICES**
      3. Select Google spreadsheets and setup your [credentials](#credentials)
      5. You'll receive a **_.json_** file which you'll need to put with your project files (You can rename it to **client_secret.json**)
         * If you don't get a .json file, select the service account from the account listing. 
         * Go to the keys tab and click Add Key --> Create Key --> JSON
      7. Create a new google spreadsheets doc
      8. Share your doc with your **_client_email_** found in your **_client_secret.json_**
      9. Set your table headers as these: 
      <img width="497" alt="table header" src="https://user-images.githubusercontent.com/23638848/82854847-a1ec5a00-9ed7-11ea-9c1c-63cec959082e.png">
      
   2. Create a .env file and set these variables: <br>
      1. Your Discord Bot Login Token
          * `TOKEN=<Discord_Login_Token>`
      2. Your Google Spreadsheet Token
          * `SHEET_TOKEN=<Google_Sheets_Token>` 
          * _Example:_
      <img width="964" alt="token" src="https://user-images.githubusercontent.com/23638848/82854828-900ab700-9ed7-11ea-909c-800891abbf98.png">
   3. Running the bot
      1. `npm install`
      2. `node index.js`

# Credentials
  1. Which API are you using? 
      * **Google Sheets API**
  2. Where will you be calling the API from? 
      * **Web server**
  3. What data will you be accessing? 
      * **Application Data**
  4. Are you planning to use this API with App Engine or Compute Engine? 
      * **No**
  5. Create your own service account name
  6. Role should be: **Editor**
  7. If asked for key type select: **JSON**
  8. Don't fill out Optional
  9. Create Credential


# Dependencies 
  1. Dotenv(https://www.npmjs.com/package/dotenv)
  2. google-spreadsheet(https://www.npmjs.com/package/google-spreadsheet)
  3. Discord.js(https://discord.js.org/#/)
  
# Usage

| Command | Description
|---------|-------------|
| `!add @user... [optional] <currency_amt> ` | Adds one/multiple users to the google spreadsheets database |
| `!list @user... / !list all` | shows a specific user's or everyone's wallet  |
| `!remove @user` | Removes a user from the database |
| `!transfer @user... <amount>` | Transfers money from your wallet to one/multiple users |
| `!update @user... <currency_amt>` | change one/multiple user's currency amt |
| `!wallet` | shows how much you have in your wallet |

# Showcase
_*User is a placeholder for your discord username_
1. Database Example
<img width="497" alt="database example" src="https://user-images.githubusercontent.com/23638848/82854854-a6b10e00-9ed7-11ea-83d5-dcfd7938750f.png">

2. Bank
<img width="419" alt="command" src="https://user-images.githubusercontent.com/23638848/82854873-b0d30c80-9ed7-11ea-945b-c82678c25e2b.png">
<img width="331" alt="bank" src="https://user-images.githubusercontent.com/23638848/82854867-ac0e5880-9ed7-11ea-96a4-f4859c5ccfe0.png">

3. Wallet
<img width="332" alt="wallet" src="https://user-images.githubusercontent.com/23638848/82854881-b6305700-9ed7-11ea-81ca-444b2d2a826a.png">
