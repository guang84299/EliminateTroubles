/**
 * Created by guang on 19/4/9.
 */
cc.Class({
    extends: cc.Component,

    properties: {
        typeSPs: {
            type: cc.SpriteFrame,
            default: []
        }
    },


    onLoad: function() {
        this.node.sc = this;
    },

    initType: function(type)
    {
        this.type = type;
        this.sprite = this.node.getComponent("cc.Sprite");
        this.sprite.spriteFrame = this.typeSPs[type-1];
    },

    setSel: function(sel)
    {
        this.node.stopActionByTag(1);
        if(sel)
        {
            var ac = cc.scaleTo(0.2,0.8);
            ac.setTag(1);
            this.node.runAction(ac);
        }
        else
        {
            var ac = cc.scaleTo(0.2,1);
            ac.setTag(1);
            this.node.runAction(ac);
        }
    },

    updatePos: function()
    {

    }

});
