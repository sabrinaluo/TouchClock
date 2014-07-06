/**
 * Created by Sabrina on 14-7-4.
 */

$(document).ready(function () {
    var c = document.getElementById('myCanvas');
    var width = window.innerWidth;
    var height = window.innerHeight;
    c.width = width;
    c.height = height;
    var ctx = c.getContext("2d");
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    var pi = Math.PI;
    var frameRate = 100;

    function rgb(r, g, b) {
        var arr = [Math.floor(r), Math.floor(g), Math.floor(b)];
        return 'rgb(' + arr.toString() + ')';

    }

    var Dot = function () {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.toX = 0;
        this.toY = 0;
        this.color = Math.random() * 200 + 55;
        this.size = Math.random() * 5 + 1;//0
        this.toSize = Math.random() * 9 + 1;
        this.r = 0;
        this.g = 0;
        this.b = 0;
        this.toR = 0;
        this.toG = 0;
        this.toB = 0;
        this.rBuff = 0;
        this.gBuff = 0;
        this.bBuff = 0;
        this.speedX = 0;
        this.speedY = 0;


    };
    Dot.prototype.paint = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 2 * pi);
        ctx.fillStyle = rgb(this.r, this.g, this.b);
        ctx.fill();
    };

    var clkDotsIndex = {
        start: 0,
        end: 12
    };
    var sHandDotsIndex = {
        start: clkDotsIndex.end,
        end: clkDotsIndex.end + 7
    };
    var mHandDotsIndex = {
        start: sHandDotsIndex.end,
        end: sHandDotsIndex.end + 5
    };
    var hHandDotsIndex = {
        start: mHandDotsIndex.end,
        end: mHandDotsIndex.end + 3
    };
    var dots = [];
    for (var i = 0; i < hHandDotsIndex.end; i++) {
        dots[i] = new Dot();
        var d = dots[i];
        d.toX = d.x;
        d.toY = d.y;

    }


    var circleClock = {
        st: function () {
            var r = width > height ? height * 0.4 : width * 0.4;
            var alpha = 0;
            for (var i = clkDotsIndex.start; i < clkDotsIndex.end; i++) {
                var d = dots[i];
                d.toR = 255;
                d.toG = 255;
                d.toB = 255;
                d.toX = r * Math.cos(alpha) + width / 2;
                d.toY = r * Math.sin(alpha) + height / 2;
                d.toSize = Math.random() * (i % 3 == 0 ? 9 : 5) + 1;//3,6,9,12 o'clock have big size dots
                alpha += 2 * pi / (clkDotsIndex.end - clkDotsIndex.start);
            }
            function Hand(dotsIndex, beta, len, dotSize, dotR, dotG, dotB) {
                var rHand = 0;
                for (var i = dotsIndex.start; i < dotsIndex.end; i++) {
                    var d = dots[i];
                    d.toX = rHand * Math.cos(beta) + width / 2;
                    d.toY = rHand * Math.sin(beta) + height / 2;
                    d.toSize = dotSize;
                    d.toR = dotR;
                    d.toG = dotG;
                    d.toB = dotB;

                    rHand += len / (dotsIndex.end - dotsIndex.start);
                }
            }

            var t = new Date();
            var ms = t.getMilliseconds();
            var s = t.getSeconds();
            var m = t.getMinutes();
            var h = t.getHours();
            Hand(hHandDotsIndex, -pi / 2 + 2 * pi / 12 / 60 * (m + h * 60), r * 0.55, 5, 255, 255, 255);//hour
            Hand(mHandDotsIndex, -pi / 2 + 2 * pi / 60 / 60 * (s + m * 60), r * 0.75, 4, 255, 255, 255);//minute
            Hand(sHandDotsIndex, -pi / 2 + 2 * pi / 60 / 1000 * (ms + s * 1000), r * 0.9, 3, 255, 255, 255);//second

        },
        paint: function () {
            return setInterval(function () {
                circleClock.st();
                ctx.clearRect(0, 0, width, height);
                ctx.fillStyle = '#000000';
                ctx.fillRect(0, 0, width, height);
                for (var i = 0; i < dots.length; i++) {
                    var d = dots[i];
                    d.x = d.toX;
                    d.y = d.toY;
                    d.size = d.toSize;
                    d.r = d.toR;
                    d.g = d.toG;
                    d.b = d.toB;
                    d.paint();
                }
            }, frameRate);
        }
    };

    //drift
    var drift = {
        st: function () {
            for (var i = 0; i < dots.length; i++) {
                var d = dots[i];
                d.speedX = (Math.random() - 0.5) * 5;
                d.speedY = (Math.random() - 0.5) * 5;
                d.size = Math.random() * 4 + 1;
                d.toR = Math.random() * 255;
                d.toG = Math.random() * 255;
                d.toB = Math.random() * 255;
            }
        },
        paint: function () {
            drift.st();
            return setInterval(function () {
                ctx.clearRect(0, 0, width, height);
                ctx.fillStyle = '#000000';
                ctx.fillRect(0, 0, width, height);
                for (var i = 0; i < dots.length; i++) {
                    var d = dots[i];
                    if (d.x > width) {
                        d.x = 0;
                        d.toX = 0;
                    } else if (d.x < 0) {
                        d.x = width;
                        d.toX = width;
                    } else if (d.y > height) {
                        d.y = 0;
                        d.toY = 0;
                    } else if (d.y < 0) {
                        d.y = height;
                        d.toY = height;
                    }
                    d.x = d.toX;
                    d.y = d.toY;
                    d.toSize = Math.random() * 8 + 1;
                    d.size = d.toSize;
                    d.toX += d.speedX;
                    d.toY += d.speedY;
                    d.r = d.toR;
                    d.g = d.toG;
                    d.b = d.toB;
                    d.paint();
                }
            }, frameRate);
        }
    };

    var trans = {
        st: function () {
            circleClock.st();
            for (var i = 0; i < dots.length; i++) {
                var d = dots[i];
                d.speedX = (d.toX - d.x) / (delay / frameRate);
                d.speedY = (d.toY - d.y) / (delay / frameRate);
                d.rBuff = (d.toR - d.r) / (delay / frameRate);
                d.gBuff = (d.toG - d.g) / (delay / frameRate);
                d.bBuff = (d.toB - d.b) / (delay / frameRate);
                d.toX = d.x;
                d.toY = d.y;
                d.toR = d.r;
                d.toG = d.g;
                d.toB = d.b;
            }
        },
        paint: function () {
            trans.st();
            return setInterval(function () {
                ctx.clearRect(0, 0, width, height);
                ctx.fillStyle = '#000000';
                ctx.fillRect(0, 0, width, height);
                for (var i = 0; i < dots.length; i++) {
                    var d = dots[i];
                    d.toX += d.speedX;
                    d.toY += d.speedY;
                    d.x = d.toX;
                    d.y = d.toY;
                    d.toR += d.rBuff;
                    d.toG += d.gBuff;
                    d.toB += d.bBuff;
                    d.r = d.toR;
                    d.g = d.toG;
                    d.b = d.toB;
                    d.paint();
                }
            }, frameRate);
        }
    };

    var cleanInt;
    var cleanOut;
    cleanInt = drift.paint();
    var t1 = 0;
    var t2 = new Date();
    var timer = t2 - t1;
    var delay = 500;
    var touchCount = 0;

    $('#myCanvas').mousedown(function () {
        if (!touchCount == 0) {
            t1 = new Date();
            timer = Math.abs(t1 - t2);
        }
        switch (true) {
            case timer < 1500:
                delay = 100;
                break;
            case  ( timer >= 1500 && timer < 10000):
                delay = 300;
                break;
            case timer >= 10000:
                delay = 500;

        }
        clearInterval(cleanInt);
        cleanInt = trans.paint();

        cleanOut = setTimeout(function () {
            clearInterval(cleanInt);
            cleanInt = circleClock.paint();
            console.log(delay);
            console.log(timer);
        }, delay);
    }).mouseup(function () {
        touchCount++;
        t2 = new Date();
        clearInterval(cleanInt);
        clearTimeout(cleanOut);
        cleanInt = drift.paint();
    });
});

