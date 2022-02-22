require("dotenv").config();

// const verify_clan = require('brain.js');
var brains = require("./brain.js");
// require('./brain.js')();
// 


// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');
// const { ExplicitContentFilterLevels } = require("discord.js/typings/enums");
// const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"] });




const clan_bot_ch_id = "945351271320256572"

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
  // client.channels.cache.get(clan_bot_ch_id).send(`here again`)

})

// var prsnl_msg;
client.on("messageCreate", async (msg) => {

  // var sender = msg.guild.members.cache.get(msg.author.id);
  if (msg.content.startsWith('!join-')) {
    var clan_name = msg.content.split('!join-')[1]
    msg.channel.send("@" + msg.author.username + ", Please check your DM,to verify your email id");
    const DM = await msg.author.send("please provide your email id ");
    // msg.author.send("See or Change?");

    const filter = m => (m.content.includes('discord') && m.author.id != client.user.id);


    const collector = DM.channel.createMessageCollector(filter, { max: 1, time: 50000 });

    collector.on('collect', msg => {
      // console.log(msg.content);

      // verify_clan(clan_name, msg.content);
      brains.verify_clan(clan_name, msg.content).then(
        (is_valid_user) => {
          // channelid
// console.log(is_valid_user.reason+'<======'+is_valid_user.success)
          if (is_valid_user.success == true) {
            msg.author.send("Please give me a minute. i am verifying the details");

            // const new_clan_2_id = "945670146113032202"

            const new_clan_2_id = is_valid_user.channelid;

            console.log(is_valid_user.channelid);
            // console.log('=======\n'+msg.guild)
            const myChannel = client.channels.cache.get(new_clan_2_id);

            // client.channels.ge
            // console.log(msg.member.id)
            myChannel.permissionOverwrites.create(msg.author.id,
              { VIEW_CHANNEL: true },

            );
            myChannel.send('@' + msg.author.username + " welcome to the Clan");

          }
          else {
            // 1->email id not exist
            // 2-> admission close
            // 3-> clan does not 

            if (is_valid_user.reason == 1) {
              msg.author.send("sorry this email is not registered with us.Please enter a valid email address with which you registered.");
            } else if (is_valid_user.reason == 2) {
              msg.author.send("Admission for the clan are closed, try out another clan");

            } else if (is_valid_user.reason == 3) {
              msg.author.send("Clan you entered does not exist");
            } else {
              msg.author.send('some thing unexpected happend contact us or try again later!!')
            }

          }


          // console.log(r);
        }
      )


    })
    collector.on('end', () => {
      msg.author.send("you have Time out!!");
    })
  }

})

client.login(process.env.botToken);
