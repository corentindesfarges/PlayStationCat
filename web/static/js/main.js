;(function(context) {

    var axeX = $('.xaxis'), axeY = $('.yaxis');
    var minX = parseInt(axeX.attr('min')), maxX = parseInt(axeX.attr('max'));
    var minY = parseInt(axeY.attr('min')), maxY = parseInt(axeY.attr('max'));

    Communication.get();

    var updateAxis = function() {
        Communication.get().emit('set.servos', {
            xaxis : axeX.val(),
            yaxis : axeY.val(),
        });
    };
    
    function setupArrows(){
        var btnLeft = document.getElementById('moveLeft'), 
            btnRight = document.getElementById('moveRight'),
            btnUp = document.getElementById('moveUp'),
            btnDown = document.getElementById('moveDown');
        
        btnLeft.onclick = function() {
            doLeft();
        };
        btnRight.onclick = function() {
            doRight();
        };
        btnUp.onclick = function() {
            doUp();
        };
        btnDown.onclick = function() {
            doDown();
        };
    }
    setupArrows();

    $(window).on('keydown', function(evt){
        var k = evt.keyCode;
        switch(k){
            case 37:
                doLeft();
                evt.preventDefault();
                break;
            case 38:
                doUp();
                evt.preventDefault();
                break;
            case 39:
                doRight();
                evt.preventDefault();
                break;
            case 40:
                doDown();
                evt.preventDefault();
                break;
        };
    });

    function doLeft(val, update){
        val = val ? val : 5;
        axeX.val(Math.min(maxX, Number(axeX.val()) + val));
        if(update == undefined || update === true)
        updateAxis();  
    }

    function doRight(val, update){
        val = val ? val : 5;
        axeX.val(Math.max(minX, Number(axeX.val()) - val));
        if(update == undefined || update === true)
            updateAxis();   
    }

    function doDown(val, update){
        val = val ? val : 5;
        axeY.val(Math.min(maxY, Number(axeY.val()) + val));
        if(update == undefined || update === true)
            updateAxis();   
    }

    function doUp(val, update){
        val = val ? val : 5;
        axeY.val(Math.max(minY, Number(axeY.val()) - val));
        if(update == undefined || update === true)
            updateAxis();  
    }

    $('#calibrationStep').hide();


    Communication.get().on('get_servos_evt', function(data){
        if(data){
            $('.xaxis').val(data.xaxis);
            $('.yaxis').val(data.yaxis);
        }
    });
    Communication.get().on('target_evt', function(data){
        updateServos();
    });
        

    var updateServos = function() {
        Communication.get().emit('get.servos');
    };

    var video = $('#video img').first();
    var videoLoad = $.Deferred();
    window.setTimeout(function() {
        videoLoad.resolve('ready');
    }, 2000);
    video.load(function() {
        videoLoad.resolve('loaded');
    });

    videoLoad.promise().then(function(data){
        video.parent().addClass('ready');
    }).then(function(data){
        video.parent().removeClass('ready');
        $('#calibrationStep').show();
    });
    
    // Wait for the video image to load, then setup calibration.
    videoLoad.done(function() {
        calibration.setup('calibrateLayer', video.width(), video.height());
    });

    // Send target commands based on click locations
    $('#calibrateLayer').click(function(ev) {
        if (!calibration.isCalibrating()) {
            Communication.get().emit('target', {
                x : ev.offsetX,
                y : ev.offsetY,
            });
        }
    });

    var mouseDown = false;
    $('#calibrateLayer').mousedown(function(ev) {
        mouseDown = true;
    });

    $('#calibrateLayer').mouseup(function(ev) {
        mouseDown = false;
    });

    var timer = true;
    $('#calibrateLayer').mousemove(function(ev) {
        if (!calibration.isCalibrating() && mouseDown && timer) {
            timer = false;
            setTimeout(function(){
                timer = true;
            }, 500);
            Communication.get().emit('target', {
                x : ev.offsetX,
                y : ev.offsetY,
            });
        }
    });


    var ipAdressIn = $('#ip_adress');
    var portIn = $('#port');
    var uriIn = $('#uri');

    ipAdressIn.keyup(updateVideoLink);
    portIn.keyup(updateVideoLink);
    uriIn.keyup(updateVideoLink);

    $('#videoForm').submit(function(evt){
        evt.preventDefault();

        var link = updateVideoLink()
        video.attr('src', link);
        video.load(function(){
            calibration.setup('calibrateLayer', video.width(), video.height());
        });
        Communication.get().emit('set.videoconf', {
            ipadress : ipAdressIn.val(),
            port : portIn.val(),
            uri : uriIn.val()
        });
    });

    function updateVideoLink(){
        var link = 'http://' + ipAdressIn.val() + ':' + portIn.val() + uriIn.val();
        $('#videoLink').text(link);
        return link;
    }
    updateVideoLink();

    Communication.get().on('new_videoconf_evt', function(data){
        if(data){
            if((ipAdressIn.val() != data.ipadress || portIn.val() != data.port || uriIn.val() != data.uri) && confirm('Une nouvelle configuration de la vidéo est disponible ('+'http://' + data.ipadress + ':' + data.port + data.uri +'), voulez-vous l\'appliquer ?')){
                ipAdressIn.val(data.ipadress);
                portIn.val(data.port);
                uriIn.val(data.uri);
                updateVideoLink();
                video.attr('src', link);
            }
        }
    })

    var gamepad = new Gamepad();
    gamepad.deadzone = 0.08;
    console.log(gamepad);
    
    gamepad.bind(Gamepad.Event.CONNECTED, function(device) {
        console.log("Connection :" + device.id);
    });

    gamepad.bind(Gamepad.Event.DISCONNECTED, function(device) {
        console.log("Disconnection :" + device.id);
    });

    var time = new Date().getTime();
    var interval = 500000;

    gamepad.bind(Gamepad.Event.AXIS_CHANGED, function(e) {
        console.log(e.axis, e.value);
        var valChanged = false;
        if(e.axis == 'LEFT_STICK_X' && (e.value > 0.1 || e.value < -0.1)){
            if(e.value > 0)
                doDown(parseInt(e.value * 10), false);
            else
                doUp(parseInt(-e.value * 10), false);
            valChanged = true;
        }
        if(e.axis == 'LEFT_STICK_Y' && (e.value > 0.1 || e.value < -0.1)){
            if(e.value > 0)
                doRight(parseInt(e.value * 10), false);
            else
                doLeft(parseInt(-e.value * 10), false);
            valChanged = true;
        }
        console.log(time);
        if(new Date().getTime() > time + interval && valChanged){
            updateAxis();
            console.log(axeY, axeX);
            time = new Date().getTime();
        }
    });

    if (!gamepad.init()) {
        alert('Si vous souhaitiez utiliser un GamePad de type PS3 ou Xbox, veuillez changer de navitageur.');
    }

})(window);
