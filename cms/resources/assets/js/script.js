// --------------------------------------------
// 音声を取得してテキストにする
// --------------------------------------------

// 終了用のフラグ
let flag = false;
let a = "";
// 音声登録のスタート
$("#listin").on("click", () => {

    // 終了ボタンの生成
    let btn_area = document.getElementById("btn_area");
    let stop_btn = document.createElement("button");
    stop_btn.setAttribute("id", "endbtn");
    stop_btn.innerHTML = "終了";
    btn_area.appendChild(stop_btn);

    // let btn_area = document.getElementById("btn_area");
    // btn_area.appendChild('<br><button id="endbtn" class="add">終了</button>');

    // $("#listin").after();

    flag = true;

    // Web Audio API インスタンス化
    var rec = new webkitSpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;


    // 取得する言語（※ここはデータベースから引っ張るようにする）
    rec.lang = 'ja-JP';

    // 外に取り出したいが取り出せない（音声テキスト用）


    // 取得した音声をテキストにする関数
    rec.onresult = (e) => {

        rec.stop();
        for (var i = e.resultIndex; i < e.results.length; ++i) {
            if (e.results[i].isFinal) {
                a += e.results[i][0].transcript;
            }
        }
        console.log(a);

    }

    // 終了ボタンを押した時の処理
    $('#endbtn').on('click', function () {
        console.log("押せてるよ");
        flag = false;

        // マイクの許可が出たら発火
        rec.onstart = () => {
            console.log('on start')
        };

        // 話始めたら発火
        rec.onspeechstart = () => {
            console.log('on speech start')
        };

        // 話終わったら発火
        rec.onspeechend = () => {
            console.log('on speech end')
        };

        // Web Audio APIを終了
        rec.onend = () => {
            console.log('on end')
        };

        console.log("終わったよ");
        flag = false;

        // テキストを吐き出す
        console.log("音声の結果" + a);
    });



    // 連続して取得するための処理
    rec.onend = () => {
        rec.start()
        console.log('re start')
    };

    // マイクの許可が出たら発火
    rec.onstart = () => {
        console.log('on start')
    };


    // 話始めたら発火
    rec.onspeechstart = () => {
        console.log('on speech start')
    };

    // 話終わったら発火
    rec.onspeechend = () => {
        console.log('on speech end')
    };

    // 音声取得を開始する
    rec.start();



});