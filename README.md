# DiscordCurrency
Discord bot that manages user currency with a google spreadsheet database. 

# Setup   
  1. Setup your Google Spreadsheets Database
      1. Go to https://console.developers.google.com/
      2. Create a new project and select **ENABLE APIS AND SERVICES**
      3. Select Google spreadsheets and setup your credentials
      5. You'll receive a **_client_secret.json_** file which you'll need to put with your project files
      6. Create a new google spreadsheets doc
      7. Share your doc with your **_client_email_** found in your **_client_secret.json_**
      7. Set your table headers as these: 
      
   2. Create a .env file and set these variables: <br>
      1. Your Discord Bot Login Token
          * `TOKEN=<Discord_Login_Token>`
      2. Your Google Spreadsheet Token
          * `SHEET_TOKEN=<Google_Sheets_Token>` 

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
