const Discord = require('discord.js');
const TOKEN = 'token';
const OWNERID = "257147179297144833";
var bot = new Discord.Client();
var RESULTDATA = new Array();
var mysql = require('mysql');
var HOST_ = "127.0.0.1";
var USER_ = "root";
var PASS_ = "";
var prefix = "`", command, botLogId = "", words_ = "", ignoreWords = "";
var botMessage = 5000;
var userMessage = 3000;
var warnMessage = 30000;
var colorEmbed = 3447003;
var detik = 0;

bot.on("ready", function(){
    bot.user.setPresence({
        game: {
            name: prefix + 'help',
            type: 'Playing'
        },
        status: 'idle'
    })
    console.log("Bot Siap . . .");
    cekperingatan();
});

var db = mysql.createConnection({
    host: HOST_,
    user: USER_,
    password: PASS_,
    database: "db_bot_toxic"
});

db.connect(function (err) {
    try {
        console.log("Terhubung ke server " + HOST_);
    } catch (error) {
        console.log(error);
    }
});

setInterval(waktu_, 1000);

function waktu_(){
    detik += 1;
}

bot.on("guildMemberAdd", function(member) {

});

bot.on("guildMemberRemove", function(member){

});

var cekpewak;

function db_query(sqlquery){
    var data = new Array();
    try {
        let sql = sqlquery;
        db.query(sql, function(err, result){
            data = result;
        })
        return data;
    } catch (error) {
        console.log(error);
    }
}

function cekperingatan() {
    let sql = "SELECT * FROM t_messages WHERE aksi != 'S' AND aksi != 'N' ORDER BY id ASC";
    db.query(sql, function(err, result){
        try {
            if (result.length > 0){
                clearTimeout(cekpewak);
                result.forEach(data_ =>{
                    ubahstat(data_.id);
                    if (data_.aksi == "H") {
                        bot.channels.get(data_.channel).fetchMessage(data_.messageid).then(msg=>{
                            msg.delete(100);
                        })
                    }
                    if (data_.aksi == "P") {
                        bot.channels.get(data_.channel).fetchMessage(data_.messageid).then(msg=>{
                            msg.delete(100);
                        })
                        bot.channels.get(data_.channel).send(data_.username + " : ~~" + data_.message + "~~\n<@" + data_.user_id + "> Anda Telah diperingatkan !!").then(msg=>{
                            msg.delete(warnMessage);
                        });
                    }
                    if (data_.aksi == "M") {
                        bot.channels.get(data_.channel).send(data_.message);
                    }
                }); 
            }
        } catch (error) {
            console.log(error);
        }
    })
    clearTimeout(cekpewak);
    ekpewak = setTimeout(cekperingatan, 2000);
}

function ubahstat(gid) {
    let sql = "UPDATE t_messages SET aksi = 'S' WHERE id = '" + gid + "'";
    db.query(sql, function(err, result){
        if (err) throw err;
        if (result.affectedRows > 0){
            //
        }
    })
}

bot.on("message", function(message){
    try {
        if (message.author.equals(bot.user)) return;

        function Morse(huruf, pilihan) {
            huruf.toLowerCase();
            var alfabet = [" ","a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "?", ".", ",", "@", "'", "\"", "(", ")", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", ":", "<", ">", "_", "-", "=", "[", "]", "!", "/", "&"];
            var kodemorse = ["/", ".-", "-...", "-.-.", "-..", ".", "..-.", "--.", "....", "..", ".---", "-.-", ".-..", "--", "-.", "---", ".--.", "--.-", ".-.", "...", "-", "..-", "...-", ".--", "-..-", "-.--", "--..", "..--..", ".-.-.-", "--..-", ".--.-", ".----.", ".-..-.", "-.--.", "-.--.-", ".----", "..---", "...--", "....-", ".....", "-....", "--...", "---..", "----.", "-----", "---...", "<", ">", "_", "-....-", "-...-", "", "", "-.-.--", "-..-.", ".-..."];
            if (pilihan == 1) {
                for (var i = 0; i < alfabet.length; i++) {
                    if (alfabet[i] == huruf) {
                        return kodemorse[i] + " ";
                    }
                }
            } else {
                for (var i = 0; i < alfabet.length; i++) {
                    if (kodemorse[i] == huruf) {
                        return alfabet[i];
                    }
                }
            }
        }
    
        function KeMorse_(kata) {
            var morse = "";
            cek = true;
            for (var i = 0; i < kata.length; i++) {
                if (kata[i] == "[") {cek = false; i++}
                if (kata[i] == "]") {cek = true;}
                if (cek == true) {
                    morse += Morse(kata[i], 1);
                } else {
                    morse += kata[i];
                }
            }
            return morse.replace(/undefined/g, "#");
        }
    
        function KeAlfabet_(kata) {
            var alfabet = "";
            var kata_ = kata.split(" ");
            for (var i = 0; i < kata_.length; i++) {
                alfabet += Morse(kata_[i], 2)
            }
            return alfabet.replace(/undefined/g, "#");;
        }
    
    
        function ambilKata(){
            words_ = "";
            let sql = "SELECT * FROM t_words WHERE guild = " + db.escape(message.guild.id) + " AND cat = 'bad' ORDER BY words ASC";
            db.query(sql, function(err, result){
                if (err) throw err;
                result.forEach(data =>{
                    words_ += data.words + " ";
                })
            })
        }
    
        function ambilPengecualian(){
            let sql = "SELECT * FROM t_words WHERE guild = " + db.escape(message.guild.id) + " AND cat = 'ignore' ORDER BY words ASC";
            db.query(sql, function(err, result_){
                if (err) throw err;
                result_.forEach(data_ =>{
                    ignoreWords += data_.words + " ";
                })
            })
        }
    
        function getbotLogId(){
            let sql = "SELECT value FROM t_botsettings WHERE guild = " + db.escape(message.guild.id) + " AND setting = 'botLog'";
            db.query(sql, function(err, result){
                if (err) throw err;
                if (result.length > 0){
                    result.forEach(data => {
                        botLogId = data.value;
                    })
                }
            })
        }
    
        function SimpanPesan(pesan, action){
            try {
                if(message.attachments.size > 0){
                    var urlgambar = message.attachments.array()[0].url;
                } else {
                    var urlgambar = "";
                }
                let sql = "INSERT INTO t_messages (messageid, user_id, username, message, action, tanggal, guild, channel, channel_name) VALUE (" + db.escape(message.id) + "," + db.escape(message.member.user.id) + "," + db.escape(message.author.tag) +  "," + db.escape(pesan + " \n" + urlgambar) + "," + db.escape(action) + ", NOW(), '" + message.guild.id + "', '" + message.channel.id + "'," + db.escape(message.channel.name) + ")";
                db.query(sql, function (err, result){
                    if (err) throw err;
                });
                if (botLogId != "" && action == "bad"){
                    bot.channels.get(botLogId).send("Pesan : **" + pesan + "**\n**" + message.author.tag + "** Melakukan **Badword** di " + message.channel);
                }
            } catch (error){
                console.log(error);
            }
        }
    
        function GetUser(){
            list = "";
            let sql = "SELECT user_id FROM t_user_protect";
            db.query(sql, function (err, result){
                if (err) throw err;
                list += "```\n";
                result.forEach(data => {
                    list += data.user_id + "\n";
                });
                list += "```";
                message.channel.send(list);
            });
    
        }
    
        function GetWordList(){
            var pesan="```", no = 0;
            let sql = "SELECT words FROM t_words WHERE guild = " + db.escape(message.guild.id) + " AND cat = 'bad' ORDER BY words ASC";
            db.query(sql, function(err, result){
                if (err) throw err;
                result.forEach(data =>{
                    pesan += data.words + " ";
                })
                pesan += "```";
                message.channel.send(pesan);
            })
        }
    
        function cekKataV2(){
            let pesanea = message.content.toLowerCase();
            ambilKata();
            ambilPengecualian();
            getbotLogId();
            let sql = "SELECT * FROM t_channel WHERE guild = " + message.guild.id + " AND channel = " + message.channel.id + " AND cat = 'ignore'";
            db.query(sql, function(err, result){
                if (err) throw err;
                if (!result.length > 0){
                    let content_ = pesanea.replace(/[,.:-_#*]/g, '');
                    let ignore__ = ignoreWords.split(" ");
                    let res = content_.toLowerCase();
                    ignore__.forEach(cek =>{
                        res = res.replace(new RegExp(cek, "g"), "");
                        console.log(res + " | " + cek);
                    })
                    var text = res.split(" ");
                    let res_ = "";
                    text.forEach(data =>{
                        var x = new Array();
                        for (var i = 0; i < data.length; i++){
                            if (data == "mmq" || data == "hmm" || data == "mmk"){
                                x[i] = data[i];
                            } else {
                                if (x[x.length-1] != data[i]){
                                    x[i] = data[i];
                                }
                            }
                        }
                        x.forEach(zz =>{
                            res_ += zz
                        })
                    })
                    ignoreWords = "";
                    let kata__ = words_.split(" ");
                    var pesan__ = " ";
                    pesan__ += res_.toLowerCase();
                    kata__.forEach(cek => {
                        if (pesan__.indexOf(cek) > 0){
                            let sql = "SELECT * FROM t_messages WHERE user_id = " + db.escape(message.member.user.id) + " and action = 'bad' and DATE(tanggal) = DATE(NOW()) and guild = " + db.escape(message.guild.id);
                            db.query(sql, function(err, hasil){
                                if (err) throw err;
                                message.delete(100);
                                if (hasil.length > 0){
                                    message.reply("Jangan menggunakan kata **~~" + cek + "~~** ya !\nAnda sudah mengetik kata-kata kasar sebanyak **" + (hasil.length + 1) + "x ** hari ini !").then(msg =>{
                                        msg.delete(warnMessage);
                                    });
                                } else {
                                    message.reply("Jangan menggunakan kata **~~" + cek + "~~** ya !").then(msg =>{
                                        msg.delete(warnMessage);
                                    });
                                }
                                SimpanPesan(message.content, "bad");
                            })
                        }
                    })
                }
            })
        }
    
        if (message.isMemberMentioned(bot.user)){
            //message.channel.send("Apaan ?\ncoba ketik " + prefix + "help");
        }
    
        if (message.content.toLowerCase().startsWith(prefix)){
            let MemberAkses = message.member.permissions;
            let pesanea = message.content.substring(prefix.length, message.content.length).toLowerCase();
            command = pesanea.split(" ");
    
            if (command[0] == "morse"){
                var dm = false;
                message.delete(100);
                if (command[1] != null){
                    var kata2 = pesanea.substring((prefix.length + command[0].length + command[1].length + 1), pesanea.length);
                    if (command[1] == "-f") {
                        pesan = "Morse\n**" + kata2 + "**\nPesan\n**" + KeAlfabet_(kata2) + "**";
                    } else if (command[1] == "-fdm") {
                        pesan = "Morse\n**" + kata2 + "**\nPesan\n**" + KeAlfabet_(kata2) + "**";
                        dm = true;
                    } else if (command[1] == "-fq") {
                        pesan = "**" + message.author.tag + "** : " + KeAlfabet_(kata2);
                    } else if (command[1] == "-fqq") {
                        pesan = KeAlfabet_(kata2);
                    } else if (command[1] == "-q"){
                        pesan = "**" + message.author.tag + "** : " + KeMorse_(kata2);
                    } else if (command[1] == "-qq") {
                        pesan = KeMorse_(kata2);
                    } else {
                        var kata2 = pesanea.substring((prefix.length + command[0].length), pesanea.length);
                        pesan = "Morse Dari **" + message.author.tag + "**\nPesan : \n||" + kata2 + "||\nMorse : \n**" + KeMorse_(kata2) + "**";
                    }
                    if (dm == false) {
                        message.channel.send(pesan);
                    } else {
                        message.author.send(pesan);
                    }
                }
            }
    
            if (command[0] == "mute"){
                message.delete(userMessage);
                if (MemberAkses.has("ADMINISTRATOR") || message.member.user.id == OWNERID){
                    if (command[1] != null){
                        if (command[1].indexOf("@") > 0){
                            var user_id = command[1].replace(/[<!@#>]/g, '');
                            let sql = "SELECT * FROM t_user WHERE guild = " + db.escape(message.guild.id) + " AND user_id =  " + db.escape(user_id) + " AND status = 'mute'";
                            db.query(sql, function(err, result){
                                if (err) throw err;
                                if (!result.length > 0){
                                    let sql = "INSERT INTO t_user (user_id, guild, status) VALUES (" + db.escape(user_id) + ", " + db.escape(message.guild.id) + ", 'mute')";
                                    db.query(sql, function(err, result){
                                        if (err) throw err;
                                        if (result.affectedRows > 0){
                                            message.channel.send("Berhasil Mute user : " + command[1]).then(msg =>{
                                                msg.delete(botMessage);
                                            });
                                        }
                                    })
                                } else {
                                    message.channel.send("User : " + command[1] + " Sudah dimute").then(msg =>{
                                        msg.delete(botMessage);
                                    });
                                }
                            })
                        }
                    }
                }
            }

            if (command[0] == "mutev2"){
                message.delete(userMessage);
                if (MemberAkses.has("ADMINISTRATOR") || message.member.user.id == OWNERID){
                    if (command[1] != null){
                        if (command[1].indexOf("@") > 0){
                            var user_id = command[1].replace(/[<!@#>]/g, '');
                            let sql = "SELECT * FROM t_user WHERE guild = " + db.escape(message.guild.id) + " AND user_id =  " + db.escape(user_id) + " AND status = 'mute'";
                            RESULTDATA = db_query(sql);
                            RESULTDATA.forEach(data =>{
                                message.channel.send(data);
                            })
                            if (!RESULTDATA.length > 0){
                                let sql = "INSERT INTO t_user (user_id, guild, status) VALUES (" + db.escape(user_id) + ", " + db.escape(message.guild.id) + ", 'mute')";
                                RESULTDATA = db_query(sql);
                                if (RESULTDATA.affectedRows > 0){
                                    message.channel.send("Berhasil Mute user : " + command[1]).then(msg => {
                                        msg.delete(botMessage);
                                    });
                                }
                            } else {
                                message.channel.send("User : " + command[1] + " Sudah dimute").then(msg =>{
                                    msg.delete(botMessage);
                                });
                            }
                        }
                    }
                }
            }
    
            if (command[0] == "unmute"){
                message.delete(userMessage);
                if (MemberAkses.has("ADMINISTRATOR") || message.member.user.id == OWNERID){
                    if (command[1].indexOf("@") > 0){
                        var user_id = command[1].replace(/[<!@#>]/g, '');
                        let sql = "SELECT * FROM t_user WHERE guild = " + db.escape(message.guild.id) + " AND user_id =  " + db.escape(user_id) + " AND status = 'mute'";
                        db.query(sql, function(err, result){
                            if (err) throw err;
                            if (result.length > 0){
                                let sql = "DELETE FROM t_user WHERE user_id = " + db.escape(user_id) + " AND guild = " + db.escape(message.guild.id) + " AND status = 'mute'";
                                db.query(sql, function(err, result){
                                    if (err) throw err;
                                    if (result.affectedRows > 0){
                                        message.channel.send("Berhasil Unmute user : " + command[1]).then(msg =>{
                                            msg.delete(botMessage);
                                        });
                                    }
                                })
                            } else {
                                message.channel.send("User : " + command[1] + " sedang tidak dimute").then(msg =>{
                                    msg.delete(botMessage);
                                });
                            }
                        })
                    }
                }
            }
    
            if (command[0] == "say" || command[0] == "s"){
                message.channel.send(message.content.substring((prefix.length + command[0].length), message.content.length));
                SimpanPesan(message.content.substring((prefix.length + command[0].length), message.content.length), "say");
            }
    
            if (command[0] == "sayd" || command[0] == "sd"){
                message.delete(100);
                message.channel.send(message.content.substring((prefix.length + command[0].length), message.content.length));
                SimpanPesan(message.content.substring((prefix.length + command[0].length + 1), message.content.length), "sayd");
            }
    
            if (command[0] == "user-list"){
                GetUser();
                message.delete(userMessage);
                SimpanPesan(message.content.substring((prefix.length + command[0].length), message.content.length), "user-list");
            }
    
            if (command[0] == "word"){
                var word = db.escape(command[1]);
                let sql = "SELECT * FROM t_words WHERE words LIKE '" + word.substring(1, word.length - 1) + "%' AND guild = " + db.escape(message.guild.id) + " AND cat = 'bad'";
                db.query(sql, function(err, result){
                    if (err) throw sql;
                    if (result.length > 0){
                        result.forEach(data => {
                            message.channel.send("Kata **" + data.words + "** ditemukan !").then(msg =>{
                                msg.delete(botMessage);
                            });
                        })
                    } else {
                        message.channel.send("Kata **" + command[1] + "** tidak ditemukan didatabase !").then(msg =>{
                            msg.delete(botMessage);
                        });
                    }
                    message.delete(userMessage);
                })
                SimpanPesan(message.content.substring((prefix.length + command[0].length), message.content.length), "word");
            }
    
            if (command[0] == "words"){
                let sql = "SELECT words FROM t_words WHERE guild = " + db.escape(message.guild.id) + " AND cat = 'bad'";
                db.query(sql, function(err, result){
                    if (err) throw err;
                    message.channel.send("Terdapat **" + result.length + "** kata kasar didatabase").then(msg =>{
                        msg.delete(botMessage);
                    });
                    message.delete(userMessage);
                })
                SimpanPesan(message.content.substring((prefix.length + command[0].length), message.content.length), "words");
            }
    
            if (command[0] == "word-list"){
                GetWordList();
                message.delete(3000);
                SimpanPesan(message.content.substring((prefix.length + command[0].length), message.content.length), "word-list");
            }

            if (command[0] == "disable"){
                message.delete(100);
                if (MemberAkses.has("ADMINISTRATOR") || message.author.id == OWNERID){
                    if (command[1] == "channel"){
                        if (command[2] != null){
                            let chann = db.escape(command[2]).replace(/[<#>]/g, '');
                            let sql = "SELECT * FROM t_channel WHERE guild = "  + db.escape(message.guild.id) + " AND channel = " + chann + " AND cat = 'disable'";
                            db.query(sql, function(err, result){
                                if (err) throw err;
                                if (!result.length > 0){
                                    let chann = db.escape(command[2]).replace(/[<#>]/g, '');
                                    let sql = "INSERT INTO t_channel (guild, channel, cat) VALUES ('" + message.guild.id + "'," + chann + ",'disable')";
                                    db.query(sql, function(err, result){
                                        if (err) throw err;
                                        if (result.affectedRows > 0){
                                            message.channel.send("Channel " + command[2] + " berhasil dikunci !").then(msg =>{
                                                msg.delete(botMessage);
                                            });
                                        }
                                    })
                                } else {
                                    message.channel.send("Channel " + command[2] + " sudah dikunci !");
                                }
                            })
                        }
                    }
                }
            }

            if (command[0] == "enable"){
                if (MemberAkses.has("ADMINISTRATOR") || message.author.id == OWNERID) {
                    if (command[1] == "channel"){
                        if (command[2] != null){
                            let chann = db.escape(command[2]).replace(/[<#>]/g, '');
                            let sql = "SELECT * FROM t_channel WHERE guild = "  + db.escape(message.guild.id) + " AND channel = " + chann + " AND cat = 'disable'";
                            db.query(sql, function(err, result){
                                if (err) throw err;
                                if (result.length > 0){
                                    let chann = db.escape(command[2]).replace(/[<#>]/g, '');
                                    let sql = "DELETE FROM t_channel WHERE guild = " + db.escape(message.guild.id) + " AND channel = " + chann + " AND cat = 'disable'";
                                    db.query(sql, function(err, result){
                                        if (err) throw err;
                                        if (result.affectedRows > 0){
                                            message.channel.send("Channel " + command[2] + " berhasil dibuka !").then(msg =>{
                                                msg.delete(botMessage);
                                            });
                                        }
                                    })
                                } else {
                                    message.channel.send("Channel " + command[2] + " tidak dikunci !");
                                }
                            })
                        }
                    }
                }
            }
    
            if (command[0] == "add"){
                if (MemberAkses.has("ADMINISTRATOR") || message.member.user.id == OWNERID){
                    if (command[1] == "word"){
                        message.delete(userMessage);
                        if (command[2] != null){
                            var wordlist = command[2].split(',');
                            wordlist.forEach(word =>{
                                if (command[2].indexOf(":") < 0){
                                    if (word.length >= 3){
                                        let sql = "SELECT * FROM t_words WHERE words = " + db.escape(word) + " AND guild = " + db.escape(message.guild.id) + " AND cat = 'bad'";
                                        db.query(sql, function(err, result){
                                            if (err) throw err;
                                            if (result.length > 0){
                                                message.channel.send(":negative_squared_cross_mark: Kata **" + word + "** sudah ada !").then(msg =>{
                                                    msg.delete(botMessage);
                                                });
                                            } else {
                                                let sql = "INSERT INTO t_words (words, guild, cat) VALUES (" + db.escape(word) + "," + db.escape(message.guild.id) + " , 'bad')";
                                                db.query(sql, function(err, result){
                                                    if (err) throw err;
                                                    message.channel.send(":white_check_mark: Kata **" + word + "** berhasil ditambahkan !").then(msg =>{
                                                        msg.delete(botMessage);
                                                    });
                                                })
                                            }
                                        })
                                    }
                                }
                            })
                            ambilKata();
                        } else {
                            message.channel.send("Masukan Katanya budjank . . . !").then(msg =>{
                                msg.delete(botMessage);
                            });
                        }
                        SimpanPesan(message.member.user.id, message.member.user.username, message.content.substring((prefix.length + command[0].length), message.content.length), "add word");
                    }
    
                    if (command[1] == "ignore"){
                        if (command[2] == "channel"){
                            if (command[3] != null){
                                let res = command[3].replace(/[<@!#>]/g, '');
                                let sql = "INSERT INTO t_channel (guild, channel, cat) VALUES (" + message.guild.id + ", " + res + ", 'ignore') "
                                db.query(sql, function(err){
                                    if (err) throw err;
                                    message.delete(userMessage);
                                    message.channel.send("Pengecualian Channel : " + command[3] + " berhasil ditambahkan").then(msg => {
                                        msg.delete(botMessage);
                                    });
                                })
                            }
                            SimpanPesan(message.content.substring((prefix.length + command[0].length), message.content.length), "add ignore channel");
                        }
                        if (command[2] == "word"){
                            if (command[3] != null){
                                var kata2 = command[3].split(',');
                                kata2.forEach(kata1 =>{ 
                                    let res = kata1.replace(/[<@!#>]/g, '');
                                    let sql = "INSERT INTO t_words (guild, words, cat) VALUES (" + message.guild.id + ", " + db.escape(res) + ", 'ignore')"
                                    console.log(sql);
                                    db.query(sql, function(err){
                                        if (err) throw err;
                                        message.delete(userMessage);
                                        message.channel.send("Pengecualian Kata **" + res + "** berhasil ditambahkan").then(msg => {
                                            msg.delete(botMessage);
                                        });
                                    })
                                })
                            }
                            SimpanPesan(message.content.substring((prefix.length + command[0].length), message.content.length), "add ignore word");
                        }
                    }
    
                    if (command[1] == "monitor"){
                        if (message.member.user.id == "257147179297144833"){
                            message.delete(userMessage);
                            let userid = command[2].replace(/[<@!>]/g, '');
                            let sql = "SELECT * FROM t_user WHERE guild = " + db.escape(message.guild.id) + " AND user_id = '" + userid + "' AND status = 'monitor'";
                            db.query(sql, function(err, result){
                                if (err) throw err;
                                if (!result.length > 0){
                                    let sql = "INSERT INTO t_user (user_id, guild, status) VALUES ('" + userid + "', " + db.escape(message.guild.id) + ", 'monitor')";
                                    db.query(sql, function(err, result){
                                        if (err) throw err;
                                        if (result.affectedRows > 0){
                                            message.channel.send("Mulai Memonitoring user : **" + userid + "**").then(msg =>{
                                                msg.delete(botMessage);
                                            });
                                        }
                                    })
                                } else {
                                    message.channel.send("Sudah Memonitoring user : **" + userid + "**").then(msg =>{
                                        msg.delete(botMessage);
                                    });
                                }
                            })
                        }
                    }
                }
            }
    
            if (command[0] == "del"){
                if (MemberAkses.has("ADMINISTRATOR") || message.member.user.id == OWNERID || message.author.id == 257147179297144833){
                    if (command[1] == "word"){
                        if (command[2] != null){
                            var word = db.escape(command[2]);
                            let sql = "DELETE FROM t_words WHERE words = " + word + " AND guild = " + db.escape(message.guild.id) + " AND cat = 'bad'";
                            db.query(sql, function(err, result){
                                if (result.affectedRows > 0){
                                    if (err) throw err;
                                    message.channel.send("Kata **" + command[2] + "** berhasil dihapus !").then(msg =>{
                                        msg.delete(botMessage);
                                    });
                                    ambilKata();
                                } else {
                                    message.channel.send("Kata **" + command[2] + "** tidak ditemukan !").then(msg =>{
                                        msg.delete(botMessage);
                                    })
                                }
                                message.delete(userMessage);
                            })
                        }
                        SimpanPesan(message.content.substring((prefix.length + command[0].length), message.content.length), "del word");
                    }
    
                    if (command[1] == "ignore"){
                        if (command[2] == "channel"){
                            let res = command[3].replace(/[<@!#>]/g, '');
                            let sql = "DELETE FROM t_channel WHERE guild = " + message.guild.id + " and channel = " + db.escape(res) + " and cat = 'ignore'";
                            db.query(sql, function(err, result){
                                if (err) throw err;
                                message.delete(3000);
                                if (result.affectedRows > 0){
                                    message.channel.send("Pengecualian Channel : " + command[3] + " berhasil dihapus").then(msg => {
                                        msg.delete(botMessage);
                                    });
                                } else {
                                    message.channel.send("Pengecualian Channel : " + command[3] + " tidak ditemukan").then(msg => {
                                        msg.delete(botMessage);
                                    });
                                }
                            })
                            SimpanPesan(message.content.substring((prefix.length + command[0].length), message.content.length), "del ignore channel");
                        }
                        
                        if (command[2] == "word"){
                            if (command[3] != null){
                                var word = db.escape(command[3]);
                                let sql = "DELETE FROM t_words WHERE words = " + word + " AND guild = " + db.escape(message.guild.id) + " AND cat = 'ignore'";
                                db.query(sql, function(err, result){
                                    if (result.affectedRows > 0){
                                        if (err) throw err;
                                        message.channel.send("Kata **" + command[3] + "** berhasil dihapus !").then(msg =>{
                                            msg.delete(botMessage);
                                        });
                                        ambilKata();
                                    } else {
                                        message.channel.send("Kata **" + command[3] + "** tidak ditemukan !").then(msg =>{
                                            msg.delete(botMessage);
                                        })
                                    }
                                    message.delete(userMessage);
                                })
                            }
                        }
                    }
    
                    if (command[1] == "monitor"){
                        if (message.member.user.id == OWNERID){
                            message.delete(userMessage);
                            let userid = command[2].replace(/[<@!>]/g, '');
                            let sql = "SELECT * FROM t_user WHERE guild = " + db.escape(message.guild.id) + " AND user_id = '" + userid + "' AND status = 'monitor'";
                            db.query(sql, function(err, result){
                                if (err) throw err;
                                if (result.length > 0){
                                    let sql = "DELETE FROM t_user WHERE user_id = '" + userid + "' AND guild = " + db.escape(message.guild.id) + " AND status = 'monitor'";
                                    db.query(sql, function(err, result){
                                        if (err) throw err;
                                        if (result.affectedRows > 0){
                                            message.channel.send("Berhenti Memonitoring user : **" + userid + "**").then(msg =>{
                                                msg.delete(botMessage);
                                            });
                                        }
                                    })
                                } else {
                                    message.channel.send("User : **" + userid + "** sedang tidak dimonitor").then(msg =>{
                                        msg.delete(botMessage);
                                    });
                                }
                            })
                        }
                    }
                }
            }

            if (command[0] == "warn"){
                message.delete(100);
                if (MemberAkses.has("ADMINISTRATOR") || message.author.id == OWNERID){
                    if (command[1] != null){
                        message.delete(100);
                        message.channel.fetchMessage(command[1]).then(msg => {
                            message.channel.send("Pesan Dari : " + msg.author.tag + "\n`" + msg.content + "`\nAnda telah diperingati ! <@" + msg.author.id + ">").then(pesan =>{
                                pesan.delete(warnMessage);
                            });
                            msg.delete(100);
                        })
                    } else {
                        message.channel.send("Masukan ID pesan !").then(msg=>{
                            msg.delete(botMessage);
                        });
                    }
                }
            }
    
            if (command[0] == "set"){
                if (command[1] == "botlog"){
                    if (command[2] != null){
                        let sql = "SELECT value FROM t_botsettings WHERE guild = " + db.escape(message.guild.id) + " AND setting = 'botlog'";
                        db.query(sql, function(err, result){
                            if (err) throw err;
                            if (!result.length > 0){
                                let sql = "INSERT INTO t_botsettings (guild, setting, value) VALUES (" + db.escape(message.guild.id) + ",'botlog'," + db.escape(command[2].replace(/[<@#!>]/g, '')) + ")";
                                db.query(sql, function(err, result){
                                    if (err) throw err;
                                    if (result.affectedRows > 0){
                                        message.delete(userMessage);
                                        message.channel.send("Berhasil mengatur botlog channel di " + command[2]).then(msg =>{
                                            msg.delete(botMessage);
                                        });
                                    }
                                })
                            } else {
                                let sql = "UPDATE t_botsettings SET value = " + db.escape(command[2].replace(/[<!@#>]/g, '')) + " WHERE guild = " + db.escape(message.guild.id) + " AND setting = 'botLog'";
                                db.query(sql, function(err, result){
                                    if (err) throw sql;
                                    if (result.affectedRows > 0){
                                        message.delete(userMessage);
                                        message.channel.send("Berhasil mengatur botlog channel di " + command[2]).then(msg =>{
                                            msg.delete(botMessage);
                                        });
                                    }
                                })
                            }
                        })
                    }
                }
            }
    
            if (command[0] == "uptime"){
                var seconds = parseInt(detik, 10);
                var days = Math.floor(seconds / (3600*24));
                seconds  -= days*3600*24;
                var hrs   = Math.floor(seconds / 3600);
                seconds  -= hrs*3600;
                var mnts = Math.floor(seconds / 60);
                seconds  -= mnts*60;
                var n = days+" Hari, "+hrs+" Jam, "+mnts+" Menit, "+seconds+" Detik";
                message.delete(userMessage);
                message.channel.send("Bot telah berjalan selama : **" + n + "**").then(msg =>{
                    msg.delete(botMessage);
                });
            }
    
            if (command[0] == "help"){
                var no = 0;
                pesan = "```CSS\n";
                pesan += "Bot Command :```\n";
                let sql = "SELECT * FROM t_bothelp ORDER BY command ASC";
                db.query(sql, function(err, result){
                    if (err) throw err;
                    result.forEach(data =>{
                        no++;
                        pesan += "\t**" + no + ". " + prefix + data.command + "** : ``" + data.description + "``\n";
                    })
                    pesan += "\n```CSS\nBot KNTL V2";
                    pesan += "```";
                    message.channel.send(pesan);
                })
            }
    
            function ambilavatar(username){
                let member_ = message.guild.fetchMember(username);
                message.channel.send({embed: {
                    color: colorEmbed,
                    author: {
                        name: member_.tag
                    },
                    title: "Avatar Url",
                    url: member_.avatarURL,
                    image: {
                        url: member_.avatarURL
                    }
                }})
            }
    
            if (command[0] == "avatar"){
                message.delete(userMessage);
                if (command[1] == null){
                    ambilavatar(message.author);
                } else {
                    ambilavatar(command[2]);
                }
            }

            if (command[0] == "kick"){
                message.delete(100);
                if (MemberAkses.has("ADMINISTRATOR") || message.member.user.id == OWNERID || message.author.id == 257147179297144833){
                    if (command[1] != null){
                        message.guild.member(command[1].replace(/[,.<@!>]/g, '')).kick();
                    }
                }
            }
    
            if (command[0] == "test"){
                if (message.member.user.id == "257147179297144833"){
                    if (command[1] == "replace"){
                        let test = command[2];
                        let res = test.replace(/[,.<@!>]/g, '');
                        message.channel.send(command[2] + " > " + res);
                    }
                    if (command[1] == "duplicate") {
                        var text = message.content.toLowerCase().substring(prefix.length + command[0].length + command[1].length + 2).split(" ");
                        var res = "";
                        var word__ = "";
                        text.forEach(data =>{
                            word__ += data + " ";
                            var x = new Array();
                            for (var i = 0; i < data.length; i++){
                                if (x[x.length-1] != data[i]){
                                    x[i] = data[i];
                                }
                            }
                            x.forEach(zz =>{
                                res += zz
                            })
                            res += " ";
                        })
                        message.channel.send(word__ + " => " + res);
                    }
                    if (command[1] == "avatar"){
                        message.channel.send({embed: {
                            color: colorEmbed,
                            author: {
                                name: message.author.tag
                            },
                            title: "Avatar Url",
                            url: message.author.avatarURL,
                            image: {
                                url: message.author.avatarURL
                            }
                        }})
                    }
    
                    if (command[1] == "hapus") {
                        message.delete(100);
                        message.channel.fetchMessage(command[2]).then(msg => {
                            message.author.send("Message From " + msg.author.tag + "\n" + msg.content);
                            msg.delete(100);
                        })
                    }
    
                    if (command[1] == "pesan") {
                      var chan = bot.channels.find('id', command[2].replace(/[,.<@!>:#]/g, ''));
                      chan.send(message.content.substring(prefix.length + command[1].length + command[2].length + 6));
                      message.delete(100);
                    }
    
                    if (command[1] == "pesanke") {
                      var gui = bot.guild.find('id', command[2]);
                      var chan = bot.channels.find('id', command[3]);
                      gui.chan.send("hai ini test");
                    }
    
                    if (command[1] == "random"){
                        var random = Math.floor(Math.random() * 100);
                        message.channel.send(random).then(msg =>{
                            msg.delete(botMessage);
                        });
                    }
    
                    if (command[1] == "koin"){
                        message.delete(userMessage);
                        var chance = Math.floor(Math.random()* 2);
                        if(chance == 0)
                        {
                            message.channel.send(message.author.tag + ", Mendapatkan Kepala " + chance);
                        }else
                        {
                            message.channel.send(message.author.tag + ", Mendapatkan Ekor " + chance);
                        }
                    }
    
                    if (command[1] == "morse") {
                        message.delete(1);
                        var kata2 = pesanea.substring((prefix.length + command[0].length + command[1].length + 1), pesanea.length);
                        var morse = "";
                        for (var i = 0; i < kata2.length; i++) {
                          morse += KeMorse(kata2[i])
                        }
                        message.channel.send(morse);
                    }
    
                    if (command[1] == "gambar") {
                      console.log(message.attachments.size);
                      if(message.attachments.size > 0){
                        console.log(message.attachments.array()[0].url);
                        message.channel.send(message.attachments.array()[0].url);
                      } else {
                        console.log("tidak ada gambar");
                      }
                    }
    
                } else {
                    message.delete(userMessage);
                    message.reply("cuma Develover ea :v").then(msg =>{
                        msg.delete(botMessage);
                    });
                }
            }
    
            if (command[0] == "get"){
                if (message.member.user.id == "257147179297144833"){
                    message.delete(3000);
                    if (command[1] == "guild"){
                        if (command[2] == "id"){
                            message.channel.send("Server ID : " + message.guild.id).then(msg =>{
                                msg.delete(botMessage);
                            });
                        }
                        if (command[2] == "name"){
                            message.channel.send("Guild Name : " + message.guild.name).then(msg =>{
                                msg.delete(botMessage);
                            });
                        }
                    }
                    if (command[1] == "channel"){
                        if (command[2] == "id"){
                            message.channel.send("Channel ID : " + message.channel.id).then(msg =>{
                                msg.delete(botMessage);
                            });
                        }
                        if (command[2] == "name"){
                            message.channel.send("Channel Name : " + message.channel.name).then(msg =>{
                                msg.delete(botMessage);
                            });
                        }
                    }
                    if (command[1] == "words"){
                        ambilKata();
                        message.channel.send(words_);
                    }
                }
            }
    
            if (command[0] == "koin"){
                message.delete(userMessage);
                var chance = Math.floor(Math.random()* 2);
                if(chance == 0)
                {
                    message.channel.send(message.author.tag + ", Mendapatkan Kepala");
                }else
                {
                    message.channel.send(message.author.tag + ", Mendapatkan Ekor");
                }
            }
    
        } else {
            if (message.guild) {
                let sql = "SELECT * FROM t_channel WHERE guild = " + db.escape(message.guild.id) + " AND channel = " + db.escape(message.channel.id) + "AND cat = 'disable'";
                db.query(sql, function(err, result){
                    if (err) throw err;
                    if (result.length > 0){
                        message.delete(100);
                    } else {
                        let sql = "SELECT * FROM t_user WHERE guild = " + db.escape(message.guild.id) + " AND user_id =  " + db.escape(message.author.id) + " AND status = 'mute'";
                        db.query(sql, function(err, result){
                            if (err) throw err;
                            if (!result.length > 0){
                                command = message.content.toLowerCase().split(" ");
                                if (command.length > 0){
                                    let sql = "SELECT respond FROM t_botrespon WHERE command = " + db.escape(message.content.toLocaleLowerCase());
                                    db.query(sql, function(err, result){
                                        if (err) throw err;
                                        if (result.length > 0){
                                            result.forEach(data => {
                                                var respon = data.respond;
                                                message.channel.send(respon.replace("%USER%", message.author));
                                            })
                                        }
                                    })
                                }
                                try {
                                    let sql = "SELECT * FROM t_user WHERE guild = " + db.escape(message.guild.id) + " AND user_id = " + db.escape(message.member.user.id) + " AND status = 'monitor'";
                                    db.query(sql, function(err, result){
                                        if (err) throw err;
                                        if (result.length > 0){
                                            SimpanPesan(message.content, "Monitoring");
                                        }
                                    })
                                } catch (error) {
                                    console.log(error);
                                }
                                cekKataV2();
                            } else {
                                SimpanPesan(message.content, "muted");
                                message.delete(100);
                                message.author.send("Anda sedang dimute diserver : " + message.guild.name);
                            }
                        })
                    }
                })
            }
        }
    } catch (error) {
        console.log(error);
    }
});

bot.login(TOKEN);
