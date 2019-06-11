/**
 * Created by guang on 19/4/9.
 */

var res = require("res");
var qianqista = require("qianqista");
var sdk = require("sdk");
var storage = require("storage");
var config = require("config");

cc.qianqista = qianqista;
cc.sdk = sdk;
cc.storage = storage;
cc.res = res;
cc.config = config;
cc.ginvitelist = [];
cc.GAME = {};

cc.Class({
    extends: cc.Component,

    properties: {
        progressBar: {
            default: null,
            type: cc.ProgressBar
        },

        progressTips: {
            default: null,
            type: cc.Label
        },

        netLoading: {
            default: null,
            type: cc.Node
        }
    },


    onLoad: function() {

        this.resource = null;

        this.purls = [
            "audio/failure",
            "audio/fire_01",
            "audio/fire_02",
            "audio/fire_03",
            "audio/win",

            "prefab/box",
            "prefab/node_jiesuan",
            "prefab/node_setting",
            "prefab/node_makemoney",
            "prefab/node_rank",
            "prefab/node_yaoqing",
            "prefab/node_lixian",
            "prefab/node_power",
            "prefab/toast",
            "prefab/anima/fire",
            "prefab/anima/pop",
            "prefab/anima/coinAni",
            "scene/game"
        ];


        this.completedCount = 0;
        this.totalCount = this.purls.length;
        this.loadCount = 0;

        this.nowtime = new Date().getTime();
        for(var i=0;i<3;i++)
            this.loadres();

        var self = this;
        qianqista.init("wx35c2e9513b8cc097","8a1126dfbcf8ca52750956ba8adde717","测试",function(){

            qianqista.datas(function(res){
                console.log('my datas:', res);
                if(res.state == 200)
                {
                    self.updateLocalData(res.data);
                }
                self.netLoading.active = false;

                sdk.closeRank();
                var score = storage.getLevel();
                sdk.uploadScore(score);
            });
        });
        qianqista.control(function(res){
            console.log('my control:', res);
            if(res.state == 200)
            {
                cc.GAME.control = res.data;
                self.updateUIControl();

            }
        });
        sdk.getUserInfo();
        sdk.videoLoad();

        sdk.closeRank();
        var score = storage.getLevel();
        sdk.uploadScore(score);

        if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
        {
            wx.onHide(function(){
                cc.qianqista.event("加载中_退出");
            });

            var manager = wx.getUpdateManager();
            manager.onCheckForUpdate(function(r){
                if(r && r.hasUpdate)
                {

                }
            });
            manager.onUpdateReady(function(r){
                manager.applyUpdate();
            });
        }

        this.netLoading.runAction(cc.repeatForever(cc.rotateBy(1,180)));


    },

    loadres: function()
    {
        var self = this;
        if(this.loadCount<this.totalCount)
        {
            cc.loader.loadRes(this.purls[this.loadCount], function(err, prefab)
            {
                self.progressCallback(self.completedCount,self.totalCount,prefab);
            });
            this.loadCount++;
        }
    },


    progressCallback: function (completedCount, totalCount, resource) {
        this.progress = completedCount / totalCount;
        this.resource = resource;
        this.completedCount++;
        //this.totalCount = totalCount;

        this.progressBar.progress = this.progress;
        this.progressTips.string = "加载中 " + Math.floor(this.completedCount/this.totalCount*100)+"%";

        if(this.completedCount>=this.totalCount)
        {
            this.completeCallback();
        }
        else{
            this.loadres();
        }

        if(resource.name == "box")
        {
            res.pbox = resource;
            res.initBoxPools(49);
        }
        else if(resource.name == "fire")
        {
            res.pfire = resource;
            res.initFirePools();
        }
        else if(resource.name == "pop")
        {
            res.ppop = resource;
            res.initPopPools();
        }
        else if(resource.name == "coinAni")
        {
            res.pcoinAni = resource;
            res.initCoinAniPools();
        }
        else if(resource.name == "toast")
            res.ptoast = resource;
        //cc.log(resource);
    },
    completeCallback: function (error, resource) {
        console.log("-----completeCallback---time:",new Date().getTime()-this.nowtime);
        this.progressTips.string = "加载完成";
        this.progressBar.progress = 1;
        //this.progressTips.string = "加载中";
        //this.progressBar.node.active = true;
        //cc.loader.loadResDir("audio", this.progressCallback.bind(this), this.completeCallback2.bind(this));

        if(this.netLoading)
        {
            this.node.runAction(cc.sequence(
                cc.delayTime(2),
                cc.callFunc(function(){
                    cc.director.loadScene("game");
                })
            ));
        }
        else
        {
            cc.director.loadScene("game");
        }
    },


    updateLocalData: function(data)
    {
        if(data)
        {
            var datas = JSON.parse(data);
            if(datas.hasOwnProperty("first"))
                storage.setFirst(1);
            if(datas.hasOwnProperty("coin"))
                storage.setCoin(Number(datas.coin));
            if(datas.hasOwnProperty("level"))
                storage.setLevel(Number(datas.level));
            if(datas.hasOwnProperty("step"))
                storage.setStep(Number(datas.step));


            if(datas.hasOwnProperty("login_time"))
                storage.setLoginTime(Number(datas.login_time));
            if(datas.hasOwnProperty("login_day"))
                storage.setLoginDay(Number(datas.login_day));
            if(datas.hasOwnProperty("game_num"))
                storage.setGameNum(Number(datas.game_num));
            if(datas.hasOwnProperty("lixian_time"))
                storage.setLiXianTime(Number(datas.lixian_time));


            if(datas.hasOwnProperty("ginvitelist"))
                cc.ginvitelist = datas.ginvitelist;
            if(datas.hasOwnProperty("ginvite_lnum"))
                storage.setInviteLnum(Number(datas.ginvite_lnum));



            var now = new Date().getTime();
            var time = storage.getLoginTime();
            if(res.isRestTime(time,now))
            {
                storage.setLoginTime(now);
                storage.setVedioNum(0);
                storage.setShareNum(0);
            }

            if(!datas.hasOwnProperty("first"))
            {
                storage.setMusic(1);
                storage.setSound(1);
                storage.setVibrate(1);

                this.uploadData();
            }

            console.log("VedioNum:",storage.getVedioNum());
            console.log("datas:",datas);
        }
        else
        {
            this.uploadData();
            storage.setMusic(1);
            storage.setSound(1);
            storage.setVibrate(1);
        }
    },

    uploadData: function()
    {
        var datas = {};
        datas.first = storage.getFirst();
        datas.coin = storage.getCoin();
        datas.level = storage.getLevel();
        datas.step = storage.getStep();
        datas.login_time = storage.getLoginTime();
        datas.login_day = storage.getLoginDay();
        datas.game_num = storage.getGameNum();
        datas.lixian_time = storage.getLiXianTime();
        datas.ginvite_lnum = storage.getInviteLnum();

        console.log("uploadData:",datas);
        var data = JSON.stringify(datas);
        var self = this;
        qianqista.uploaddatas(data,function(res){
            console.log("--uploaddatas:",res);
            //if(res && res.state == 200)
            //    self.updateData();
        });

        //qianqista.uploadScore(storage.getMaxPoint());
    },

    updateUIControl: function()
    {
        cc.GAME.skipgame = null;
        cc.GAME.share = false;
        cc.GAME.shares = [];
        cc.GAME.vediopro = 100;
        if(cc.GAME.control.length>0)
        {
            for(var i=0;i<cc.GAME.control.length;i++)
            {
                var con = cc.GAME.control[i];
                if(con.id == "skipgame")
                {
                    if(con.value)
                    {
                        var s = con.value.replace(/\'/g,"\"");
                        cc.GAME.skipgame = JSON.parse(s);
                    }
                }
                else if(con.id.indexOf("share") != -1)
                {
                    if(con.id == "share")
                    {
                        cc.GAME.share = con.value == 1 ? true : false;
                    }
                    else
                    {
                        if(con.value)
                        {
                            var s = con.value.replace(/\'/g,"\"");
                            cc.GAME.shares.push(JSON.parse(s));
                        }
                    }

                }
                else if(con.id == "vediopro")
                {
                    if(con.value)
                    {
                        cc.GAME.vediopro = parseInt(con.value);
                    }
                }
            }

        }
    }
});
