/// <reference path="../lib/jquery.js" />

var zx = zx || {};


$.extend(zx, {
    metro: {
        tile: {
            effects: {}
        }
    }
});

zx.metro.tile.Player = function (option) {
    option = option || {};
    var time = 0,
            total = option.speed || 400,
            steps = 40,
            currentStep = 0,
            effect = option.effect || "up",
            items = option.items,
            waitTime = option.waitTime || 4000;

    effect = zx.metro.tile.effects[effect] || zx.metro.tile.effects.up;
    var eft = new effect(option);

    function move() {
        $(items[0]).css(eft.getStyle(time, total));
        $(items[1]).css(eft.getStyle(time, total, true));
        console.log($(items[0]).text());
    };

    function go() {
        var timer = setInterval(function () {
            currentStep++;
            time = currentStep / steps * total;
            move();
            if (currentStep == steps)
                clearInterval(timer);
        }, total / steps);
    }


    function back() {
        var timer = setInterval(function () {
            currentStep--;
            time = currentStep / steps * total;
            move();
            if (currentStep <= 0)
                clearInterval(timer);
        }, total / steps);
    }


    this.play = function () {
        var startTime = Math.random() * 2000;
        setTimeout(function () {
            setInterval(function () {
                if (currentStep <= 0) {
                    go();
                }
                else if (currentStep >= steps) {
                    back();
                }
            }, waitTime);
        }, startTime)

        console.log(startTime)
    };
}

zx.metro.tile.effects.flip = function (options) {
    var defOptions = { on: "x" };
    $.extend(defOptions, options);
    options = defOptions;
    isSupport();
    function getTransform(x, y, z) {
        var name = "-" + zx.pfx + "-" + "transform";
        var val = "rotateX(" + x + "deg) rotateY(" + y + "deg) rotateZ(" + z + "deg)";
        var style = {};
        style[name] = val;
        return style;
    }
    this.getStyle = function (time, total, next) {
        var deg = time / total * 180;

        if (next)
            deg = deg - 180;

        var x = 0, y = 0, z = 0;
        switch (options.on) {
            case "x": x = deg; break;
            case "y": y = deg; break;
            case "z": z = deg; break;
            default: x = deg;
        }
        var style = getTransform(x, y, z);
        var display = (time < (total / 2) && !next) || (time > (total / 2) && next);
        style["display"] = display ? "" : "none";
        return style;
    }
    function isSupport() {
        var props = ['perspectiveProperty', 'WebkitPerspective',
                'MozPerspective', 'OPerspective', 'msPerspective'],
                i = 0,
                support = false;
        while (props[i]) {
            if (props[i] in document.body.style) {
                support = true;
                var pfx = props[i].replace('Perspective', '');
                zx.pfx = pfx.toLowerCase();
                break;
            }
            i++;
        }
        return support;
    }
};


zx.metro.tile.effects.fade = function (options) {
    isSupport();
    this.getStyle = function (time, total, next) {
        var o = time / total;

        if (next)
            o = 1 - o;
        var style = {
            opacity: o,
            display:""
        };
        return style;
    }
    function isSupport() {
        return true;
    }
};


zx.metro.tile.effects.up = function (options) {
    isSupport();
    var item = options.items[0];
    var height = $(item).height();
    this.getStyle = function (time, total, next) {
        var o = time / total * Math.PI;
        var top = (Math.cos(o) - 1) * height / 2;
        if (next)
            top = top + height;
        var style = {
            top: top,
            display: ""
        };
        return style;
    }
    function isSupport() {
        return true;
    }
};

$.fn.extend({
    zxTile: function () {
        this.each(function () {
            var items = $(this).children();
            var $this = $(this).css({
                overflow: "hidden"
            })
            $(items).css({
                position: "absolute",
                top: 0,
                left: 0,
                display: "none"
            });
            items[0].style.display = "";
            var player = new zx.metro.tile.Player({
                items: items,
                effect: $this.attr("data-effect") || "up",
                waitTime: $this.attr("data-waitTime")
            });
            player.play();
        })
    }
});

$(function () {
    $(".zxMetroTile").zxTile();
})