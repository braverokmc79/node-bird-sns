
let BACK_URL = "http://192.168.120.137:3065";

if (process.env.NODE_ENV === "production") {
    //운영시 백엔드 주소
    BACK_URL = "http://192.168.120.137:3065";
}

export const backURL = BACK_URL;

