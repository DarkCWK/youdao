import HttpUtils from "../HttpUtils";

import { createHash } from "node:crypto";
import { exit } from "node:process";

// URL        : http://fanyi.youdao.com/translate_o
// URL_PARAM  : smartresult=dict&smartresult=rule

// i          : 待翻译字符串
// from       : 待翻译字符串语言
// to         : 翻译后的语言
// smartresult: dict
// client     : fanyideskweb
// salt       : {{salt}}
// sign       : {{sign}}
// lts        : {{lts}}
// bv         : {{bv}}
// doctype    : json
// version    : 2.1
// keyfrom    : fanyi.web
// action     : FY_BY_REALTlME

let ua =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36 Edg/105.0.1343.27";

let i = `/**
 * 试图翻译注释
 * 包括，逗号的
 * 包括。句号的
 * 还有\`这样的\`
 */`;

let lts = String(Date.now());

let salt = lts + Math.floor(10 * Math.random());

let signMd5 = createHash("md5");
let sign = signMd5.update("fanyideskweb" + i + salt + "Ygy_4c=r#e#4EX^NUGUc5").digest("hex");

let bvMd5 = createHash("md5");
let bv = bvMd5.update(ua.substring(ua.indexOf("/") + 1)).digest("hex");

let body =
  `i=${i}` +
  `&` +
  `from=AUTO` +
  `&` +
  `to=AUTO` +
  `&` +
  `smartresult=dict` +
  `&` +
  `client=fanyideskweb` +
  `&` +
  `salt=${salt}` +
  `&` +
  `sign=${sign}` +
  `&` +
  `lts=${lts}` +
  `&` +
  `bv=${bv}` +
  `&` +
  `doctype=json` +
  `&` +
  `version=2.1` +
  `&` +
  `keyfrom=fanyi.web` +
  `&` +
  `action=FY_BY_REALTlME`;

let headers = {
  "User-Agent": ua,
  Referer: "https://fanyi.youdao.com/",
  "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
  Cookie:
    "OUTFOX_SEARCH_USER_ID=-1432640551@10.110.96.154; OUTFOX_SEARCH_USER_ID_NCOO=1848060309.009117; SESSION_FROM_COOKIE=unknown; ___rl__test__cookies=1662464966342",
};

HttpUtils.post("http://fanyi.youdao.com/translate_o?smartresult=dict&smartresult=rule", body, headers).then((v) => {
  let result = JSON.parse(v.toString("utf-8"));
  if (result.errorCode == 0) {
    let tgt = "";
    for (const translateRowResult of result.translateResult) {
      for (const translateResult of translateRowResult) {
        tgt += translateResult.tgt;
      }
      tgt += "\n";
    }

    console.log(tgt);
  }
});
