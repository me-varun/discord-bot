const {google} = require('googleapis');
const keys = require('../token.json');

let spreadsheetId = '1v2t1MoBj9ZKyEVD_Y7SjOxj1XxQefLdngH0b8S_rF6M';
let usersname = "udata"; //sheet containing user data
let sname = 'main' // sheet containing clan data

// response
// 1  user doesnot exist 
// 2  admission closed in the clan
// 3  clan doesnot exist



const gclient = new google.auth.JWT(
keys.client_email,
null,
keys.private_key,
['https://www.googleapis.com/auth/spreadsheets']
);

// async function verify(clan, email ){

// gclient.authorize(function(err,tokens){
//     if(err){
//         console.log(err);
//         // reject(new Error(err));
//     }else{
//         console.log('connected');

//   var d = await  verify_clan(clan ,email);
    
//     d.then((response)=>{
//         return response;
//             // console.log(response);
//         })

//     }

//  })
// }

async function verify_update_user(gsapi , email , channelid , roleid ){
    

    const optuser = {
        spreadsheetId:spreadsheetId,
        range: usersname
    }

    var updateopt = {
    spreadsheetId:spreadsheetId,
    range: usersname,
    valueInputOption: 'USER_ENTERED',
    // valueRangeBody:"hello"
    resource: {"values": []}

}
// let data1 =  await gsapi.spreadsheets.values.update(updateopt);
    let data =  await gsapi.spreadsheets.values.get(optuser);
   d = data.data.values
    // console.log(d);


   for(let i=0;i<d.length;i++){

        if(d[i][0] == email){
            // console.log("channel id ",channelid)
            
            updateopt['resource']["values"][0] = [roleid,channelid]

            updateopt['range'] = usersname+'!B'+(i+1)+':C'+(i+1);

            await gsapi.spreadsheets.values.update(updateopt);
            return true;  //channel id , role id added successfully
        
        }
    // console.log(d[i][0]);
   }
   return false //user doesnot exist
}



async function verify_clan(clan  , mail){

    gclient.authorize(function(err,tokens){
        if(err){
            console.log(err);
            // reject(new Error(err));
        }else{
            console.log('connected');

        }});

    const gsapi = google.sheets({version:"v4",auth:gclient})

    const opt = {
        spreadsheetId:spreadsheetId,
        range:sname
    }
    let data =  await gsapi.spreadsheets.values.get(opt);
   d = data.data.values

//    console.log(d)
    result = {channelid:null , success:false , reason:null}

    for(let i=0;i<d.length;i++){

        if (d[i][0] == clan){
            if(d[i][d[i].length - 1]=="YES"){
                
                channelid = d[i][2]
                roleid = d[i][1]

                var r = await verify_update_user(gsapi, mail,channelid , roleid )
                result['channelid'] = channelid
                if(r==false){
                    result['reason'] = 1
                    //user does not exist
                }
                result['success'] = r
                
                return result; // sucess  : true if user exist , else false
            
            }
            else{
                console.log("admission closed")
                result['reason'] = 2
                return result
                // return 2; // admission closed
            }
        }
       
        

    }
    result['reason'] = 3
    return result
    // return 3; //clan doesn't exist 
}


module.exports = { verify_clan };



