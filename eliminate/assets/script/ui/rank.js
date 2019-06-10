var storage = require("storage");
var sdk = require("sdk");
var res = require("res");
var config = require("config");

cc.Class({
    extends: cc.Component,

    properties: {
      
    },

    onLoad: function()
    {

        
    },
    initUI: function()
    {
        this.bg = this.node;

    },

    updateUI: function()
    {

    },

    show: function()
    {
        this.main = cc.find("Canvas").getComponent("game");
        this.node.sc = this;
        this.initUI();

        this.node.active = true;
        this.main.node_display.active = true;
        //this.bg.runAction(cc.sequence(
        //        cc.scaleTo(0.2,1.1).easing(cc.easeSineOut()),
        //        cc.scaleTo(0.2,1).easing(cc.easeSineOut())
        //    ));
        //this.updateUI();
        cc.qianqista.event("排行_打开");

        cc.sdk.openRank();
    },

    hide: function()
    {
        var self = this;
        //this.bg.runAction(cc.sequence(
        //        cc.scaleTo(0.2,1.1).easing(cc.easeSineOut()),
        //        cc.scaleTo(0.2,1).easing(cc.easeSineOut()),
        //        cc.callFunc(function(){
        //            self.node.destroy();
        //        })
        //    ));
        self.node.destroy();
        cc.sdk.closeRank();
        this.main.node_display.active = false;
    },

    click: function(event,data)
    {
        if(data == "close")
        {
            this.hide();
        }
        //else if(data == "last")
        //{
        //    this.page --;
        //    this.updateUI();
        //    this.content.removeAllChildren();
        //    this.additem();
        //}
        //else if(data == "next")
        //{
        //    this.page ++;
        //    this.updateUI();
        //    this.content.removeAllChildren();
        //    this.additem();
        //}

        storage.playSound(res.audio_button);
        cc.log(data);
    }

    
});
