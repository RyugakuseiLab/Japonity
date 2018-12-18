import MatchingModel from './MatchingModel.js'

// firebase init
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

// 待機する秒数を指定
const limitTime = 5
let currentTime = 0
let myId = ''
let myCardData = ''

console.log('test')

$('#match-button').on('click', function () {
  console.log('Button Clicked!')
  const userInfo = getUserInfo()
  let searchFlag = true

  const queryInfo = waitUserRef
    .where('lang', '==', userInfo.lang)
    .where('level', '==', userInfo.level)

  // TODO: valがなかったら追加
  console.log('fbval')

  matchArgorithm()
  async function matchArgorithm () {
    console.log('test()起動！')
    const data = await queryInfo.get()
    console.log('datanum = ' + data.docs.length)
    if (data.docs.length === 0) {
      myId = await addInfoToFB(userInfo)
      console.log('myId: ', myId)
      waitTillMatching()
    } else {
      const matchResult = data.docs.some(el => {
        const docData = el.data()
        console.log(`You (${userInfo.userId}) and ${docData.user_id} are matched!`)
        console.log(`Try Connection...\nRoom ID: ${docData.roomid}`)
        // 接続テスト if false 続ける
        // return true
        // TODO: 相手がログインしているかどうかチェック（skywebで接続テスト）
        // connectToSkyWeb()
        const connectResult = true
        if (connectResult) {

        } else {

        }
      })
      console.log('matchResult', matchResult)

      // TODO:全てとマッチしなかった場合
      // if (!matchResult) {
      if (!matchResult) {
        myId = await addInfoToFB(userInfo)
        console.log('myId: ', myId)
        waitTillMatching()
      }
    }
  }
})

async function waitTillMatching () {
  currentTime += 1
  console.log('Wait flag ' + currentTime)

  if (myCardData === '') {
    myCardData = await (() => {
      return new Promise((resolve, reject) => {
        waitUserRef.doc(myId).onSnapshot((doc) => {
          return resolve(doc.data())
        })
      })
    })()
    console.log(myCardData)
  }

  if (myCardData.match_user_id !== '') {
    console.log('マッチングしたよ！！！！')
    // TODO: モーダルを消す処理
  } else if (currentTime > limitTime) {
    console.log('マッチングしなかったよ')
    removeInfo(myId)
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

// const mm = new MatchingModel(userInfo)

function addInfoToFB (userInfo) {
  return new Promise((resolve, reject) => {
    waitUserRef.add({
      user_id: userInfo.userId,
      match_user_id: '',
      lang: userInfo.lang,
      level: userInfo.level,
      roomid: 'hogehogehogehoge'
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
