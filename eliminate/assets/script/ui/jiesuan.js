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
        this.bg = cc.find("bg",this.node);
        this.coinnum = cc.find("top/top/coinbg/coinnum",this.bg).getComponent("cc.Label");

        this.level_curr = cc.find("top/level/level_curr",this.bg);
        this.level_curr_num = cc.find("num",this.level_curr).getComponent("cc.Label");
        this.level_last = cc.find("top/level/level_last",this.bg);
        this.level_last_num = cc.find("num",this.level_last).getComponent("cc.Label");
        this.level_next = cc.find("top/level/level_next",this.bg);
        this.level_next_num = cc.find("num",this.level_next).getComponent("cc.Label");

        this.pro = cc.find("top/pro",this.bg).getComponent(cc.ProgressBar);
        this.pro_coinnum = cc.find("num",this.pro.node).getComponent("cc.Label");
        this.protxt = cc.find("protxt",this.pro.node).getComponent("cc.Label");

        this.award = cc.find("center/awardbg/award",this.bg).getComponent("cc.Label");


        this.node_fuhuo = cc.find("bottom/node_fuhuo",this.bg);
        this.node_fail = cc.find("bottom/node_fail",this.bg);
        this.node_win = cc.find("bottom/node_win",this.bg);

        this.txt_home = cc.find("bottom/txt_home",this.bg);
        this.txt_home_ban = cc.find("bottom/txt_home/ban",this.bg);

        this.fuhuo_time = cc.find("box_fuhuo/time",this.node_fuhuo).getComponent("cc.Label");
        this.fuhuocoin =  cc.find("box_fuhuo/fuhuocoin",this.node_fuhuo).getComponent("cc.Label");


        this.fail_lingqu = cc.find("lingqu",this.node_fail).getComponent("cc.Button");
        this.win_lingqu = cc.find("lingqu",this.node_win).getComponent("cc.Button");

        this.fail_lingqu_rate = cc.find("lingqu/rate",this.node_fail).getComponent("cc.Label");
        this.win_lingqu_rate = cc.find("lingqu/rate",this.node_win).getComponent("cc.Label");


        this.isUseVedio = true;
        if(cc.GAME.share && storage.getShareNum()<8)
        {
            var r = Math.random()*100;
            if(r>cc.GAME.vediopro || storage.getVedioNum() > 8)
            {
                this.isUseVedio = false;
                cc.find("box_fuhuo/vedio",this.node_fuhuo).active = false;
                cc.find("box_fuhuo/share",this.node_fuhuo).active = true;

                cc.find("lingqu/vedio",this.node_fail).active = false;
                cc.find("lingqu/share",this.node_fail).active = true;

                cc.find("lingqu/vedio",this.node_win).active = false;
                cc.find("lingqu/share",this.node_win).active = true;
            }
        }

        if(cc.sdk.is_iphonex())
        {
            var topNode = cc.find("top/top",this.bg);
            topNode.runAction(cc.sequence(
                cc.delayTime(0.1),
                cc.callFunc(function(){
                    var s = cc.view.getFrameSize();
                    var dpi = cc.winSize.width/s.width;
                    topNode.y -= dpi*30;
                })
            ));
        }
    },

    updateUI: function()
    {
        this.coinnum.string = storage.castNum(storage.getCoin());
        var lv = storage.getLevel();

        this.level_last.active = lv == 1? false : true;
        this.level_next_num.active = config.levels.length < lv? false : true;
        this.level_last_num.string = (lv-1);
        this.level_curr_num.string = lv;
        this.level_next_num.string = (lv+1);

        this.pro.progress = this.game.game_pro.progress;
        this.protxt.string = this.game.game_pronum.string;
        this.pro_coinnum.string = storage.castNum(this.awardCoin);
        this.award.string = storage.castNum(this.awardCoin);


        this.node_fuhuo.active = this.showType == "fuhuo";
        this.node_fail.active = this.showType == "fail";
        this.node_win.active = this.showType == "win";

        if(this.node_fuhuo.active)
            this.candt = true;

    },

    show: function(showType)
    {
        var self = this;
        this.game = cc.find("Canvas").getComponent("game");
        this.node.sc = this;
        this.initUI();

        this.awardCoin = this.game.gameGetCoin;

        this.showType = showType;
        this.isVediox2 = false;
        this.node.active = true;
        this.bg.runAction(cc.sequence(
                cc.scaleTo(0.2,1.1).easing(cc.easeSineOut()),
                cc.scaleTo(0.2,1).easing(cc.easeSineOut())
            ));

        this.timeval = 9;
        this.timedt = 0;
        this.isWin = showType == "win" ? true : false;

        this.rate = 2;
        //Math.floor(Math.random()*2+1);
        //if(this.isWin)
        //    this.rate = Math.floor(Math.random()*3+2);

        storage.setCoin(storage.getCoin()+this.awardCoin);
        //res.showToast("金币+"+storage.castNum(this.awardCoin));
        this.updateUI();

        var lv = storage.getLevel();
        this.currLv = lv;
        if(this.showType == "win")
        {
            if(lv+1<=config.levels.length)
                storage.setLevel(lv+1);
            cc.qianqista.event("关卡胜利_"+lv);
            sdk.uploadScore(lv);
        }
        else if(this.showType == "fail")
        {
            cc.qianqista.event("关卡失败_"+lv);
        }

        cc.sdk.hideBanner();

        cc.sdk.showBanner(self.txt_home_ban,function(dis){
            self.txt_home.y -= (dis-20);
        });
    },

    hide: function(callback)
    {
        storage.uploadCoin();
        storage.uploadLevel();
        this.game.updateMainUI();

        var self = this;
        this.bg.runAction(cc.sequence(
            cc.scaleTo(0.2,1.1).easing(cc.easeSineOut()),
            cc.scaleTo(0.2,0).easing(cc.easeSineOut()),
            cc.callFunc(function(){
                if(callback) callback();
                self.node.destroy();
            })
        ));
        cc.sdk.hideBanner();
    },

    click: function(event,data)
    {
        var self = this;
        if(data == "close")
        {
            this.node.runAction(cc.sequence(
                cc.delayTime(0.3),
                cc.callFunc(function(){
                    self.game.gameOver();
                })
            ));
            this.hide();
        }
        else if(data == "fuhuo")
        {
            this.candt = false;

            if(this.isUseVedio)
            {
                sdk.showVedio(function(r){
                    if(r)
                    {
                        self.game.fuhuo();
                        self.hide();
                    }
                    else
                    {
                        res.showToast("复活失败！");
                        self.candt = true;
                    }
                });
            }
            else
            {
                sdk.share(function(r){
                    if(r)
                    {
                        self.game.fuhuo();
                        self.hide();
                    }
                    else
                    {
                        res.showToast("复活失败！");
                        self.candt = true;
                    }
                },"fuhuo");
            }
            cc.qianqista.event("关卡复活_"+this.currLv);
        }
        else if(data == "home")
        {
            this.hide(function(){
                self.game.gameOver();
            });

        }
        else if(data == "lingqu")
        {
            if(this.isUseVedio)
            {
                sdk.showVedio(function(r){
                    if(r)
                    {
                        var c = self.awardCoin*self.rate;
                        storage.setCoin(storage.getCoin()+c);
                        res.showToast("金币+"+storage.castNum(c));
                        self.updateUI();
                        self.fail_lingqu.interactable = false;
                        self.win_lingqu.interactable = false;
                    }
                });
            }
            else
            {
                sdk.share(function(r){
                    if(r)
                    {
                        var c = self.awardCoin*self.rate;
                        storage.setCoin(storage.getCoin()+c);
                        res.showToast("金币+"+storage.castNum(c));
                        self.updateUI();
                        self.fail_lingqu.interactable = false;
                        self.win_lingqu.interactable = false;
                    }
                },"lingqu");
            }
            cc.qianqista.event("关卡领取");
        }
        else if(data == "again")
        {
            this.game.startGame();
            this.hide();
            cc.qianqista.event("关卡再来一次");
        }
        else if(data == "next")
        {
            this.game.startGame();
            this.hide();
            cc.qianqista.event("关卡下一关");
        }
        else if(data == "share")
        {
            this.candt = false;
            sdk.share(function(r){
                if(r)
                {
                    self.game.fuhuo();
                    self.hide();
                }
                self.candt = true;
            },"fuhuo");
        }
        else if(data == "addcoin")
        {
            res.openUI("makemoney");
        }
        else if(data == "setting")
        {
            res.openUI("setting");
        }

        storage.playSound(res.audio_button);
        cc.log(data);//next
    },


    update: function(dt)
    {
        if(this.timeval>0 && this.candt)
        {
            this.timedt += dt;
            if(this.timedt>=1)
            {
                this.timedt = 0;
                this.timeval -= 1;
                this.fuhuo_time.string = this.timeval;
                this.fuhuo_time.node.runAction(cc.sequence(
                    cc.scaleTo(0.1,1.2).easing(cc.easeSineOut()),
                    cc.scaleTo(0.1,1).easing(cc.easeSineOut())
                ));
                storage.playSound(res.audio_time);
                if(this.timeval<=0)
                {
                    this.candt = false;
                    this.showType = "fail";
                    this.updateUI();
                }
            }
        }
    }


    
});
