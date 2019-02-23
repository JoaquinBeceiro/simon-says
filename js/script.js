let clicksCounter = 0;
let sequence = [];
let speed = 1500;

const buttons = {
    "a" : {
        "color":        "#0b7000",
        "highlight":    "#1aff00",
        "sound":        "http://www.chiptape.com/chiptape/sounds/medium/Sound17.wav",
    },
    "b" : {
        "color":        "#c30800",
        "highlight":    "#ff0b00",
        "sound":        "http://www.chiptape.com/chiptape/sounds/medium/R2chirp.wav",
    },
    "c" : {
        "color":        "#c3b400",
        "highlight":    "#ffec00",
        "sound":        "http://www.chiptape.com/chiptape/sounds/medium/click.wav",
    },
    "d" : {
        "color":        "#196d85",
        "highlight":    "#29abd0",
        "sound":        "http://www.chiptape.com/chiptape/sounds/medium/bonus14.wav",
    },
}

$(document).ready(function() {


    $("#error button").on("click", async () => {
        $("#error").fadeOut();
        await waitFor(500);
        addToSequence();
    });

    $("#start").on( "click", async () => {

        playSound("http://www.chiptape.com/chiptape/sounds/medium/LETSGO.WAV")
        await waitFor(1500);
        addToSequence();
        $("#start").hide();
        $("#count").fadeIn();
    });

    buttonClick = async (e) =>{
        const target = $(e.target).attr("id");

        if( target == sequence[ clicksCounter ] ){

            animateOne( target );

            clicksCounter++;

            if( sequence.length == clicksCounter ) {
                await waitFor(1500);
                addToSequence();
            }

        } else {
            error();
            sequence = [];
        }

    }

    error = () => {
        $("#count").html( "😔" );
        $("#error").fadeIn();
        $("#error").css("display", "flex");
        playSound( "http://www.chiptape.com/chiptape/sounds/medium/SCREAM.wav")
    }


    addToSequence = () => {

        clicksCounter = 0;
        disableButtons();
        const rand =  generateRandom(0,3);
        const next = Object.keys(buttons)[ rand ];
        sequence.push( next );
        animateSequence();
        
    }

    animateOne = id => {


        const btn = $("#"+id);

        btn.css("border-color", buttons[id].highlight);

        playSound( buttons[id].sound )

        return new Promise( resolve => {
            return setTimeout( () => {
                btn.css("border-color", buttons[id].color);
                return setTimeout(resolve,speed )
            }, 200)
        })

        
    }

    animateSequence = async () => {

        if( sequence.length % 2 == 0 ) speed -= 100;

        $("#count").text( sequence.length )

        for (const e of sequence) {
            await animateOne( e );
        }

        enableButtons();

    }


    asyncForEach = async (array, callback) => {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
        }
    }

    playSound = sUrl => {
        const audio = $("#sound");
        $("#tune").attr("src", sUrl);
        audio[0].pause();
        audio[0].load();
        audio[0].play();
    }


    // TOOLS
    const disableButtons = () => { $(".button").unbind("click"); $(".button").css("cursor", "not-allowed") }
    const enableButtons = () => { $(".button").on("click", buttonClick); $(".button").css("cursor", "pointer") }
    const waitFor = (ms) => new Promise(r => setTimeout(r, ms));
    const generateRandom = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;


});