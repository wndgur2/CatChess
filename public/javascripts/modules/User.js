export default class User {
    static getData(key) {
        if (!getCookie(key)) this.signOut();
        return getCookie(key);
    }

    static authenticate() {
        let token = getCookie("token");
        if (!token) return;
        document.querySelector("#signinBtn").style.display = "none";
        document.querySelector("#signoutBtn").style.display = "inline-block";

        document.querySelector("#userInfoWrapper").style.display =
            "inline-block";
        document.querySelector("#userName").innerHTML = User.getData("email");
        document.querySelector("#record").innerHTML = User.getData("record");
    }

    static signOut() {
        console.log("sign out");

        const cookies = document.cookie.split(";");

        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i];
            const eqPos = cookie.indexOf("=");
            const key = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = key + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
        location.reload();
    }
}

function getCookie(key) {
    let cookie = decodeURIComponent(document.cookie);
    let cookieArr = cookie.split("; ");
    let value = "";
    cookieArr.forEach((cookie) => {
        if (cookie.includes(key)) value = cookie.split("=")[1];
    });
    return value;
}
