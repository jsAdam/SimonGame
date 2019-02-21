$(document).ready(function(){
    var STARTED = false;
    var COLOR = true;
    var SOUND = false;
    var STRICT = false;
    var RUNNING = false;
    var PLAYER_TURN = false;
    var CURRENTORDER = [];
    var PLAYERORDER = [];
    var sounds = [
        "https://s3.amazonaws.com/freecodecamp/simonSound1.mp3",
        "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3",
        "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3",
        "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"
    ];
    
    $("#victory").toggle();
    $("#color div").toggleClass("blue");
    $("#sound").on("click", function(e){
        e.preventDefault();
        e.stopPropagation();
        var target = $(this);
        SOUND = !SOUND;
        target.find("div").toggleClass("blue");
    })
    
    $("#strict").on("click", function(e){
        e.preventDefault();
        e.stopPropagation();
        var target = $(this);
        STRICT = !STRICT;
        target.find("div").toggleClass("blue");
    })
    
    $("#color").on("click", function(e){
        e.preventDefault();
        e.stopPropagation();
        var target = $(this);
        COLOR = !COLOR;
        target.find("div").toggleClass("blue");
        $(".game-button").toggleClass("grey");
    })
    
    var screenRefresh = setInterval(function(){
        $("#screen div").toggle();
    }, 800);
    
    $("#start").on("click", function(){
        clearInterval(screenRefresh);
        
        if(!STARTED){
            STARTED = true;
            $("#screen div").css("display", "block");
            $(".game-button").addClass("player-click");
            runSimon();
        } else {
            reset(true);
            $(".game-button").hover(function(){
                $(this).css("cursor", "pointer");
            });
            runSimon();
        }
    });
    
    $(".game-button").on("click", function(e){
        var target = $(e.target);
        if(PLAYER_TURN == true){
            var wrong = false;
            var num = target.attr("id");
            PLAYERORDER.push(num);
            
            if(SOUND){
                playSound(num-1);
            }
            var i = PLAYERORDER.length-1;
            
            if(COLOR){
                var colorButton = $(`#${CURRENTORDER[i]}`);
                var color = colorButton.data("color");
                console.log(`${color}.light`);
                colorButton.addClass(`${color}-light`);

                makeColorNormal(i);
            } else {
                var colorButton = $(`#${CURRENTORDER[i]}`);
                colorButton.addClass("grey-light");

                makeColorNormal(i, true);
            }
            
            //console.log(PLAYERORDER[i] )
            if(!(PLAYERORDER[i] == CURRENTORDER[i])){
                wrong = true;
                showError(false);
                PLAYER_TURN = false;
                console.log("DONEE");
                $(".game-button").removeClass("player-click");
                PLAYERORDER = [];
                
                if(!STRICT){
                    setTimeout(runSameSimon, 1200);
                } else {
                    setTimeout(reset, 1200, true);
                    setTimeout(runSimon, 2000);
                }
                
            }
            
            if(PLAYERORDER.length == 20){
                wrong = true;
                reset(false);
                victoryAnimation();
                setTimeout(endAnimation, 10000);
            }
            
            if(PLAYERORDER.length == CURRENTORDER.length && !wrong){
                $(".game-button").removeClass("player-click");
                PLAYERORDER = [];
                runSimon();
            }
        }
    })
    
    function victoryAnimation(){
        $("#victory").toggle();
        $("#game").animate({
            "grid-row-gap": "200px"
        }, 500, function(){
            $("#victory").addClass("vic");
            $(".game-button").addClass("button-victory");
        });
    }
    
    function endAnimation(){
        $("#victory").toggle();
        $("#game").animate({
            "grid-row-gap": "10px"
        }, 500);
        $("#victory").removeClass("vic");
        $(".game-button").removeClass("button-victory");
    }
    
    function showError(reset){
        $("#screen div").text("! !");
        var flashing = setInterval(function(){
            $("#screen div").toggle();
        }, 200);
        if(reset){
            setTimeout(function(){
                clearInterval(flashing);
                $("#screen div").text("--");
                $("#screen div").css("display", "block");            
            }, 1000);
        } else {
            setTimeout(function(){
                clearInterval(flashing);
                $("#screen div").text(CURRENTORDER.length);
                $("#screen div").css("display", "block");            
            }, 1000);
        }
    }
    
    function reset(started){
        $("#screen div").text("--");
        STARTED = started;
        RUNNING = false;
        PLAYER_TURN = false;
        CURRENTORDER = [];

        PLAYERORDER = [];
    }
    
    function runSimon(){
        RUNNING = true;
        var r = Math.floor(Math.random()*4)+1;
        CURRENTORDER.push(r);
        
        var i = 0;
        function myLoop(){
            setTimeout(function(){
                $("#screen div").text(CURRENTORDER.length);
                
                if(COLOR){
                    var colorButton = $(`#${CURRENTORDER[i]}`);
                    var color = colorButton.data("color");
                    console.log(`${color}.light`);
                    colorButton.addClass(`${color}-light`);

                    makeColorNormal(i);
                } else {
                    var colorButton = $(`#${CURRENTORDER[i]}`);
                    colorButton.addClass("grey-light");
                    
                    makeColorNormal(i, true);
                }
                
                if(SOUND){
                    playSound(CURRENTORDER[i]-1);
                }
                
                i++;
                if(i < CURRENTORDER.length){
                    myLoop();
                } else {
                    RUNNING = false;
                    PLAYER_TURN = true;
                    console.log("DONEE");
                    $(".game-button").addClass("player-click");
                }
            }, 1000);
        }
        myLoop();
    }
    
    function playSound(i){
        var audio = new Audio(`${sounds[i]}`); // define your audio
        audio.play();
    }
    
    function runSameSimon(){
        RUNNING = true;
        
        var i = 0;
        function myLoop(){
            setTimeout(function(){
                $("#screen div").text(CURRENTORDER.length);
                
                if(COLOR){
                    var colorButton = $(`#${CURRENTORDER[i]}`);
                    var color = colorButton.data("color");
                    console.log(`${color}.light`);
                    colorButton.addClass(`${color}-light`);

                    makeColorNormal(i);
                } else {
                    var colorButton = $(`#${CURRENTORDER[i]}`);
                    colorButton.addClass("grey-light");
                    
                    makeColorNormal(i, true);
                }
                
                if(SOUND){
                    playSound(CURRENTORDER[i]-1);
                }
                
                i++;
                if(i < CURRENTORDER.length){
                    myLoop();
                } else {
                    RUNNING = false;
                    PLAYER_TURN = true;
                    $(".game-button").addClass("player-click");
                }
            }, 1000);
        }
        myLoop();
    }
    
    function makeColorNormal(i, grey){
        if(!grey){
            setTimeout(function(){
                var colorButton = $(`#${CURRENTORDER[i]}`);
                var color = colorButton.data("color");
                console.log(`${color}.light`);
                colorButton.removeClass(`${color}-light`);
            }, 500);
        } else {
            setTimeout(function(){
                var colorButton = $(`#${CURRENTORDER[i]}`);
                colorButton.removeClass(`grey-light`);
            }, 500);
        }
    }
});