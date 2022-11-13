// Define gun instance
let gun = Gun([
    "http://77.68.15.151:1234/gun",
    "https://gun-manhattan.herokuapp.com/gun",
]);

// Define user
let user = gun.user();

// Define usernames and channel id
let user1 = null;
let user2 = null;
let authenticated = false;

let channelName = null;



// All currently unusued fields
$("#msg").hide();

// On sign up
$("#up").on("click", function (e) {
    // Create user with #alias as username and #pass as password
    user.create($("#alias").val(), $("#pass").val(), (ack) => {
        if (ack.ok === 0) {
            addUser($("#alias").val());
            console.log(
                $("#alias").val() + ": " + $("#pass").val() + " signed up"
            );
        } else {
            $("#error").text(ack.err);
        }
    });

    // console.log
    // Log sign-up to console
});

// On sign in
$("#sign").on("submit", function (e) {
    // Prevent page refresh
    e.preventDefault();

    // Authenticate user
    user.auth($("#alias").val(), $("#pass").val());

    // Log sign-in to console
    console.log($("#alias").val() + ": " + $("#pass").val() + " signed in");
    gun.get(channelName).map().once(Log);
});

// On receiver set
$("#receiver").change(function (e) {
    // Prevent page refresh
    e.preventDefault();

    // Set user2's name
    user2 = $("#user2").val();

    // user.get('friends').set("friend1");

    // Cosmetics
    // Display receiver in h4 tag
    $("#rh").text(user2);

    // Make chat form visible
    $("#msg").show();

    // Set the channel name to combination of usernames
    channelName = user1 < user2 ? user1 + user2 : user2 + user1;

    // Pull up all messages in channel
    $("ul#messages")[0].innerHTML = "";
    gun.get(channelName).map().once(Li);
});

// On message sent
$("#said").on("submit", function (e) {
    console.log("AAA");
    // Prevent page refresh
    e.preventDefault();

    // If not authenticated stop
    if (!user.is) return;

    // Add message to channel
    console.log(channelName);
    gun.get(channelName).set(user1 + ": " + $("#say").val());

    // Log message to console
    console.log(user1 + " said " + $("#say").val() + " to " + user2);
    $("#say").val("");
});

// Update UI
function Log(say, id) {
    console.log(say + " " + id);
}

function Li(say, id) {
    // If li element with messageID doesn't exist
    let li =
        $("#" + id).get(0) ||
        // Add message to ul
        $("<li>").attr("id", id).appendTo("ul#messages");
    $(li).text(say);
}

function Dropdown(item, id) {
    let option =
    $("option[value='" + item + "']").get(0) ||
        // Add message to ul
        $("<option>").attr("value", item).appendTo("#user2");
    $(option).text(item);
    user2 = $("#user2").val();
    channelName = user1 < user2 ? user1 + user2 : user2 + user1;
}

let auth = function () {
    // Set user1's name
    user1 = $("#alias").val();

    // Cosmetics
    // Hide login form
    $("#sign").hide();

    // Show choose recipient form
    $("#msg").show();

    getFriends(user1).then((e) => {
        e.forEach((element) => {
            Dropdown(element)
        });
    });
    user.get("friends").map().once(Log);

    // Log authed to console
    console.log("authenticated");

    authenticated = true;

    getSearchResults();
};
// On authenticated (all cosmetics)
gun.on("auth", auth);

function switchTo1() {
    if (!authenticated) {
        return;
    }
    centerUser();
    removeActive();
    hideAll();
    $("#tab-1").addClass("is-active");
    $("#tab-1-content").removeClass("is-hidden");
}

function switchTo2() {
    if (!authenticated) {
        return;
    }
    removeActive();
    hideAll();
    $("#tab-2").addClass("is-active");
    $("#tab-2-content").removeClass("is-hidden");
}

function switchTo3() {
    if (!authenticated) {
        return;
    }
    removeActive();
    hideAll();
    $("#tab-3").addClass("is-active");
    $("#tab-3-content").removeClass("is-hidden");
}

function switchTo4() {
    removeActive();
    hideAll();
    $("#tab-4").addClass("is-active");
    $("#tab-4-content").removeClass("is-hidden");
}

function removeActive() {
    $("li").each(function () {
        $(this).removeClass("is-active");
    });
}

function hideAll() {
    $("#tab-1-content").addClass("is-hidden");
    $("#tab-2-content").addClass("is-hidden");
    $("#tab-3-content").addClass("is-hidden");
    $("#tab-4-content").addClass("is-hidden");
}

function getSearchResults() {
    // reset results 
    $(".results")[0].innerHTML = "";

    // get filter phrase from search bar
    var filter = $("#friend_search").val().toUpperCase();

    // filter and bucketize by (starts with filter), (contains filter)
    var startsWithFilter = [];
    var containsFilter = [];
    nodes.forEach(function (node) {
        if(filter != null) {
            var filterIndex = node.name.toUpperCase().indexOf(filter);
            if(filterIndex == 0) {
                startsWithFilter.push(node);
            }
            else if(filterIndex > -1) {
                containsFilter.push(node);
            }
        }
    });


    // create buttons
    startsWithFilter.forEach(function (node) {
        createFriendButton(node);
    });
    containsFilter.forEach(function (node) {
        createFriendButton(node);
    });
}

function createFriendButton(node) {
    if (user1 !== node.name)
        getFriends(user1).then((friends) => {
            let alreadyFriends = friends.indexOf(node.name) != -1;

            $(".results")[0].innerHTML +=
                '<div class="box result">' +
                '<button class="add-friend is-info button is-right"' +
                'onclick=\'addFriend(\"' +
                user1 +
                '","' +
                node.name +
                '\").then(()=>{addFriendButtons()})\'' +
                (alreadyFriends ? " disabled" : "") +
                ">" +
                '<span class="icon is-medium"><i class="fa fa-' +
                (alreadyFriends ? "check-circle" : "plus-circle") +
                '"></i></span></button>' +
                node.name +
                "</div>";
        });
}
