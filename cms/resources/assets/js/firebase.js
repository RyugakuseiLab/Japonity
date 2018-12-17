        // Initialize Firebase
        
        
        console.log("Firebaseは繋がる");
        
        
        var config = {
           
        };
        firebase.initializeApp(config);

        // リアルタイム通信をするための記述(MSG送受信準備)
        // const dateNow = new Date();
        
        // テスト用の
        const testid = "skyweyのID2";
        var newPostRef = firebase.database().ref(testid + "/");


        let send = document.getElementById("send")
        $("#send").on("click", function () {

            newPostRef.push({
                // Firebaceに送るもの・・・
                // １、WEBAPIで取得した言葉）
                // ２、翻訳した言葉
                // ３、user_id
                // ４、from_lan
                // ５、to_lan）
                talk_text: $("#talk_text").val(),
                translation_text: $("#translation_text").val(),
                user_id: $("#user_id").val(),
                from_lang: $("#from_lang").val(),
                to_lang: $("#to_lang").val()

            });

            $("#talk_text").val("");
            $("#translation_text").val("");
            $("#user_id").val("");
            $("#from_lang").val("");
            $("#to_lang").val("");

            console.log("firebaseへ送信完了");

        });