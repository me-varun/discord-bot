const {google} = require('googleapis');
const keys = require('../token.json');


const gclient = new google.auth.JWT(
keys.client_email,
null,
keys.private_key,
['https://www.googleapis.com/auth/spreadsheets']
);
gclient.authorize(function(err,tokens){
    if(err){
        console.log(err);
    }else{
        console.log('connected');
        gsrun(gclient);
    }
})

async function gsrun(cl){
    const gsapi = google.sheets({version:"v4",auth:cl})

    const opt = {
        spreadsheetId:'1v2t1MoBj9ZKyEVD_Y7SjOxj1XxQefLdngH0b8S_rF6M',
        range: 'main!A1:E3'
    }

   let data =  await gsapi.spreadsheets.values.get(opt);
console.log(data.data.values);

const updateopt = {
    spreadsheetId:'1v2t1MoBj9ZKyEVD_Y7SjOxj1XxQefLdngH0b8S_rF6M',
    range: 'main!B7',
    valueInputOption:"USER_ENTERED",
    // valueRangeBody:"hello"
    resource: {"values": [["hello"]]}

}
let data1 =  await gsapi.spreadsheets.values.update(updateopt);
// console.log(data1.data.values);
}