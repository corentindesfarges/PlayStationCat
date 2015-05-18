;(function(context) {

    var axeX = $('.xaxis'), axeY = $('.yaxis');
    var minX = parseInt(axeX.attr('min')), maxX = parseInt(axeX.attr('max'));
    var minY = parseInt(axeY.attr('min')), maxY = parseInt(axeY.attr('max'));

    Communication.get();

    var LocStorage = function(){
        this.storage = null;
        this.isAvailable;
        this._init = function(){
            this.storage = context.localStorage == 'undefined' ? null : context.localStorage;
            this.isAvailable = this.storage == null;
        }

        this.get = function(key){
            if(!this.isAvailable)
                return null;
            return this.storage.getItem(key);
        }

        this.put = function(key, values){
            if(!this.isAvailable)
                return null;
            this.storage.setItem(key, value);
        }
        this._init();
    }

    var updateAxis = function() {
        Communication.get().emit('set.servos', {
            xaxis : axeX.val(),
            yaxis : axeY.val(),
        });
    };
    
    var btnLeft,
        btnRight,
        btnUp,
        btnDown,
        modeRecording = false,
        recordKeyList = [],
        recordList = [];

    function setupArrows(){
        btnLeft = $('#moveLeft'), 
        btnRight = $('#moveRight'),
        btnUp = $('#moveUp'),
        btnDown = $('#moveDown');
        
        btnLeft.click(function() {
            doLeft();
        });
        btnRight.click(function() {
            doRight();
        });
        btnUp.click(function() {
            doUp();
        });
        btnDown.click(function() {
            doDown();
        });
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
        doChange(axeX, "l",Math.max(minX, Number(axeX.val()) + val), update);
    }

    function doRight(val, update){
        val = val ? val : 5;
        doChange(axeX, "r",Math.max(minX, Number(axeX.val()) - val), update);
    }

    function doDown(val, update){
        val = val ? val : 5;
        doChange(axeY, "d",Math.max(minY, Number(axeY.val()) + val), update);
    }

    function doUp(val, update){
        val = val ? val : 5;
        doChange(axeY, "u",Math.max(minY, Number(axeY.val()) - val), update);
    }

    function doChange(axis, dir, val, update) {
        var btnPushed;
        switch(dir){
            case 'l':
                btnPushed = btnLeft;
                break;
            case 'u':
                btnPushed = btnUp;
                break;
            case 'r':
                btnPushed = btnRight;
                break;
            case 'd':
                btnPushed = btnDown;
                break;
        }

        btnPushed.addClass('pushed');
        setTimeout(function(){
            btnPushed.removeClass('pushed');
        }, 200);

        if(modeRecording) {
            recordKeyList.push(dir);

            return;
        }

        axis.val(val);
        if(update == undefined || update === true)
            updateAxis();  
    }

    Communication.get().on('get_servos_evt', function(data){
        if(data){
            $('.xaxis').val(data.xaxis);
            $('.yaxis').val(data.yaxis);
        }
    });

    var laserwaySection = $("#laserway");

    laserwaySection.find('.record').click(function(){
        if(modeRecording === false) {
            // Début de l'enregistrement
            $(this).attr('data-text', $(this).html()).html('<span class="glyphicon glyphicon-stop"></span> Arrêter l\'enregistrement');
            $(this).find('.bg-info').removeClass('hidden');
            modeRecording = true;
        } else {
            // Fin de l'enregistrement
            $(this).html($(this).attr('data-text'));
            var nom = prompt("Entrez un nom pour cette enregistrement", "Chemin " + (recordList.length + 1));
            if(nom !== null) {
                recordList.push({
                    name : nom,
                    directions : [].concat(recordKeyList)
                });
                LocStorage().put('laserway', recordList);

                renderRecordList();
            }

            $(this).find('.bg-info').addClass('hidden');
            recordKeyList = [];
            modeRecording = false;
        }
    });

    laserwaySection.find('.saved-ways').click(function(){
        Communication.get().emit('playrandomway', {
            'directions' : []
        });
    });   

    var renderRecordList = function(){
        laserwaySection.find('table tbody').empty()
        for(var i = 0; i < recordList.length; i++){
            var rec = recordList[i],
                node = $('<tr><td>'+rec.name+'</td><td><button class="btn btn-success">Lancer</button></td></tr>');

            node.find('button').bind('click', function(){
                Communication.get().emit('playrandomway', {
                    'directions' : rec.directions
                });
            });
            laserwaySection.find('table').removeClass('hidden').find('tbody').append(node);
        }
    }

    var locStoreRecordList = LocStorage().get('laserway');
    if(locStoreRecordList != null)
        recordList.concat(locStoreRecordList);

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
    });
    
    $("#btn_config").on('click', function(){
        $('#videoConfig').toggleClass('hidden');
        $(this).toggleClass('btn-success', !$('#videoConfig').hasClass('hidden'));  
    })

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
                video.attr('src', updateVideoLink());
            }
        }
    });

    $('.play-sound').click(function(){
        var name = $(this).attr('data-name');

        Communication.get().emit('playsound', {
            what : name
        });
    });

    Communication.get().on('played_sound', function(data){
        var audio = new Audio('/static/sound/'+data);
            audio.play();
    })

    var gamepad = new Gamepad();
    gamepad.deadzone = 0.08;
    
    gamepad.bind(Gamepad.Event.CONNECTED, function(device) {
        console.log("Connection : " + device.id);
    });

    gamepad.bind(Gamepad.Event.DISCONNECTED, function(device) {
        console.log("Disconnection : " + device.id);
    });

    var time = new Date().getTime();
    var interval = 500;

    gamepad.bind(Gamepad.Event.AXIS_CHANGED, function(e) {
        console.log(e.axis, e.value);
        var valChanged = false;
        if(e.axis == 'LEFT_STICK_X' && (e.value > 0.3 || e.value < -0.3)){
            if(e.value > 0)
                doRight(parseInt(e.value * 5));
            else
                doLeft(parseInt(-e.value * 5));
            valChanged = true;
        }
        if(e.axis == 'LEFT_STICK_Y' && (e.value > 0.3 || e.value < -0.3)){
            if(e.value > 0)
                doDown(parseInt(e.value * 5));
            else
                doUp(parseInt(-e.value * 5));
            valChanged = true;
        }
    });

    if (!gamepad.init()) {
        alert('Si vous souhaitiez utiliser un GamePad de type PS3 ou Xbox, veuillez changer de navitageur.');
    }

})(window);
