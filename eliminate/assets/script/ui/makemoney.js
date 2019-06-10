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
        this.award = cc.config.steps[step-1].upcoin*0.2;
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
        cc.qianqista.event("赚钱_打开");
    },

    updateUI: function()
    {
        this.coin_num.string = storage.castNum(this.award);
    },

    btnVedio: function()
    {
        var self = this;
        cc.qianqista.event("赚钱_看视频");
        sdk.showVedio(function(r){
            if(r)
            {
                cc.qianqista.event("赚钱_看视频成功");
                res.showToast("获得金币"+storage.castNum(self.award));
                storage.setCoin(storage.getCoin()+self.award);
                storage.uploadCoin();
                self.main.updateMainUI();
            }
        });
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


    onClick: function(event, data)
    {
        if(data == "close")
        {
            this.hide();
        }
        else if(data == "vedio")
        {
            this.btnVedio();
        }

    }
});
