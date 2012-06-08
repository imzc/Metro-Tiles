/// <reference path="../Scripts/jquery-1.4.1.js" />

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
            total = option.speed || 200,
            steps = 20,
            currentStep = 0,
            effect = option.effect || "flip",
            items = option.items,
            waitTime = option.waitTime || 3000;

    effect = zx.metro.tile.effects[effect] || zx.metro.tile.effects.flip;
    var eft = new effect(option);

    function move() {
        $(items[0]).css(eft.getStyle(time, total));
        $(items[1]).css(eft.getStyle(time, total, true));
    };

    this.play = function () {
        go();
        setInterval(function () {
            if (currentStep <= 0) {
                go();
            }
            else if (currentStep >= steps) {
                back();
            }
        }, waitTime);
    };

    go = function () {
        var timer = setInterval(function () {
            currentStep++;
            time = currentStep / steps * total;
            move();
            if (currentStep == steps)
                clearInterval(timer);
        }, total / steps);
    }


    back = function () {
        var timer = setInterval(function () {
            currentStep--;
            time = currentStep / steps * total;
            move();
            if (currentStep <= 0)
                clearInterval(timer);
        }, total / steps);
    }
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

$.fn.extend({
    zxTile: function () {
        var items = $(this).children();
        var player = new zx.metro.tile.Player({
            items: items
        });
        player.play();
    }
});

$(function () {
    $(".zxMetroTile").zxTile();
})