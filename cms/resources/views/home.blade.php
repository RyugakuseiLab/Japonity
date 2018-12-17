
   
@extends('layouts.app')
@section('content')
   
    <!---------------------------------------------
     翻訳結果の表示エリア
     本当は
     翻訳結果のテキスト、翻訳前のテキスト、Lintenpushユーザーid
     from lang to langを受け取る

    ----------------------------------------------->

    <div>
        <label for="">翻訳結果<br>
            <!--テスト用入力項目-->
            <input id="talk_text" type="text"><br>
            <input id="translation_text" type="text"><br>
            <input id="user_id" type="text"><br>
            <input id="from_lang" type="text"><br>
            <input id="to_lang" type="text"><br>
        </label>
        <button id="send">firebaseへ</button>

        <div id="output"></div>
        <div id="btn_area">
            <button id="listin">LISTIN</button>
        </div>

        <input type="button" value="Listen" onclick="">
    </div>

     <script src="{{asset('/assets/js/app.js')}}"></script>
     <script src="{{asset('/assets/js/jquery-3.3.1.min.js')}}"></script>

    <!--  japanity リアルタイムデータベース -->
    <script src="https://www.gstatic.com/firebasejs/5.7.0/firebase.js"></script>
    <script src="{{asset('/assets/js/script.js')}}"></script>
    <script src="{{asset('/assets/js/firebase.js')}}"></script>

    <!-- <script src="{{secure_asset('/assets/js/app.js')}}"></script>-->
    <!-- <script src="{{secure_asset('/assets/js/jquery-3.3.1.min.js')}}"></script>-->

    <!--  japanity リアルタイムデータベース -->
    <!--<script src="https://www.gstatic.com/firebasejs/5.7.0/firebase.js"></script>-->
    <!--<script src="{{secure_asset('/assets/js/script.js')}}"></script>-->
    <!--<script src="{{secure_asset('/assets/js/firebase.js')}}"></script>-->



    <!--<script src="js/script.js"></script>-->
   
    
@endsection('content')