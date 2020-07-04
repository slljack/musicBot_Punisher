const Discord = require('discord.js')
const client = new Discord.Client()
const ytdl = require("ytdl-core")

bot_secret_token = "Token"
client.login(bot_secret_token)


var servers = {}

client.on('ready', () => {
    console.log("Connected as " + client.user.tag)

    var generalChannel = client.channels.cache.get("706014789121343589") // Replace with known channel ID
    generalChannel.send("惩罚者报道~")  

    //Display all servers bot connected to
    console.log("Servers:")
    client.guilds.cache.forEach((guild) => {
        console.log(" - " + guild.name)

        //Display all channels
        guild.channels.cache.forEach((channel) => {
            console.log(` -- ${channel.name} (${channel.type}) - ${channel.id}`)
           })
    })

   
})

//Reply to a message
client.on('message', async (msg) => {
    // Prevent bot from responding to its own messages
    if (msg.author == client.user) {
        return
    }

    // if @ bot
    if (msg.mentions.has(client.user)) {
        
    }

    if(msg.content.startsWith("-") || msg.content.startsWith("?")){
        processCommand(msg);
     }

    if (msg.content == '/join') {
        // Only try to join the sender's voice channel if they are in one themselves
        if (msg.member.voice.channel) {
          const connection = await msg.member.voice.channel.join();
        }
        else {
          msg.reply('You need to join a voice channel first!');
        }
    }

    
       

})

function processCommand(msg){
    var primaryCommand = ""
    let command = msg.content.substr(1)
    let splitCommand = command.split(" ")
    primaryCommand = splitCommand[0]
    let arguments = splitCommand.slice(1)

    console.log(primaryCommand)
    //console.log(primaryCommand.toLowerCase == "command")

    switch (primaryCommand){
        case "短板是谁":
            whoIsShortage() 
        break

        case "command":
            helpCommand(msg)
        break

        case "roll":
            rollCommand(msg, arguments)
        break

        case "play":

           function play(connection, msg){
                var server = servers[msg.guild.id]

                server.dispatcher = connection.play(ytdl(server.queue[0], {filter: "audioonly"}))

                server.queue.shift()

                server.dispatcher.on("end", function(){
                    //dispatcher = null
                    if(server.queue[0]){
                        play(connection, msg)
                    }
                    else{
                        connection.disconnect()
                    }
                })

            }

            if(!arguments[0]){
                msg.channel.send("You need to provide a link!")
                return
            }

            console.log(msg.member.voice.channel)
            if(!msg.member.voice.channel){
                msg.channel.send("You must first join a voice channel!")
                return
            }

            if(!servers[msg.guild.id]) 
                servers[msg.guild.id] = {
                queue: []
            }

            var server = servers[msg.guild.id]

            server.queue.push(arguments[0])

            if(!msg.guild.voiceConnection) 
                msg.member.voice.channel.join().then(function(connection){
                    play(connection, msg)
                })
            

        break

        case "skip":
            var server = servers[msg.guild.id]
            if(server.dispatcher)
                server.dispatcher.end();
            
            msg.channel.send("skip to the next one")
        break

        case "stop":
            var server = servers[msg.guild.id]
            if(msg.guild.voice.connection){
                for(var i = server.queue.length - 1; i >= 0; i --){
                    server.queue.splice(i, 1)
                }

                server.dispatcher.end();
                msg.channel.send("Stop playing")

            }

            if(msg.guild.voice.connection) 
                msg.guild.voice.connection.disconnect()
        break
    }

    

    /*if(primaryCommand == ("短板是谁")){
        whoIsShortage()
       }

    if(primaryCommand == "command") {
        helpCommand(msg, arguments)
    }

    if(primaryCommand == "music"){
        //musicCommand(msg, arguments)
        if (arguments.length <= 1){
            connection.play(ytdl("https:// .youtube.com/watch?v=LtVuH4-32xw", {filter: "audioonly"}))
        }
    }
    
    if(primaryCommand == "roll"){
        rollCommand(msg, arguments)
    }*/
    
}

function  rollCommand(msg, arguments){
    console.log(arguments.length)
    if (arguments.length == 1){
        var maxRange = parseInt(arguments[0])
        msg.channel.send(msg.author.toString() + " rolled " + getRandomInt(maxRange))
    }
    else if(arguments.length == 0){
        msg.channel.send(msg.author.toString() + " rolled " + getRandomInt(100))
    }
    else{
        msg.channel.send("invalid range")
    }
}

function getRandomInt(maxRange) {
    return Math.floor(Math.random() * Math.floor(maxRange));
  }

function whoIsShortage(){
    let generalText = client.channels.cache.get("706014789121343589")
        generalText.send("还用问? Zfang啊!!!")
}

function helpCommand(msg){

    msg.channel.send("I can take:\n" +
    "\n" +
    "-play song(URL only)\n" +
    "-stop(stop all audio in queue)\n" +
    "-roll int(range, default 100)\n" +
    "-weather(not implenmented yet)")

    //let generalText = client.channels.cache.get("706014789121343589")
    //generalText.send()
    //generalText.send("I can take:\n~music song\n~weather")
    //receivedMessage.channel.send("~weather + \n + ~");
}

function musicCommand(arguments){
    console.log(arguments[0])
    if (arguments.length <= 1){
        connection.play(ytdl("https://www.youtube.com/watch?v=LtVuH4-32xw", {filter: "audioonly"}))
    }

    //generalText.send(songName);
}






// Get your bot's secret token from:
// https://discordapp.com/developers/applications/
// Click on your application -> Bot -> Token -> "Click to Reveal Token"
