var storage = require("storage");
var sdk = require("sdk");
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
        var self = this;
        cc.qianqista.datas(function(res)
        {
            console.log("datas = "+JSON.stringify(res));
            if(res.state == 200 && res.data && res.data.length>0)
            {
                var json = JSON.parse(res.data);
                cc.ginvitelist = json.ginvitelist == undefined ? cc.ginvitelist : json.ginvitelist;
            }
            self.node.runAction(cc.sequence(
                cc.delayTime(3),
                cc.callFunc(function(){
                    self.updatedata();
                })
            ));
        });


        this.bg = cc.find("bg",this.node);

        this.content = cc.find("content",this.bg);
        this.item = cc.find("item",this.bg);
        this.page_last = cc.find("last",this.bg);
        this.page_next = cc.find("next",this.bg);
        this.page_num = cc.find("page",this.bg).getComponent("cc.Label");

        this.page = 0;
        this.pageToal = 10;
        var rate = cc.ginvitelist.length;
        if(rate<1) rate = 1;
        this.lnum = storage.getInviteLnum();
    },

    updatedata: function()
    {

        var self = this;
        cc.qianqista.datas(function(res)
        {
            console.log("datas = "+JSON.stringify(res));
            if(res.state == 200 && res.data && res.data.length>0)
            {
                var json = JSON.parse(res.data);
                cc.ginvitelist = json.ginvitelist == undefined ? cc.ginvitelist : json.ginvitelist;
                self.updateallitem();
            }

            self.node.runAction(cc.sequence(
                cc.delayTime(3),
                cc.callFunc(function(){
                    self.updatedata();
                })
            ));

        });
    },

    updateallitem: function()
    {
        for(var i=0;i<this.content.childrenCount;i++)
        {
            var n = i+this.page*4;
            var task = null;
            if(n<cc.ginvitelist.length)
                task = cc.ginvitelist[n];
            var item = this.content.children[i];
            var head = cc.find("head_box/mask/head",item);
            var btn = cc.find("btn",item).getComponent("cc.Button");
            var btn_txt = cc.find("btn/str",item).getComponent("cc.Label");
            if(task)
            {
                res.loadPic(head,task.pic);
            }
            if(n+1>cc.ginvitelist.length)
            {
                btn_txt.string = "邀请";
                btn.interactable = true;
                //btn.node.color = cc.color(255,126,0);
            }
            else{
                if(this.lnum>=n+1)
                {
                    btn_txt.string = "完成";
                    btn.interactable = false;
                    //btn.node.color = cc.color(194,194,194);
                }
                else
                {
                    btn_txt.string = "领取";
                    btn.interactable = true;
                    //btn.node.color = cc.color(27,163,0);
                }

            }

        }
    },

    updateUI: function()
    {
        this.page_last.active = (this.page != 0);
        this.page_next.active = (this.page+1 < this.pageToal);
        this.page_num.string = (this.page+1)+"/"+this.pageToal;
    },

    additem: function()
    {
        var self = this;
        var i = this.content.childrenCount+this.page*4;
        if(this.content.childrenCount<4)
        {
            var task = null;
            if(i<cc.ginvitelist.length)
                task = cc.ginvitelist[i];
            var id = i;
            var item = cc.instantiate(this.item);
            var title = cc.find("title",item).getComponent("cc.Label");
            //var coinnum = cc.find("coinnum",item).getComponent("cc.Label");
            var head = cc.find("head_box/mask/head",item);
            var btn = cc.find("btn",item).getComponent("cc.Button");
            var btn_txt = cc.find("btn/str",item).getComponent("cc.Label");
            item.tid = id;
            title.string = "第"+(i+1)+"位";
            //coinnum.string = storage.castNum(this.awardnum);
            if(task)
            {
                res.loadPic(head,task.pic);
            }
            if(cc.ginvitelist.length<i+1)
            {
                btn_txt.string = "邀请";
                btn.interactable = true;
                //btn.node.color = cc.color(255,126,0);
            }
            else{
                if(this.lnum>=i+1)
                {
                    btn_txt.string = "完成";
                    btn.interactable = false;
                    //btn.node.color = cc.color(194,194,194);
                }
                else
                {
                    btn_txt.string = "领取";
                    btn.interactable = true;
                    //btn.node.color = cc.color(27,163,0);
                }

            }

            item.active = true;
            this.content.addChild(item);

            self.additem();
        }
    },

    btnItem: function(item)
    {
        if(cc.ginvitelist.length>item.tid)
        {
            if(this.lnum<=item.tid)
            {
                res.showToast("步数+1");
                storage.setStep(storage.getStep()+1);
                this.lnum+=1;
                storage.setInviteLnum(this.lnum);
                this.updateallitem();
                storage.uploadInviteLnum();
                this.main.updateMainUI();
            }
        }
        else
        {
            sdk.share(null,"yaoqing",true);
            cc.qianqista.event("领取豪礼_邀请");
        }
    },

    show: function()
    {
        this.main = cc.find("Canvas").getComponent("game");
        this.node.sc = this;
        this.initUI();

        this.node.active = true;
        this.bg.runAction(cc.sequence(
                cc.scaleTo(0.2,1.1).easing(cc.easeSineOut()),
                cc.scaleTo(0.2,1).easing(cc.easeSineOut())
            ));
        this.updateUI();
        this.additem();
        cc.qianqista.event("领取豪礼_打开");
        cc.sdk.showBanner();
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

    click: function(event,data)
    {
        if(data == "close")
        {
            this.hide();
        }
        else if(data == "item")
        {
            this.btnItem(event.target.parent);
        }
        else if(data == "last")
        {
            this.page --;
            this.updateUI();
            this.content.removeAllChildren();
            this.additem();
        }
        else if(data == "next")
        {
            this.page ++;
            this.updateUI();
            this.content.removeAllChildren();
            this.additem();
        }
        else if(data == "yaoqing")
        {
            sdk.share(null,"yaoqing",true);
            cc.qianqista.event("领取豪礼_邀请好友");
        }

        storage.playSound(res.audio_button);
        cc.log(data);
    }

    
});
