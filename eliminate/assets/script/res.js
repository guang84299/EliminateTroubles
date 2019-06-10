/**
 * Created by guang on 19/4/9.
 */

module.exports = {
    pbox:null,
    boxPools:[],
    ptoast:null,
    pfire:null,
    firePools:null,
    ppop:null,
    popPools:null,
    pcoinAni:null,
    coinAniPools:null,

    audio_bgm:"audio/bg",
    audio_button:"audio/button",
    audio_failure:"audio/failure",
    audio_fire_01:"audio/fire_01",
    audio_fire_02:"audio/fire_02",
    audio_fire_03:"audio/fire_03",
    audio_land:"audio/land",
    audio_pop:"audio/pop",
    audio_sel:"audio/sel",
    audio_win:"audio/win",
    audio_time:"audio/time",

    initBoxPools: function(num)
    {
        var pool = new cc.NodePool();
        for (var i = 0; i < num; i++) {
            var box = cc.instantiate(this.pbox);
            pool.put(box);
        }
        this.boxPools.push(pool);
    },

    initFirePools: function()
    {
        this.firePools = new cc.NodePool();
        for (var i = 0; i < 3; i++) {
            var box = cc.instantiate(this.pfire);
            this.firePools.put(box);
        }
    },

    initPopPools: function()
    {
        this.popPools = new cc.NodePool();
        for (var i = 0; i < 8; i++) {
            var box = cc.instantiate(this.ppop);
            this.popPools.put(box);
        }
    },

    initCoinAniPools: function()
    {
        this.coinAniPools = new cc.NodePool();
        for (var i = 0; i < 8; i++) {
            var box = cc.instantiate(this.pcoinAni);
            this.coinAniPools.put(box);
        }
    },

    getBox: function(type)
    {
        var box = null;
        if (this.boxPools[0].size() > 0) {
            box = this.boxPools[0].get();
        } else {
            box = cc.instantiate(this.pbox);
        }
        box.getComponent('box').initType(type);
        box.type = type;
        return box;
    },

    putBox: function(box)
    {
        this.boxPools[0].put(box);
    },

    getFire: function()
    {
        var box = null;
        if (this.firePools.size() > 0) {
            box = this.firePools.get();
        } else {
            box = cc.instantiate(this.pfire);
        }
        box.getComponent('cc.ParticleSystem').resetSystem();
        return box;
    },

    putFire: function(box)
    {
        this.firePools.put(box);
    },

    playFire: function(parent,pos)
    {
        var fire = this.getFire();
        fire.position = pos;
        fire.parent = parent;
        fire.runAction(cc.sequence(
            cc.delayTime(1),
            cc.callFunc(function(){
                cc.res.putFire(fire);
            })
        ));
    },

    getPop: function(type)
    {
        var box = null;
        if (this.popPools.size() > 0) {
            box = this.popPools.get();
        } else {
            box = cc.instantiate(this.ppop);
        }
        var par = box.getComponent('cc.ParticleSystem');
        var color = cc.color(240,202,55);
        if(type == 2)
            color = cc.color(16,222,157);
        else if(type == 3)
            color = cc.color(254,89,96);
        else if(type == 4)
            color = cc.color(50,209,239);

        par.startColor = color;
        par.startColorVar = color;
        par.endColor = color;
        par.endColorVar = color;
        par.resetSystem();
        return box;
    },

    putPop: function(box)
    {
        this.popPools.put(box);
    },

    playCoinAni: function(str,pos,pos2,parent,callback)
    {
        var self = this;
        var box = null;
        if (this.coinAniPools.size() > 0) {
            box = this.coinAniPools.get();
        } else {
            box = cc.instantiate(this.pcoinAni);
        }
        box.getComponent(cc.Label).string = str;
        box.position = pos;
        box.parent = parent;

        box.runAction(cc.sequence(
            cc.spawn(
                cc.sequence(
                    cc.scaleTo(0.1,1.3).easing(cc.easeSineIn()),
                    cc.scaleTo(0.1,1.0).easing(cc.easeSineIn())
                ),
                cc.moveTo(1,pos2).easing(cc.easeSineInOut())
            ),
            cc.callFunc(function(){
                self.coinAniPools.put(box);
                if(callback)callback();
            })
        ));
    },

    setSpriteFrame: function(url,sp)
    {
        cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
            if(!err && sp)
            {
                sp.getComponent("cc.Sprite").spriteFrame = spriteFrame;
            }
        });
    },

    loadPic: function(url,sp)
    {
        cc.loader.load({url: url, type: 'png'}, function (err, tex) {
            if(err)
            {
                cc.log(err);
            }
            else
            {
                if(cc.isValid(sp))
                {
                    var spriteFrame = new cc.SpriteFrame(tex);
                    sp.getComponent("cc.Sprite").spriteFrame = spriteFrame;
                }
            }
        });
    },

    showToast: function(str)
    {
        var toast = cc.instantiate(this.ptoast);
        cc.find("label",toast).getComponent("cc.Label").string = str;
        cc.find("Canvas").addChild(toast,10000);
        toast.opacity = 0;
        toast.runAction(cc.sequence(
            cc.fadeIn(0.2),
            cc.delayTime(2),
            cc.fadeOut(0.3),
            cc.removeSelf()
        ));
    },

    showCoin: function(coin,pos,parent)
    {
        var self = this;
        var node = this.getToastCoin();
        var label = node.getComponent("cc.Label");
        label.fontSize = 30;
        label.string = coin;
        //var outline = node.addComponent(cc.LabelOutline);
        if(pos)
            node.position = pos;
        if(!parent)parent = cc.find("Canvas");
        parent.addChild(node,10000);

        node.opacity = 255;
        node.runAction(cc.sequence(
            cc.moveBy(0.7,0,50).easing(cc.easeSineOut()),
            cc.spawn(
                cc.moveBy(0.3,0,20).easing(cc.easeSineOut()),
                cc.fadeOut(0.3)
            ),
            cc.callFunc(function(){
                self.putToastCoin(node);
            })
        ));
    },

    openUI: function(name,parent,showType)
    {
        if(!parent) parent = cc.find("Canvas");
        if(parent)
        {
            var node = parent.getChildByName(name);
            if(node)
            {
                node.active = true;
                return;
            }
        }
        cc.loader.loadRes("prefab/node_"+name, function(err, prefab)
        {
            if(err)
            {
                console.log("init error "+name,err);
            }
            else
            {
                var node = cc.instantiate(prefab);
                node.name = name;
                parent.addChild(node);
                node.getComponent(name).show(showType);
            }
        });
    },

    closeUI: function(name,parent)
    {
        if(!parent) parent = cc.find("Canvas");
        if(parent)
        {
            var node = parent.getChildByName(name);
            if(node)
            {
                node.destroy();
            }
        }
    },

    openPrefab: function(path,parent,callback)
    {
        if(!parent) parent = cc.find("Canvas");
        cc.loader.loadRes("prefab/"+path, function(err, prefab)
        {
            if(err)
            {
                console.log("init error "+path,err);
            }
            else
            {
                var node = cc.instantiate(prefab);
                parent.addChild(node);
                if(callback)callback(node);
            }
        });
    },

    isRestTime: function(time1,time2)
    {
        time1 = new Date(time1);
        time2 = new Date(time2);


        if(time2.getFullYear() != time1.getFullYear())
        {
            return true;
        }
        else if(time2.getMonth() != time1.getMonth())
        {
            return true;
        }
        else if(time2.getDate() != time1.getDate())
        {
            return true;
        }
        else
        {
            return false;
        }
    }
};