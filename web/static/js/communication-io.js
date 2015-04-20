
// Serveur Sockets

var Communication = {
	namespace : '/api',	
    socket : null,
    get : function() {
        if(this.socket == null){
            this.init();
        }
        return this.socket;
    },
    init : function() {
        if(this.socket == null){
            this.socket = io.connect('http://' + document.domain + ':' + location.port + this.namespace);
        }
    },
    on : function(event, callback){
        if(socket != null){
            socket.on(event, function() {
                callback(socket)
            });
        }
    }
}