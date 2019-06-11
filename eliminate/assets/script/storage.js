/**
 * Created by guang on 18/7/19.
 */
module.exports = {
    pice:['k','m','b','t','a','aa','ab','ac','ad','ae','af','ag','ah','ai','aj','ak','al','am','an','ao','ap','aq','ar','as','at'],
    audioContext: null,
    effectContext: null,
    pfix: "eliminate_",
    playSoundTime:0,
    playMusic: function(music)
    {
        if(this.getMusic() == 1)
        {
            this.stopMusic();

            cc.loader.loadRes(music, function (err, clip)
            {
                if(!err)
                {
                    cc.audioEngine.play(clip, true, 0.3);
                }
                else
                {
                    console.log(err);
                }
            });
        }
    },

    pauseMusic: function()
    {
        if(this.getMusic() == 1)
            cc.audioEngine.pauseAll();
    },

    resumeMusic: function()
    {
        if(this.getMusic() == 1)
            cc.audioEngine.resumeAll();
    },

    stopMusic: function()
    {
        cc.audioEngine.stopAll();
    },

    playSound: function(sound,isNow)
    {
        if(this.getSound() == 1)
        {
            var now = new Date().getTime();
            if(isNow) this.playSoundTime = 0;
            if(now-this.playSoundTime>50)
            {
                this.playSoundTime = now;
                cc.loader.loadRes(sound, function (err, clip)
                {
                    if(!err)
                    {
                        cc.audioEngine.play(clip, false, 1);
                    }
                    else
                    {
                        //console.log(err);
                    }
                });
            }
        }
    },

    setFirst: function(first)
    {
        cc.sys.localStorage.setItem(this.pfix+"first",first);
    },

    getFirst: function()
    {
        var first = cc.sys.localStorage.getItem(this.pfix+"first");
        first = first ? first : 0;
        return Number(first);
    },

    setCoin: function(coin)
    {
        cc.sys.localStorage.setItem(this.pfix+"coin",Math.floor(coin));
    },

    getCoin: function()
    {
        var coin = cc.sys.localStorage.getItem(this.pfix+"coin");
        coin = coin ? coin : 0;
        return Number(coin);
    },

    uploadCoin: function()
    {
        var datas = {};
        datas.coin = this.getCoin();
        var data = JSON.stringify(datas);
        cc.qianqista.uploaddatas(data);
    },

    setStep: function(step)
    {
        cc.sys.localStorage.setItem(this.pfix+"step",Math.floor(step));
    },

    getStep: function()
    {
        var step = cc.sys.localStorage.getItem(this.pfix+"step");
        step = step ? step : 3;
        return Number(step);
    },

    uploadStep: function()
    {
        var datas = {};
        datas.step = this.getStep();
        var data = JSON.stringify(datas);
        cc.qianqista.uploaddatas(data);
    },

    uploadCoinAndStep: function()
    {
        var datas = {};
        datas.coin = this.getCoin();
        datas.step = this.getStep();
        var data = JSON.stringify(datas);
        cc.qianqista.uploaddatas(data);
    },

    setChoujiangNum: function(num)
    {
        cc.sys.localStorage.setItem(this.pfix+"choujiang_num",num);
    },

    getChoujiangNum: function()
    {
        var num = cc.sys.localStorage.getItem(this.pfix+"choujiang_num");
        num = num ? num : 0;
        return Number(num);
    },

    setChoujiangTime: function(time)
    {
        cc.sys.localStorage.setItem(this.pfix+"choujiang_time",time);
    },

    getChoujiangTime: function()
    {
        var time = cc.sys.localStorage.getItem(this.pfix+"choujiang_time");
        time = time ? time : 0;
        return Number(time);
    },

    setLevel: function(lv)
    {
        cc.sys.localStorage.setItem(this.pfix+"level",lv);
    },

    getLevel: function()
    {
        var lv = cc.sys.localStorage.getItem(this.pfix+"level");
        lv = lv ? lv : 1;
        return Number(lv);
    },

    uploadLevel: function()
    {
        var datas = {};
        datas.level = this.getLevel();
        var data = JSON.stringify(datas);
        cc.qianqista.uploaddatas(data);
    },

    setLoginTime: function(time)
    {
        cc.sys.localStorage.setItem(this.pfix+"login_time",time);
    },

    getLoginTime: function()
    {
        var time = cc.sys.localStorage.getItem(this.pfix+"login_time");
        time = time ? time : 0;
        return Number(time);
    },

    setLoginDay: function(day)
    {
        cc.sys.localStorage.setItem(this.pfix+"login_day",day);
    },

    getLoginDay: function()
    {
        var day = cc.sys.localStorage.getItem(this.pfix+"login_day");
        day = day ? day : 0;
        return Number(day);
    },

    setLiXianTime: function(time)
    {
        cc.sys.localStorage.setItem(this.pfix+"lixian_time",time);
    },

    getLiXianTime: function()
    {
        var time = cc.sys.localStorage.getItem(this.pfix+"lixian_time");
        time = time ? time : 0;
        return Number(time);
    },

    uploadLiXianTime: function()
    {
        var datas = {};
        datas.lixian_time = this.getLiXianTime();
        var data = JSON.stringify(datas);
        cc.qianqista.uploaddatas(data);
    },


    setX2Time: function(time)
    {
        cc.sys.localStorage.setItem(this.pfix+"x2_time",time);
    },

    getX2Time: function()
    {
        var time = cc.sys.localStorage.getItem(this.pfix+"x2_time");
        time = time ? time : 0;
        return Number(time);
    },

    setX2Num: function(num)
    {
        cc.sys.localStorage.setItem(this.pfix+"x2_num",num);
    },

    getX2Num: function()
    {
        var num = cc.sys.localStorage.getItem(this.pfix+"x2_num");
        num = num ? num : 0;
        return Number(num);
    },

    setX2NumLong: function(num)
    {
        cc.sys.localStorage.setItem(this.pfix+"x2_num_long",num);
    },

    getX2NumLong: function()
    {
        var num = cc.sys.localStorage.getItem(this.pfix+"x2_num_long");
        num = num ? num : 0;
        return Number(num);
    },


    setGameNum: function(num)
    {
        cc.sys.localStorage.setItem(this.pfix+"game_num",num);
    },

    getGameNum: function()
    {
        var num = cc.sys.localStorage.getItem(this.pfix+"game_num");
        num = num ? num : 0;
        return Number(num);
    },

    setVedioNum: function(num)
    {
        cc.sys.localStorage.setItem(this.pfix+"vedio_num",num);
    },

    getVedioNum: function()
    {
        var num = cc.sys.localStorage.getItem(this.pfix+"vedio_num");
        num = num ? num : 0;
        return Number(num);
    },

    setShareNum: function(num)
    {
        cc.sys.localStorage.setItem(this.pfix+"share_num",num);
    },

    getShareNum: function()
    {
        var num = cc.sys.localStorage.getItem(this.pfix+"share_num");
        num = num ? num : 0;
        return Number(num);
    },



    setMusic: function(music)
    {
        cc.sys.localStorage.setItem(this.pfix+"music",music);
    },
    getMusic: function()
    {
        var music = cc.sys.localStorage.getItem(this.pfix+"music");
        music = music ? music : 0;
        return Number(music);
    },

    setSound: function(sound)
    {
        cc.sys.localStorage.setItem(this.pfix+"sound",sound);
    },
    getSound: function()
    {
        var sound = cc.sys.localStorage.getItem(this.pfix+"sound");
        sound = sound ? sound : 0;
        return Number(sound);
    },

    setVibrate: function(vibrate)
    {
        cc.sys.localStorage.setItem(this.pfix+"vibrate",vibrate);
    },
    getVibrate: function()
    {
        var vibrate = cc.sys.localStorage.getItem(this.pfix+"vibrate");
        vibrate = vibrate ? vibrate : 0;
        return Number(vibrate);
    },

    setYinDao: function(yindao)
    {
        cc.sys.localStorage.setItem(this.pfix+"yindao",yindao);
    },
    getYinDao: function()
    {
        var yindao = cc.sys.localStorage.getItem(this.pfix+"yindao");
        yindao = yindao ? yindao : 0;
        return Number(yindao);
    },

    setInviteLnum: function(num)
    {
        cc.sys.localStorage.setItem(this.pfix+"ginvite_lnum",num);
    },
    getInviteLnum: function()
    {
        var num = cc.sys.localStorage.getItem(this.pfix+"ginvite_lnum");
        num = num ? num : 0;
        return Number(num);
    },
    uploadInviteLnum: function()
    {
        var datas = {};
        datas.invite_lnum = this.getInviteLnum();
        var data = JSON.stringify(datas);
        cc.qianqista.uploaddatas(data);
    },


    scientificToNumber: function(num) {
        var str = num.toString();
        /*6e7或6e+7 都会自动转换数值*/
        var index = str.indexOf("e+");
        if (index == -1) {
            return str;
        } else {
            /*6e-7 需要手动转换*/
            var head = str.substr(0,index);
            var zero = '';
            var len = parseInt(str.substr(index+2,str.length));
            if(head.indexOf(".")>=0)
            {
                var h = head.split(".");
                head = h[0]+h[1];
                len = len - h[1].length;
            }
            for(var i=0;i<len;i++)
            {
                zero += '0';
            }
            return head + zero;
        }
    },


    castNum: function(coin)
    {
        coin = Math.floor(coin);
        var str = this.scientificToNumber(coin);
        var s = '';
        var n = 0;
        if(str.length>3)
            n = parseInt((str.length-1)/3);
        if(n>0)
        {
            coin = parseFloat(coin/Math.pow(1000,n)).toFixed(1);
        }
        str = coin+"";
        var l = str.split(".")[0].split("").reverse();
        for (var i = 0; i < l.length; i++) {
            s += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
        }
        s = s.split("").reverse().join("");
        if(n>0)
        {
            var r = str.split(".")[1];
            s = s + "." + r;
            s += this.pice[n-1];
        }
        return s;
    },

    getLabelStr: function(str,num)
    {
        var s = "";
        var len = 0;
        for (var i=0; i<str.length; i++) {
            var c = str.charCodeAt(i);
            //单字节加1
            if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
                len++;
                if(len>=num-2)
                {
                    if(i != str.length-1)
                        s += "...";
                    break;
                }
                else
                {
                    s += str.charAt(i);
                }
            }
            else {
                len+=2;
                if(len>=num-2)
                {
                    if(i != str.length-1)
                        s += "...";
                    break;
                }
                else
                {
                    s += str.charAt(i);
                }
            }
        }
        return s;
    }
};