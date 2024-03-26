export default class User {
    static authenticate() {
        let token = getCookie("token");
        if (!token) return;
        document.querySelector("#signinBtn").style.display = "none";
        document.querySelector("#signoutBtn").style.display = "inline-block";

        document.querySelector("#userInfoWrapper").style.display =
            "inline-block";
        document.querySelector("#userName").innerHTML = getCookie("email");
        document.querySelector("#record").innerHTML = getCookie("record");
    }

    static signOut() {
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
