/**
 * Created by guang on 19/4/9.
 */
var res = require("res");
var config = require("config");
var sdk = require("sdk");

cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad: function() {
        this.initData();
        this.initUI();
        this.addListener();
    },

    initUI: function()
    {
        this.node_bg = cc.find("node_bg",this.node);
        this.node_ui = cc.find("node_ui",this.node);
        this.node_ui_main = cc.find("main",this.node_ui);
        this.node_ui_game = cc.find("game",this.node_ui);
        this.node_ui_common = cc.find("common",this.node_ui);

        this.node_display = cc.find("node_display",this.node);
        this.node_display.zIndex = 9999999;

        this.levels = cc.find("levels",this.node_ui_main);
        this.level_last = cc.find("level_box_last",this.levels);
        this.level_last_num = cc.find("level_box_last/levelnum",this.levels).getComponent(cc.Label);
        this.level_curr = cc.find("level_box_curr",this.levels);
        this.level_curr_num = cc.find("level_box_curr/levelnum",this.levels).getComponent(cc.Label);
        this.level_curr_arraw = cc.find("level_box_curr/level_curr",this.levels);
        this.level_next = cc.find("level_box_next",this.levels);
        this.level_next_num = cc.find("level_box_next/levelnum",this.levels).getComponent(cc.Label);

        this.node_game = cc.find("node_game",this.node);
        this.node_boxs = cc.find("boxs",this.node_game);

        this.coin_num = cc.find("top/coinbg/coinnum",this.node_ui_common).getComponent(cc.Label);
        this.step_num = cc.find("lvup_bg/stepnum",this.node_ui_main).getComponent(cc.Label);
        this.step_btn = cc.find("lvup_bg/btn_lvup",this.node_ui_main).getComponent(cc.Button);
        this.step_coinnum = cc.find("lvup_bg/btn_lvup/coinnum",this.node_ui_main).getComponent(cc.Label);

        this.game_pro =  cc.find("pro",this.node_ui_game).getComponent(cc.ProgressBar);
        this.game_levelnum = cc.find("pro/levelnum",this.node_ui_game).getComponent(cc.Label);
        this.game_pronum = cc.find("pro/pronum",this.node_ui_game).getComponent(cc.Label);
        this.game_stepnum = cc.find("pro/bushu/bushunum",this.node_ui_game).getComponent(cc.Label);
        this.game_txt_bushu = cc.find("pro/bushu/txt_bushu",this.node_ui_game);

        this.lixian_quan = cc.find("lixian/quan",this.node_ui_main).getComponent(cc.ProgressBar);
        this.lixian_coinnum = cc.find("lixian/coinnum",this.node_ui_main).getComponent(cc.Label);

        this.main_start = cc.find("start",this.node_ui_main);
        this.main_share = cc.find("share",this.node_ui_main);
        this.main_share.active = cc.GAME.share;
        this.uiAnima();
        this.updateMainUI();
    },

    initData: function()
    {
        var now = new Date().getTime();
        this.lixian_time = cc.storage.getLiXianTime();
        if(this.lixian_time == 0)
        {
            this.lixian_time = now;
            cc.storage.setLiXianTime(now);
        }
        this.lixianDt = 0;

        cc.storage.playSound(res.audio_bgm);
    },

    updateMainUI: function()
    {
        var coin = cc.storage.getCoin();
        this.coin_num.string = cc.storage.castNum(coin);

        var level = cc.storage.getLevel();
        var maxLv = config.levels.length;
        this.level_last.active = level <= 1 ? false : true;
        this.level_next.active = level < maxLv-2 ? true : false;
        this.level_last_num.string = (level-1);
        this.level_curr_num.string = level;
        this.level_next_num.string = (level+1);

        var step = cc.storage.getStep();
        var lnum = cc.storage.getInviteLnum();
        this.mainStep = step+lnum;
        this.step_num.string = step;
        if(lnum>0) this.step_num.string = step + "+" + lnum;
        if(this.mainStep>config.steps.length)this.mainStep = config.steps.length;
        this.step_coinnum.string = cc.storage.castNum(config.steps[this.mainStep-1].upcoin);
        //this.step_btn.interactable = coin>=config.steps[step-1].upcoin ? true : false;
        //var step_btn_children = this.step_btn.node.children;
        //if(this.step_btn.interactable)
        //{
        //    for(var i=0;i<step_btn_children.length;i++)
        //        step_btn_children[i].color = cc.color(255,255,255);
        //}
        //else
        //{
        //    for(var i=0;i<step_btn_children.length;i++)
        //        step_btn_children[i].color = cc.color(180,180,180);
        //}
    },

    updateGameUI: function()
    {
        var target = config.levels[this.gameLevel-1].target;
        this.game_pro.progress = this.gamePro/target;
        this.game_pronum.string = Math.floor(this.gamePro/target*100)+"%";
        this.game_levelnum.string = this.gameLevel;
        this.game_stepnum.string = this.gameStep;
        this.coin_num.string = cc.storage.castNum(this.gameCoin+this.gameGetCoin);
    },

    uiAnima: function()
    {
        var s = cc.winSize;
        for(var i=0;i<3;i++)
        {
            var star = this.node_bg.getChildByName("star"+(i+1));
            star.runAction(cc.repeatForever(cc.sequence(
                cc.delayTime(0.1*i),
                cc.blink(0.3,2),
                cc.delayTime(2)
            )));
        }

        for(var i=0;i<3;i++)
        {
            var star = this.node_bg.getChildByName("star0"+(i+1));
            if(i == 0)
                star.position = cc.v2(450, s.height/2+star.height);
            else if(i == 1)
                star.position = cc.v2(180, s.height/2+star.height);
            else if(i == 2)
                star.position = cc.v2(-50, s.height/2+star.height);
            star.runAction(cc.repeatForever(cc.sequence(
                cc.delayTime(0.1*i),
                cc.moveBy(1, -s.width*1.2,-s.height-star.height).easing(cc.easeSineOut()),
                cc.delayTime(0.2),
                cc.moveBy(0, s.width*1.2,s.height+star.height)
            )));
        }

        this.level_curr_arraw.runAction(cc.repeatForever(cc.sequence(
            cc.scaleTo(0.3,-1,1),
            cc.scaleTo(0.3,1,1),
            cc.delayTime(1)
        )));

        this.main_start.runAction(cc.repeatForever(cc.sequence(
            cc.blink(0.5,3),
            cc.delayTime(3)
        )));

        if(sdk.is_iphonex())
        {
            var topNode = cc.find("top",this.node_ui_common);
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

    startGame: function()
    {
        this.node_boxs.destroyAllChildren();
        this.node_ui_main.active = false;
        this.node_ui_game.active = true;
        this.box_pos = [];
        this.selbox = [];
        this.gameStep = cc.storage.getStep()+cc.storage.getInviteLnum();
        this.gameCoin = cc.storage.getCoin();
        this.gameLevel = cc.storage.getLevel();
        this.gameGetCoin = 0;
        this.gamePro = 0;
        this.initBox();
        this.updateGameUI();
        this.game_stepnum.node.stopAllActions();
        this.game_stepnum.node.color = cc.color(255,255,255);
        this.game_txt_bushu.stopAllActions();
        this.game_txt_bushu.color = cc.color(255,255,255);

        this.state = "ready";

        if(!this.node_ui_game.isAdapter && sdk.is_iphonex())
        {
            this.node_ui_game.isAdapter = true;
            var pro = cc.find("pro",this.node_ui_game);
            pro.runAction(cc.sequence(
                cc.delayTime(0.1),
                cc.callFunc(function(){
                    var s = cc.view.getFrameSize();
                    var dpi = cc.winSize.width/s.width;
                    pro.y -= dpi*30;
                })
            ));
        }
        cc.sdk.showBanner();
    },

    gameOver: function()
    {
        this.state = "over";
        this.node_boxs.destroyAllChildren();
        this.node_ui_main.active = true;
        this.node_ui_game.active = false;
        this.updateMainUI();
    },

    fuhuo: function()
    {
        this.gameStep = cc.storage.getStep();
        this.updateGameUI();
        this.state = "start";
    },

    gameFail: function()
    {
        res.openUI("jiesuan",null,"fuhuo");
        cc.storage.playSound(res.audio_failure,true);
    },

    gameWin: function()
    {
        res.openUI("jiesuan",null,"win");
        cc.storage.playSound(res.audio_win,true);
    },

    initBox: function()
    {
        var h = cc.winSize.height;
        var t = 0;
        for(var row=1;row<=7;row++)
        {
            for(var col=1;col<=7;col++)
            {
                var type = Math.floor(Math.random()*4+1);
                var box = res.getBox(type);
                box.row = row;
                box.col = col;
                var pos = this.getPos(box);
                box.position = pos;
                box.y += h;
                this.node_boxs.addChild(box);

                t = ((row-1)*7+(col-1))*0.05;
                var ac = cc.sequence(
                    cc.delayTime(t),
                    cc.moveBy(0.2,0,-h),
                    cc.callFunc(function(){
                        cc.storage.playSound(res.audio_land);
                    })
                );
                box.runAction(ac);

                this.box_pos.push({row:row,col:col,pos:pos,has:true});
            }
        }
        var self = this;
        this.node.runAction(cc.sequence(
            cc.delayTime(t+0.3),
            cc.callFunc(function(){
                self.state = "start";
            })
        ));
    },

    getPos: function(box)
    {
        var w = cc.winSize.width;
        return cc.v2((box.width+2)*(box.col-1) - w/2 + box.width/2,
            (box.height+2)*(box.row-1) + box.height/2);
    },

    selBox: function(pos)
    {
        if(this.state == "start")
        {
            //var p = pos.sub(cc.v2(cc.winSize.width/2,cc.winSize.height/2));
            var p = this.node_boxs.convertToNodeSpace(pos);
            var issel = false;
            if(this.selbox.length>0)
            {
                for(var i=0;i<this.selbox.length;i++)
                {
                    var box = this.selbox[i];
                    if(box.position.sub(p).mag()<box.width/2)
                    {
                        this.selbox[i].sc.setSel(issel);
                        issel = true;
                    }
                }
                if(issel && this.selbox.length>1)
                {
                    this.destoryIndex = 0;
                    this.destorySelBox();
                    this.state = "ready";
                }
                else
                {
                    for(var i=0;i<this.selbox.length;i++)
                    {
                        this.selbox[i].sc.setSel(false);
                    }
                    this.selbox = [];
                }
            }

            if(!issel)
            {
                for(var i=0;i<this.node_boxs.childrenCount;i++)
                {
                    var box = this.node_boxs.children[i];
                    if(box.position.sub(p).mag()<box.width/2)
                    {
                        this.selbox.push(box);
                        issel = true;
                        break;
                    }
                }
                if(this.selbox.length>0)
                {
                    var box = this.selbox[0];
                    this.findSelBox(box);
                    if(this.selbox.length<2)
                        issel = false;
                }
                for(var i=0;i<this.selbox.length;i++)
                {
                    this.selbox[i].sc.setSel(issel);
                }
                if(issel)
                cc.storage.playSound(res.audio_sel);
            }

        }
    },

    destorySelBox: function()
    {
        var self = this;
        if(this.destoryIndex < this.selbox.length)
        {
            var box = this.selbox[this.destoryIndex];
            box.sc.setSel(false);
            box.runAction(cc.sequence(
                cc.delayTime(0.1),
                cc.callFunc(function(){
                    res.putBox(box);
                    self.destorySelBox();
                })
            ));
            this.setBoxPos(box.row,box.col,false);
            this.destoryIndex++;
            this.gamePro ++;

            var pop = res.getPop(box.type);
            pop.position = box.position;
            pop.parent = box.parent;
            pop.runAction(cc.sequence(
                cc.delayTime(1),
                cc.callFunc(function(){
                    res.putPop(pop);
                })
            ));
            cc.storage.playSound(res.audio_pop);

            var addcoin = 5 * this.destoryIndex;
            this.gameGetCoin += addcoin;

            var pos1 = box.parent.convertToWorldSpace(box.position);
            pos1 = pos1.sub(cc.v2(cc.winSize.width/2,cc.winSize.height/2));
            var pos2 = this.coin_num.node.parent.convertToWorldSpace(this.coin_num.node.position);
            pos2 = pos2.sub(cc.v2(cc.winSize.width/2,cc.winSize.height/2));
            res.playCoinAni("+"+addcoin,pos1,pos2,this.node_ui,function(){
                self.coin_num.node.runAction(cc.sequence(
                    cc.scaleTo(0.05,1.1).easing(cc.easeSineIn()),
                    cc.scaleTo(0.05,1.0).easing(cc.easeSineIn())
                ));
            })
        }
        else
        {
            if(this.destoryIndex>=3)
            {
                cc.storage.playSound(res.audio_fire_01,true);
                res.playFire(self.node,cc.v2(0,cc.winSize.height/2*0.7));
                sdk.vibrate();
            }
            if(this.destoryIndex>=6)
            {
                this.node.runAction(cc.sequence(
                    cc.delayTime(0.3),
                    cc.callFunc(function(){
                        cc.storage.playSound(res.audio_fire_02,true);
                        res.playFire(self.node,cc.v2(-100,cc.winSize.height/2*0.75))
                        sdk.vibrate();
                    })
                ));
            }
            if(this.destoryIndex>=9)
            {
                this.node.runAction(cc.sequence(
                    cc.delayTime(0.5),
                    cc.callFunc(function(){
                        cc.storage.playSound(res.audio_fire_03,true);
                        res.playFire(self.node,cc.v2(100,cc.winSize.height/2*0.73))
                        sdk.vibrate();
                    })
                ));
            }


            this.fomatBox();
            this.selbox = [];
            this.gameStep --;

            if(this.gameStep<=2)
            {
                this.game_stepnum.node.stopAllActions();
                this.game_stepnum.node.color = cc.color(255,0,0);
                this.game_stepnum.node.runAction(cc.repeatForever(cc.blink(1,3)));

                this.game_txt_bushu.stopAllActions();
                this.game_txt_bushu.color = cc.color(255,0,0);
                this.game_txt_bushu.runAction(cc.repeatForever(cc.blink(1,3)));
            }

            var target = config.levels[this.gameLevel-1].target;
            if(this.gamePro>=target)
            {
                this.gameWin();
            }
            else
            {
                if(this.gameStep<=0)
                {
                    this.gameFail();
                }
                else
                {
                    if(Math.random()>0.6)
                    {
                        cc.sdk.hideBanner();
                        cc.sdk.showBanner();
                    }

                }
            }
            this.updateGameUI();


        }
    },

    fomatBox: function()
    {
        var b = false;
        var self = this;
        for(var i=0;i<this.node_boxs.childrenCount;i++)
        {
            var box = this.node_boxs.children[i];
            var p = this.getBoxPos(box.row-1,box.col);
            if(p && !p.has)
            {
                this.setBoxPos(box.row,box.col,false);
                //box.sc.updatePos();
                p.has = true;
                box.row = p.row;
                var pos = this.getPos(box);
                //box.position = pos;
                box.runAction(cc.moveTo(0.1,pos));

                b = true;
            }
        }
        if(b)
        {
            this.node.runAction(cc.sequence(
                cc.delayTime(0.12),
                cc.callFunc(function(){
                    self.fomatBox();
                })
            ));
        }
        else
        {
            var h = cc.winSize.height;
            var n = 0;
            var t = 0;
            for(var i=0;i<this.box_pos.length;i++)
            {
                var p = this.box_pos[i];
                if(!p.has)
                {
                    p.has = true;

                    var type = Math.floor(Math.random()*4+1);
                    var box = res.getBox(type);
                    box.row = p.row;
                    box.col = p.col;
                    var pos = this.getPos(box);
                    box.position = pos;
                    box.y += h;
                    this.node_boxs.addChild(box);

                    t = n*0.05;
                    var ac = cc.sequence(
                        cc.delayTime(t),
                        cc.moveBy(0.2,0,-h),
                        cc.callFunc(function(){
                            cc.storage.playSound(res.audio_land);
                        })
                    );
                    box.runAction(ac);
                    n++;
                }
            }

            this.node.runAction(cc.sequence(
                cc.delayTime(t+0.3),
                cc.callFunc(function(){
                    self.state = "start";
                })
            ));
        }
    },

    setBoxPos: function(row,col,has)
    {
        for(var i=0;i<this.box_pos.length;i++)
        {
            var p = this.box_pos[i];
            if(p.row == row && p.col == col)
            {
                p.has = has;
                break;
            }
        }
    },

    getBoxPos: function(row,col)
    {
        for(var i=0;i<this.box_pos.length;i++)
        {
            var p = this.box_pos[i];
            if(p.row == row && p.col == col)
            {
               return p;
            }
        }
        return null;
    },

    findSelBox: function(box)
    {
        //top
        var box1 = this.findBox(box.row+1,box.col,box.sc.type);
        if(box1 && !this.isHasSelBox(box1.row,box1.col))
        {
            this.selbox.push(box1);
            this.findSelBox(box1);
        }
        //bottom
        var box2 = this.findBox(box.row-1,box.col,box.sc.type);
        if(box2 && !this.isHasSelBox(box2.row,box2.col))
        {
            this.selbox.push(box2);
            this.findSelBox(box2);
        }
        //left
        var box3 = this.findBox(box.row,box.col-1,box.sc.type);
        if(box3 && !this.isHasSelBox(box3.row,box3.col))
        {
            this.selbox.push(box3);
            this.findSelBox(box3);
        }
        //right
        var box4 = this.findBox(box.row,box.col+1,box.sc.type);
        if(box4 && !this.isHasSelBox(box4.row,box4.col))
        {
            this.selbox.push(box4);
            this.findSelBox(box4);
        }
    },

    isHasSelBox: function(row,col)
    {
        for(var i=0;i<this.selbox.length;i++)
        {
            var box = this.selbox[i];
            if(box.row == row && box.col == col)
            {
                return true;
            }
        }
        return false;
    },

    findBox: function(row,col,type)
    {
        for(var i=0;i<this.node_boxs.childrenCount;i++)
        {
            var box = this.node_boxs.children[i];
            if(box.row == row && box.col == col && box.sc.type == type)
            {
                return box;
            }
        }
        return null;
    },

    updateLixian: function(dt)
    {
        this.lixianDt += dt;
        if(this.lixianDt>0.1)
        {
            this.lixianDt = 0;

            this.lixian_quan.progress += 0.05;
            if(this.lixian_quan.progress>=1)
            {
                this.lixian_quan.progress = 0;

                var now = new Date().getTime();
                var time = now - this.lixian_time;
                var lixianToal = 2*60*60*1000;
                if(time>lixianToal) time = lixianToal;

                var lixianCoin = config.steps[this.mainStep-1].upcoin*0.2*(time/lixianToal);
                this.lixian_coinnum.coin = lixianCoin;
                this.lixian_coinnum.string = cc.storage.castNum(lixianCoin);
            }
        }

    },


    addListener: function()
    {
        var s = cc.winSize;
        //var self = this;
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            //var pos = event.getLocation();
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {

        }, this);
        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            var pos = event.getLocation();
            this.selBox(pos);
        }, this);
    },


    update: function(dt) {
        this.updateLixian(dt);
    },

    stepUp: function()
    {
        var coin = cc.storage.getCoin();
        var step = cc.storage.getStep();
        var lnum = cc.storage.getInviteLnum();
        if(step+lnum>=config.steps.length)
        {
            res.showToast("当前步数暂满！");
            return;
        }
        if(coin>=config.steps[step+lnum-1].upcoin)
        {
            cc.storage.setCoin(coin - config.steps[step+lnum-1].upcoin);
            cc.storage.setStep(step+1);
            cc.storage.uploadCoinAndStep();
            this.updateMainUI();
        }
        else
        {
            res.openUI("makemoney");
            res.showToast("金币不足，快来赚取吧！");
        }
    },

    click: function(event,data)
    {
        if(data == "start")
        {
            this.startGame();
        }
        else if(data == "setting")
        {
            res.openUI("setting");
        }
        else if(data == "makemoney")
        {
            res.openUI("makemoney");
        }
        else if(data == "addcoin")
        {
            res.openUI("makemoney");
        }
        else if(data == "rank")
        {
            if(sdk.judgePower())
                res.openUI("rank");
            else
            {
                res.openUI("power");
                sdk.openSetting(function(r){
                    res.closeUI("power");
                    if(r){
                        res.showToast("成功获取权限！");
                        cc.qianqista.event("授权_允许");
                    }
                    else
                    {
                        res.showToast("请允许授权！");
                        cc.qianqista.event("授权_拒绝");
                    }
                });
            }
        }
        else if(data == "haoli")
        {
            if(sdk.judgePower())
                res.openUI("yaoqing");
            else
            {
                res.openUI("power");
                sdk.openSetting(function(r){
                    res.closeUI("power");
                    if(r){
                        res.showToast("成功获取权限！");
                        cc.qianqista.event("授权_允许");
                    }
                    else
                    {
                        res.showToast("请允许授权！");
                        cc.qianqista.event("授权_拒绝");
                    }
                });
            }
        }
        else if(data == "lixian")
        {
            res.openUI("lixian");
        }
        else if(data == "lvup")
        {
            this.stepUp();
        }
        else if(data == "share")
        {
            sdk.share(null,"main_share");
        }
        cc.log(data);
    }
});