/*
	Bouncy Balls
    A Welcome Animation with GSAP
    Jonathan Harrison
    2019
*/

// ready
$(document).ready(function() {
    // get the container elements and run the welcome animation
	var animationContainer = $("#bbWelcomeAnimationContainer");
    var containerElement = document.getElementById("bbWelcomeAnimationContainer");
    welcome(animationContainer, containerElement);

});
// end ready


function welcome(animationContainer, containerElement) {

    // elements
    var welcome = $("#textWelcome");
    var to = $("#textTo");
    createBalls(containerElement, animationContainer.width());
    var balls = $(".bb-ball");

    // setup elements
    centerElement(welcome);
    TweenMax.set(welcome, { yPercent: -100 });
    centerElement(to);
    TweenMax.set(to, { yPercent: -100 });

    // lock scrolling on welcome animation container on iOS
    containerElement.addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, false);

    // main timeline
    var tl = new TimelineMax();
    tl.add("balls", 0.5)
    tl.add("welcome", 0.75);
    tl.add("to", 3);
    tl.add("finish", 4.25);
    
    /*
        Animate
    */

    // lock scrolling on non iOS and scroll page to top
    tl.set("html", { position: "fixed", overflow: "hidden" });

    // balls
    tl.add(launch(balls, animationContainer.height() + 100), "balls");

    // text
    tl.to(welcome, 0.5, { autoAlpha: 1, repeat: 1, repeatDelay: 1, yoyo: true }, "welcome");
    tl.to(to, 0.5, { autoAlpha: 1 }, "to");

    // unlock position for page layout before revealing main content
    tl.set("html", { position: "static" });

    // move welcome animation container off screen to reveal page
    tl.to(animationContainer, 1, { yPercent: -100, ease: Back.easeIn }, "finish");

    // fling balls up during animation container movement
    var finalYPositions = ["-=80", "-=90", "-=100", "-=120", "-=140", "-=150"];
    tl.staggerTo(balls, 0.5, { cycle: { y: function() {
        return "-=" + randomInt(80, 150);
    } } }, 0.001, "finish+=0.5");

    // unlock scrolling
    tl.set("html", { overflow: "auto" });

    // hide the animation container
    tl.set(animationContainer, { autoAlpha: 0 });

}

// animate the bouncy balls
function launch(elements, distance) {
    
    // duration based on distance
    var duration = Math.round((distance * 0.00025) * 100) / 100;
    var durationMin = 0.18;
    if (duration < durationMin) {
        duration = durationMin;
    }

    // array of slightly different distances
    var distances = [
        "-=" + distance * randomFloat(0.99, 1.05),
        "-=" + distance * randomFloat(0.99, 1.05),
        "-=" + distance * randomFloat(0.99, 1.05),
        "-=" + distance * randomFloat(0.99, 1.05)
    ];

    // animate
    var tl = new TimelineMax();
    tl.staggerFromTo(elements, duration, { autoAlpha: 1 }, { cycle: { y: distances }, immediateRender: false, ease: Linear.easeNone }, 0.01);
    tl.staggerTo(elements, 1, { y: 0, ease: Bounce.easeOut }, 0.015);

    return tl;
}

// create bouncy ball elements and append them to a parent container
function createBalls(parentContainer, width) {
    var numberOfBalls = Math.floor(width * 0.15);
    var maxBalls = 120;
    if (numberOfBalls > maxBalls) {
        numberOfBalls = maxBalls;
    }
    var widthMin = 15;
    var widthMax = 25;

    var c = document.createDocumentFragment();
    for (var i = 0; i < numberOfBalls; i++) {
        var e = document.createElement("div");
        var size = randomInt(widthMin, widthMax) + "px";
        var xPos = randomFloat(0, 100) + "%";
        var yPos = "100%";
        var colorClass = "bb-ball-color-1";
        var classNumber = randomInt(1,3);
        if (classNumber == 2) {
            colorClass = "bb-ball-color-2";
        }
        else if (classNumber == 3) {
            colorClass = "bb-ball-color-3";
        }
        e.className = "bb-ball " + colorClass;
        e.style.width = size;
        e.style.height = size;
        e.style.left = xPos;
        e.style.bottom = 0;
        e.style.visibility = "hidden";
        c.appendChild(e);
        TweenMax.set(e, { y: widthMax + 1 });
    }

    parentContainer.appendChild(c);
}


/*
    Utilities
*/
// place an element at the center of its parent
function centerElement(element, xAxisOnly) {
    if (xAxisOnly) {
        TweenMax.set(element, { left:'50%', xPercent:'-50' });
    }
    else {
        TweenMax.set(element, { left:'50%',top:'50%', xPercent:'-50',yPercent:'-50'});
    }
}
// return a random integer between 2 given ints
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
// return a random float between 2 given floats
function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}
