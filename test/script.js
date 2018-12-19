$(function(){

let localStream = null;
let peer = null;
let existingCall = null;

//getUserMediaに必要な処理を追加する
    navigator.mediaDevices.getUserMedia({video: true, audio: true})
        .then(function (stream) {
            $('#myStream').get(0).srcObject = stream;
            localStream = stream;
        }).catch(function (error) {
            console.error('mediaDevice.getUserMedia() error:', error);
            return;
        });

//Peerオブジェクトを作成
    peer = new Peer({
        key: '[skyway_API_Key]',
        debug: 3
    });

//PeerオブジェクトのEventListenerを追加
    peer.on('open', function(){
        $('#my-id').text(peer.id);//??peer.idの任意発行するには
    });
    
    peer.on('call', function(call){
        call.answer(localStream);
        setupCallEventHandlers(call);
    });
    
    peer.on('error', function(err){
        alert(err.message);
    });

//モーダルの通話btnでidフォーム入力し、電話かける
    $("#tel").on("click",function(){
        console.log(peer.id);
        //!!マッチング処理をfireStoreやり取得、#peer-idに書き込む

        $('#peer-id').val('xABkjK8kHnG9cNJp');//入力
        const call = peer.call($('#peer-id').val(), localStream);//電話かける1
        setupCallEventHandlers(call);//電話かける2
    })

//発信、切断処理の為の処理を追加する
    $('#make-call').submit(function(e){
        e.preventDefault();
        const call = peer.call($('#peer-id').val(), localStream);
        setupCallEventHandlers(call);
    });
    
    $('#end-call').click(function(){
        existingCall.close();
    });

//CallオブジェクトのEventListenerを追加する
    function setupCallEventHandlers(call){
        if (existingCall) {
            existingCall.close();
        };
    
        existingCall = call;
    
        call.on('stream', function(stream){
            addVideo(call,stream);
            setupEndCallUI();
            $('#connected-peer-id').text(call.remoteId);
        });
    
        call.on('close', function(){
            removeVideo(call.remoteId);
            setupMakeCallUI();
        });
    }

//必要な関数を準備する
    function addVideo(call,stream){
        const videoDom = $('<video autoplay playsinline>');
        videoDom.attr('id',call.remoteId);
        videoDom.get(0).srcObject = stream;
        $('.videosContainer').append(videoDom);
    }

    function removeVideo(peerId){
        $('#'+peerId).remove();
    }

    function setupMakeCallUI(){
        $('#make-call').show();
        $('#end-call').hide();
    }

    function setupEndCallUI() {
        $('#make-call').hide();
        $('#end-call').show();
    }
});