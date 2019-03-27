// JavaScript Document
/*
P〇lice in a certain country: "JavaScript...?" 
All Web Programmer:           "I don't want to be arrested."
*/

/* This is not April Fool. */
function you_will_be_arrested() {
    while (true) {
        alert("Used this code which could be write by even 5-year-olds children, you will be soon arrested by p〇lice in Japan.");
    }
}

/* The following is April Fool. */

const next_allow_element = '<span class="next-allow">次へ</span>';

var player_name = "いっぱんじん";
var B_name = names["B"][Math.floor(Math.random() * names["B"].length)];
var C_name = names["C"][Math.floor(Math.random() * names["C"].length)];
var current_num = -1;
var current_selected_option = -1;

var loaded = false;

$(function () {
    pre_load(background_img);
    pre_load(character_img);
    pre_load(other_img_files);
    loaded = true;
})

/* 画像をあらかじめロード */
function pre_load(dict) {
    for (let key in dict) {
        let img = document.createElement('img');
        img.src = './img/' + dict[key];
    }
}

/* ローディング終了 */
$(window).on("load", function () {
    let timer = setInterval(function () {
        if (!loaded) return;
        clearInterval(timer);
        console.log("読み込み完了");
        show_title_window();
    }, 500);
});

/* タイトル画面を表示 */
function show_title_window() {
    $("#game_window").css({
        'background-color': '#FFFFFF',
        'background-image': 'none'
    });
    // ローディングを隠す
    $("#blackout, #option, #dialogue, #modal-overlay-white, #modal-dialogue, #modal-overlay, #name-error, #modal-badend, #modal-goodend, #name-display").hide();
    $("#loading").fadeOut(500);
    $("#game_window").on("click", function () {
        $("#game_window").off("click");
        $("#blackout").fadeIn(500, function () {
            $("#title").hide();
            $("#blackout").fadeOut(500, show_interaction);
        });
    });
}

/* 説明画面を表示 */
function show_interaction(){
    $("#modal-overlay-white").fadeIn(500);
    $(".next-button").on("click", function(){
        $(this).off("click");
        $("#interaction").fadeOut(200, show_name_display);
    });
}

/* 名前入力画面を表示 */
function show_name_display() {
    //$("#modal-overlay-white").fadeIn(500);
    $("#name-display").fadeIn(200);
    $(".name-ok-button").on("click", function () {
        let inputted_name = $("#name-display input").val();
        if (inputted_name.length > 6 || inputted_name.match(/^[ぁ-んーーァ-ン]+$/) == null) {
            $("#name-error").show();
        } else {
            $(".name-ok-button").off("click");
            player_name = inputted_name;
            check_and_re_select_name();
            $("#modal-overlay-white").fadeOut(1000, next_scene);
        }
    });
}

/* シーン番号の更新 */
function process_current_num() {
    if (current_num >= data.length) {
        return;
    }
    if (current_num != -1) {
        let current_data = data[current_num];
        let next_scene_index = current_data["next_scene_index"];
        if (current_data["type"] != "question" && next_scene_index == -1) {
            current_num++;
            return;
        }
        if (current_data["type"] == "question") {
            next_scene_index = current_selected_option == current_data["answer"] ?
             current_data["answer_next_scene_index"] : current_data["incorrect_next_scene_index"];
        }
        current_num = next_scene_index;
    } else {
        current_num++;
    }
}

/* 次の場面へ画面遷移 */
function next_scene() {
    process_current_num();
    if (current_num >= data.length) {
        return;
    }
    //console.log(current_num);

    let type = data[current_num]["type"];
    switch (type) {
        case "scene change":
            change_scene();
            break;
        case "dialogue":
            show_dialogue_display();
            break;
        case "dark dialogue":
            show_dark_dialogue_display();
            break;
        case "question":
            show_quiz_options();
            break;
        case "supplement":
            show_supplement();
            break;
        case "bad end":
            show_bad_end();
            break;
        case "good end":
            show_good_end();
            break;
    }
}

/* GOOD ENDを表示 */
function show_good_end() {
    let current_data = data[current_num];
    $("#dialogue").hide();
    $(".silhouette").css("opacity", "0");
    $("#modal-goodend").fadeIn(200);
    $("#modal-goodend #operate a.share-twitter").attr("href",
     'https://twitter.com/intent/tweet?text=私は…幼馴染と結婚しました。' + player_name + 'はHAPPY ENDに到達しました。' + 
      encodeURI("\nhttps://kawamix.github.io/miemorial/") + '&hashtags=ときめきミエモリアル,実はそれぜんぶ三重なんです');

    // TOPへ
    $(".to-top").on("click", function () {
        $(".to-top").off("click");
        $("#modal-goodend").hide();
        current_num = -1;
        next_scene();
    });
}

/* BAD ENDを表示 */
function show_bad_end() {
    let current_data = data[current_num];
    $("#modal-dialogue").hide();
    $("#modal-badend").fadeIn(200);
    $("#modal-badend h2").html(current_data["h2"]);
    $("#modal-badend p.reason").html(replace_name(current_data["message"]));
    $("#modal-badend #operate a.share-twitter").attr("href",
     'https://twitter.com/intent/tweet?text=私は…幼馴染を落とせませんでした。' + replace_name(current_data["message"]) + 
      encodeURI("\nhttps://kawamix.github.io/miemorial/") + '&hashtags=ときめきミエモリアル,実はそれぜんぶ三重なんです');
    // やり直す
    $(".replay").on("click", function () {
        $(".replay").off("click");
        $(".to-top").off("click");
        $("#modal-badend").hide();
        next_scene();
    });
    // TOPへ
    $(".to-top").on("click", function () {
        $(".replay").off("click");
        $(".to-top").off("click");
        $("#modal-badend").hide();
        current_num = -1;
        next_scene();
    });
}

/* 補足ウィンドウを表示 */
function show_supplement() {
    let current_data = data[current_num];
    $("#modal-overlay").fadeIn(500);
    $("#supplement h2").html(current_data["h2"].replace("\n", "<br>"));
    $("#supplement p").html(current_data["message"]);
    $(".close-button").on("click", function () {
        $(".close-button").off("click");
        $("#modal-overlay").hide();
        next_scene();
    });
}

/* ""暗闇""の会話を表示 */
function show_dark_dialogue_display() {
    // 各ウィンドウを隠す
    $("#dialogue").hide();
    let current_data = data[current_num];
    let speaker = current_data["speaker"];
    if (speaker != null) {
        if (speaker != "{$player_name}") {
            $(".silhouette span").css(
                "background-image", 'url("./img/' + character_img[speaker] + '")'
            );
            $(".silhouette").css("opacity", "1");
        }
    }

    $("#speaker").css("opacity", "0");

    // 表示する
    $("#modal-dialogue").show();
    $("#modal-dialogue p").html("");
    let message = current_data["message"];
    message = replace_name(message);

    show_message_animation($("#modal-dialogue"), message);
}


/* 選択肢を表示 */
function show_quiz_options() {
    let current_data = data[current_num];
    let options = current_data["options"];
    let options_list = $("#option ul").find("li");
    for (let i = 0; i < options_list.length; i++) {
        $(options_list[i]).html(options[i]);
        $(options_list[i]).off("click");
        $(options_list[i]).on("click", function () {
            current_selected_option = i;
            $("#option").hide();
            next_scene();
        });
    }
    $("#option").show();
}

/* 暗転して場面を切り替える */
function change_scene() {
    let current_data = data[current_num];
    $("#blackout").fadeIn(500, function () {
        $("#game_window").css(
            "background-image", 'url("./img/' + background_img[current_data["background"]] + '")'
        );
        $("#dialogue").hide();
        //$("#speaker").html("");
        $("#speaker").css("opacity", "0");
        $(".silhouette").css("opacity", "0");
    });
    $("#blackout").fadeOut(500, next_scene);
}

/* 会話を進める */
function show_dialogue_display() {
    let current_data = data[current_num];
    $("#game_window").css(
        "background-image", 'url("./img/' + background_img[current_data["background"]] + '")'
    );
    $("#dialogue").fadeIn(200);
    $("#dialogue p").html("");
    let speaker = current_data["speaker"];
    if (speaker != null) {
        if (speaker != "{$player_name}") {
            $(".silhouette span").css(
                "background-image", 'url("./img/' + character_img[speaker] + '")'
            );
            $(".silhouette").css("opacity", "1");
        }
        speaker = replace_name(speaker);
        $("#speaker").html(speaker);
        $("#speaker").css("opacity", "1");
    } else {
        $("#speaker").css("opacity", "0");
        $(".silhouette").css("opacity", "0");
    }

    let message = current_data["message"];
    message = replace_name(message);

    show_message_animation($("#dialogue"), message);
}

/* 登場人物の名前を埋める */
function replace_name(original_message) {
    let message = original_message.split("{$player_name}").join(player_name);
    message = message.split("{$B_name}").join(B_name);
    message = message.split("{$C_name}").join(C_name);
    return message;
}

/* メッセージウィンドウに1文字ずつ表示する */
function show_message_animation(target, message) {
    let is_sleeping = true;
    let sleep = setInterval(function () {
        // 何もしない
        clearInterval(sleep);
        is_sleeping = false;
    }, 150);

    let count = 0;
    let timer = setInterval(function () {
        if (is_sleeping) return;
        let current_msg = target.find("p").html();
        let c = message.charAt(count).replace("\n", "<br>");
        target.find("p").html(current_msg + c);
        if (count >= message.length) {
            clearInterval(timer);
            target.find("p").html(target.find("p").html() + next_allow_element);
            // 
            target.on("click", function () {
                target.off("click");
                next_scene();
            });
        }
        count++;
    }, message_animation_interval);
}

/* プレイヤー名と重複したら名前を選びなおす */
function check_and_re_select_name() {
    if (player_name == B_name) {
        while (true) {
            B_name = names["B"][Math.floor(Math.random() * names["B"].length)];
            if (player_name != B_name) break;
        }
    }
    if (player_name == C_name) {
        while (true) {
            C_name = names["C"][Math.floor(Math.random() * names["C"].length)];
            if (player_name != C_name) break;
        }
    }
}