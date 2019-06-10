var storage = require("storage");
var res = require("res");
var sdk = require("sdk");

cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad: function()
    {

    },

    initUI: function()
    {
        this.bg = cc.find("bg",this.node);
        this.coin_num = cc.find("bg/coinbg/num",this.node).getComponent(cc.Label);

        var step = storage.getStep();
        this.award = 0;
        this.lixianDt = 0;

        this.isUseVedio = true;
        if(cc.GAME.share)
        {
            var r = Math.random()*100;
            if(r>cc.GAME.vediopro || storage.getVedioNum() > 8)
            {
                this.isUseVedio = false;
                cc.find("btn/vedio",this.bg).active = false;
                cc.find("btn/share",this.bg).active = true;
            }
        }
    },

    show: function()
    {
        this.main = cc.find("Canvas").getComponent("game");
        this.node.active = true;
        this.initUI();
        this.bg.runAction(cc.sequence(
            cc.scaleTo(0.2,1.1).easing(cc.easeSineOut()),
            cc.scaleTo(0.2,1).easing(cc.easeSineOut())
        ));

        this.updateUI();
        cc.sdk.showBanner();
        cc.qianqista.event("离线奖励_打开");
    },

    updateUI: function()
    {
        this.award = this.main.lixian_coinnum.coin;
        this.coin_num.string = cc.storage.castNum(this.award);
    },

    lingqu: function(isvedio)
    {
        var self = this;
        if(isvedio)
        {
            if(this.isUseVedio)
            {
                cc.qianqista.event("离线奖励_看视频");
                sdk.showVedio(function(r){
                    if(r)
                    {
                        cc.qianqista.event("离线奖励_看视频成功");
                        res.showToast("获得金币"+storage.castNum(self.award*2));
                        storage.setCoin(storage.getCoin()+self.award*2);

                        var now = new Date().getTime();
                        storage.setLiXianTime(now);
                        storage.uploadCoin();
                        self.main.updateMainUI();
                        self.main.lixian_time = now;
                        self.hide();
                    }
                });
            }
            else
            {
                sdk.share(function(r){
                    if(r)
                    {
                        res.showToast("获得金币"+storage.castNum(self.award*2));
                        storage.setCoin(storage.getCoin()+self.award*2);

                        var now = new Date().getTime();
                        storage.setLiXianTime(now);
                        storage.uploadCoin();
                        self.main.updateMainUI();
                        self.main.lixian_time = now;
                        self.hide();
                    }
                },"lixian");
            }
        }
        else
        {
            cc.qianqista.event("离线奖励_直接领取");
            res.showToast("获得金币"+storage.castNum(self.award));
            storage.setCoin(storage.getCoin()+self.award);
            var now = new Date().getTime();
            storage.setLiXianTime(now);
            storage.uploadCoin();
            self.main.updateMainUI();
            self.main.lixian_time = now;
            this.hide();
        }
    },

    hide: function()
    {
        var self = this;
        this.bg.runAction(cc.sequence(
            cc.scaleTo(0.2,1.1).easing(cc.easeSineOut()),
            cc.scaleTo(0.2,0).easing(cc.easeSineOut()),
            cc.callFunc(function(){
                self.node.destroy();
            })
        ));
        cc.sdk.hideBanner();
    },

    update: function(dt)
    {
        this.lixianDt += dt;
        if(this.lixianDt>0.1)
        {
            this.lixianDt = 0;
            this.updateUI();
        }
    },


    onClick: function(event, data)
    {
        if(data == "close")
        {
            this.hide();
        }
        else if(data == "vedio")
        {
            this.lingqu(true);
        }
        else if(data == "lingqu")
        {
            this.lingqu();
        }

    }
});
