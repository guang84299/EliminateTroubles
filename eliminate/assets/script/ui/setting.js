var storage = require("storage");
var res = require("res");

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
        this.node_setting_music = cc.find("bg/music/checkmark",this.node);
        //this.node_setting_sound = cc.find("bg/sound/checkmark",this.node);
        this.node_setting_vibrate = cc.find("bg/vibrate/checkmark",this.node);

        this.node_setting_music_close = cc.find("bg/music/Background",this.node);
        //this.node_setting_sound_close = cc.find("bg/sound/Background",this.node);
        this.node_setting_vibrate_close = cc.find("bg/vibrate/Background",this.node);
    },

    updateUI: function()
    {
        //getComponent("cc.Toggle").isChecked
        this.node_setting_music.active = (storage.getMusic() == 1 ? true : false);
        //this.node_setting_sound.active = (storage.getSound() == 1 ? true : false);
        this.node_setting_vibrate.active = (storage.getVibrate() == 1 ? true : false);

        this.node_setting_music_close.active = (!this.node_setting_music.active);
        //this.node_setting_sound_close.active = (!this.node_setting_sound.active);
        this.node_setting_vibrate_close.active = (!this.node_setting_vibrate.active);
    },

    show: function()
    {
        //this.main.wxQuanState(false);
        this.game = cc.find("Canvas").getComponent("game");
        this.node.sc = this;
        this.initUI();
        this.updateUI();

        this.node.active = true;
        this.bg.runAction(cc.sequence(
                cc.scaleTo(0.2,1.1).easing(cc.easeSineOut()),
                cc.scaleTo(0.2,1).easing(cc.easeSineOut())
            ));
        cc.sdk.showBanner();
    },

    hide: function()
    {
        //this.main.wxQuanState(true);
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

    click: function(event,data)
    {
        if(data == "close")
        {
            this.hide();
        }
        else if(data == "music")
        {
            var m = storage.getMusic();
            m = m == 0 ? 1 : 0;
            storage.setMusic(m);
            storage.setSound(m);
            if(storage.getMusic() == 0)
            {
                storage.stopMusic();
            }
            else
            {
                storage.playMusic(res.audio_bgm);
            }
        }
        else if(data == "sound")
        {
            var m = storage.getSound();
            m = m == 0 ? 1 : 0;
            storage.setSound(m);
        }
        else if(data == "vibrate")
        {
            var m = storage.getVibrate();
            m = m == 0 ? 1 : 0;
            storage.setVibrate(m);
        }
        this.updateUI();
        storage.playSound(res.audio_button);
        cc.log(data);
    }

    
});
