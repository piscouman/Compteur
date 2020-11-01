const Discord = require('discord.js');
const prefix = '*';
const token = process.argv.slice(2)[0];

const client = new Discord.Client();
client.vars = {};

client.once('ready',() => {
    console.log('ready');
});

client.on('message', (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    var toRemove = false;
    
    if (command === `stopbot` && (message.member.id == `360100919276339201` || message.member.id == `171691629219020800`)){ // piscou / fire
        message.delete()
            .then(msg => console.log(`Deleteds`))
            .catch(console.error);
        client.destroy();
        return;
    }

    if (command === `add`){
        if(message.member.hasPermission('MANAGE_MESSAGES') || message.member.id == `171691629219020800`) {
            if(!client.vars[message.guild.id]){
                client.vars[message.guild.id] = {};
            }
            if(client.vars[message.guild.id][args.join(' ')]){
                client.vars[message.guild.id][args.join(' ')] += 1;
                message.reply(args.join(' ')+' à un point de plus');
            } else {
                client.vars[message.guild.id][args.join(' ')] = 1;
                message.reply(args.join(' ')+' a été ajouté à la liste');
            }
        } else {message.reply('Vous n\'avez pas la permission')};
    }

    else if (command === `remove`){
        if(message.member.hasPermission('MANAGE_MESSAGES') || message.member.id == `171691629219020800`) {
            if(!client.vars[message.guild.id]){
                message.reply('Pas de classement en cours')
            }
            else if(client.vars[message.guild.id][args.join(' ')]){
                if(client.vars[message.guild.id][args.join(' ')] != 1){
                    client.vars[message.guild.id][args.join(' ')] -= 1;
                } else {
                    delete client.vars[message.guild.id][args.join(' ')];
                    if(Object.entries(client.vars[message.guild.id]).length == 0){
                        toRemove = true;
                    } 
                }
                message.reply(args.join(' ')+' à un point de moins');
            } else {
                message.reply(args.join(' ')+' Cette personne n\'est pas dans le classement');
            }
        } else {message.reply('Vous n\'avez pas la permission')};
    }

    else if (command === `top`){
        if (client.vars[message.guild.id]){
            mes = new Discord.MessageEmbed()
            .setColor('#fda134')
            .setTitle('Classement :')
            reponse = "";
            var sortable = Object.entries(client.vars[message.guild.id]);
            sortable.sort(function(a,b){
                return b[1]-a[1];
            });
            var precScore = -1;
            var precClassement = -1;
            for (var classement = 1;classement <= sortable.length;classement++){
                var currentPers = sortable[classement-1];
                if(precScore != currentPers[1]){
                    precScore = currentPers[1];
                    precClassement = classement;
                }
                reponse += precClassement+" : "+currentPers[0]+" : "+precScore+"\n";
            }
            reponse.substring(0, reponse.length - 1);
            mes.addField('\u200B',reponse)
            .setTimestamp()
            message.reply(mes);
        } else { message.reply("Le classement est vide")}
    }

    else if (command === `clear` | toRemove){
        if(message.member.hasPermission('MANAGE_MESSAGES') || message.member.id == `171691629219020800`) {
            delete client.vars[message.guild.id];
            message.reply('Classement effacé');
        } else {message.reply('Vous n\'avez pas la permission')};  
    }
    else if (command === `help`){
        mes = new Discord.MessageEmbed()
        .setColor('#fda134')
        .setTitle('Commande :')
        .addField('\u200B','  add\n  remove\n  top\n  clear')
        .setTimestamp();
        message.reply(mes);
    }
});

client.login(token);
