import Socket from "./Socket.js";
import { CATCHESS_ID } from "./constants/CONSTS.js";

export default class User {
    static isAuthenticated() {
        let token = getCookie("token");
        if (!token) return false;
        return true;
    }

    static authenticate() {
        if (User.isAuthenticated()) {
            Socket.id = getCookie("email").split("@")[0];
            localStorage.setItem(CATCHESS_ID, Socket.id);
            document.getElementById("id").innerHTML = Socket.id;

            fetch(`/api/user/init`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getCookie("token")}`,
                },
            })
                .then((res) => {
                    return res.json();
                })
                .then((data) => {
                    document.cookie = `record=${encodeURIComponent(
                        getRecord(data.win, data.loss)
                    )}`;

                    document.querySelector("#signinBtnWrapper").style.display =
                        "none";

                    document.querySelector("#userInfoWrapper").style.display =
                        "flex";
                    document.querySelector("#userName").innerHTML = Socket.id;
                    document.querySelector("#record").innerHTML = `${getCookie(
                        "record"
                    )}`;
                });
        } else {
            document.querySelector("#signinBtnWrapper").style.display = "flex";
            document.querySelector("#userInfoWrapper").style.display = "none";
        }
    }

    static signIn() {
        window.location.href = "/auth/google";
    }

    static signOut() {
        const cookies = document.cookie.split(";");

        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i];
            const eqPos = cookie.indexOf("=");
            const key = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = key + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }

        localStorage.removeItem(CATCHESS_ID);

        location.reload();
    }

    static saveLog(winOrLose) {
        fetch(`/api/user/${winOrLose}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getCookie("token")}`,
            },
        });
    }
}
function getCookie(key) {
    try {
        let cookie = decodeURIComponent(document.cookie);
        let cookieArr = cookie.split("; ");
        let value = "";
        cookieArr.forEach((cookie) => {
            if (cookie.includes(key)) value = cookie.split("=")[1];
        });
        return value;
    } catch {
        User.signOut();
    }
}

function getRecord(win, loss) {
    let rate = 0;
    if (win + loss > 0) rate = (win / (win + loss)) * 100;
    return `${win}W ${loss}L (${rate.toFixed(0)}%)`;
}
