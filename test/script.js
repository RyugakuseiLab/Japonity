
$(function () {
  /* =====================
  グローバル変数宣言
  ===================== */

  // Skyway用
  let localStream = null
  let peer = null
  let existingCall = null

  // マッチング用
  const limitTime = 10
  let currentTime = 0
  let myDocId = ''

  /* =====================
  Skywayに関する処理
  ===================== */

  // getUserMediaに必要な処理を追加する
  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(function (stream) {
      $('#myStream').get(0).srcObject = stream
      localStream = stream
    }).catch(function (error) {
      console.error('mediaDevice.getUserMedia() error:', error)
    })

  // Peerオブジェクトを作成
  peer = new Peer({
    key: '8d060215-9da7-4e0f-85df-e7183436d57e',
    debug: 3
  })

  // PeerオブジェクトのEventListenerを追加
  peer.on('open', function () {
    $('#my-id').text(peer.id)// ??peer.idの任意発行するには
  })

  peer.on('call', function (call) {
    call.answer(localStream)
    setupCallEventHandlers(call)
  })

  peer.on('error', function (err) {
    alert(err.message)
  })

  // モーダルの通話btnでidフォーム入力し、電話かける
  $('#tel').on('click', function () {
    console.log(peer.id)
    // TODO:! !マッチング処理をfireStoreやり取得、#peer-idに書き込む
    currentTime = 0
    // TODO: RoomIDの取得
    matchArgorithm()
  })

  // 発信、切断処理の為の処理を追加する
  $('#make-call').submit(function (e) {
    e.preventDefault()
    const call = peer.call($('#peer-id').val(), localStream)
    setupCallEventHandlers(call)
  })

  $('#end-call').click(function () {
    existingCall.close()
  })

  // CallオブジェクトのEventListenerを追加する
  function setupCallEventHandlers (call) {
    if (existingCall) {
      existingCall.close()
    };

    existingCall = call

    call.on('stream', function (stream) {
      addVideo(call, stream)
      setupEndCallUI()
      $('#connected-peer-id').text(call.remoteId)
    })

    call.on('close', function () {
      removeVideo(call.remoteId)
      setupMakeCallUI()
    })
  }

  // 必要な関数を準備する
  function addVideo (call, stream) {
    const videoDom = $('<video autoplay playsinline>')
    videoDom.attr('id', call.remoteId)
    videoDom.get(0).srcObject = stream
    $('.videosContainer').append(videoDom)
  }

  function removeVideo (peerId) {
    $('#' + peerId).remove()
  }

  function setupMakeCallUI () {
    $('#make-call').show()
    $('#end-call').hide()
  }

  function setupEndCallUI () {
    $('#make-call').hide()
    $('#end-call').show()
  }

  /* =====================
  マッチングに関する処理
  ===================== */

  /* --------------------
  Firebaseの初期設定
  -------------------- */

  const config = {
    apiKey: 'AIzaSyDl7HHj8s3-C2Gzam7n491GRhMsLcGlTSE',
    authDomain: 'japanity-user-search.firebaseapp.com',
    databaseURL: 'https://japanity-user-search.firebaseio.com',
    projectId: 'japanity-user-search',
    storageBucket: '',
    messagingSenderId: '950912353878'
  }

  firebase.initializeApp(config)
  const db = firebase.firestore()
  db.settings({ timestampsInSnapshots: true })
  const waitUserRef = db.collection('wait_user')

  /* --------------------
  マッチング用のグローバル変数設定
  -------------------- */

  // $('#match-button').on('click', function () {
  //   console.log('Button Clicked!')
  //   currentTime = 0
  //   // TODO: RoomIDの取得
  //   matchArgorithm()
  // })

  async function matchArgorithm () {
    const userInfo = getUserInfo()

    const queryInfo = waitUserRef
      .where('lang', '==', userInfo.lang)
      .where('level', '==', userInfo.level)

    const data = await queryInfo.get()
    // console.log('datanum = ' + data.docs.length)
    if (data.docs.length === 0) {
      myDocId = await addInfoToFB(userInfo)
      // console.log('myId: ', myId)
      waitTillMatching()
    } else {
      const isMatch = data.docs.some(el => {
        const docData = el.data()
        if (docData.match_user_id === '') {
          console.log(`You (${userInfo.userId}) and ${docData.user_id} are matched!`)
          console.log(`Try Connection...\nRoom ID: ${docData.roomid}`)
          // TODO: 相手がログインしているかどうかチェック（skywebで接続テスト）
          connectToSkyWeb(docData.roomid)
          const connectResult = true
          if (connectResult) {
            console.log('相手のID: ' + docData.user_id)
            waitUserRef.doc(el.id).set({
              user_id: userInfo.userId,
              match_user_id: 'test' + Math.floor(Math.random() * 1000),
              lang: userInfo.lang,
              level: userInfo.level,
              roomid: peer.id // TODO: RoomIDに変更
            })
            return true
          }
        }
      })
      console.log('matchResult', isMatch)

      if (!isMatch) {
        myDocId = await addInfoToFB(userInfo)
        console.log('myId: ', myDocId)
        waitTillMatching()
      }
    }
  }

  async function waitTillMatching () {
    currentTime += 1
    console.log('Wait flag ' + currentTime)

    const myCardData = await (() => {
      return new Promise((resolve, reject) => {
        waitUserRef.doc(myDocId).onSnapshot((doc) => {
          return resolve(doc.data())
        })
      })
    })()
    console.log(myCardData)

    if (myCardData.match_user_id !== '') {
      console.log('Find your partner!')
      console.log('相手のID: ' + myCardData.match_user_id)
      removeInfo(myDocId)
    // TODO: モーダルを消す処理
    } else if (currentTime > limitTime) {
      console.log('Time over: no users matched...')
      removeInfo(myDocId)
    } else {
    // もう一度実行する
      setTimeout(waitTillMatching, 1000)
    }
  }

  function getUserInfo () {
    console.log('Get User Info...')
    const userInfo = {
    // TODO: userIdを引っ張ってくる
      userId: 'test' + Math.floor(Math.random() * 1000),
      lang: $('[name=select-lang]').val(),
      level: $('[name=select-level]').val()
    }
    console.log(userInfo)
    return userInfo
  }

  function addInfoToFB (userInfo) {
    return new Promise((resolve, reject) => {
      waitUserRef.add({
        user_id: userInfo.userId,
        match_user_id: '',
        lang: userInfo.lang,
        level: userInfo.level,
        roomid: peer.id
      })
        .then(function (docRef) {
          console.log('Regist Your data to Waiting list... \nID: ', docRef.id)
          return resolve(docRef.id)
        })
        .catch(function (error) {
          console.error('Error adding document: ', error)
        })
    })
  }

  function removeInfo (id) {
    console.log('Remove ID: ' + id)
    waitUserRef.doc(id).delete().then(function () {
      console.log(id + 'Document deleted!')
    }).catch(function (error) {
      console.error('Error removing document: ', error)
    })
  }

  function connectToSkyWeb (peerid) {
    $('#peer-id').val(peerid)// 入力
    const call = peer.call($('#peer-id').val(), localStream)// 電話かける1
    setupCallEventHandlers(call)// 電話かける2
  }
})
