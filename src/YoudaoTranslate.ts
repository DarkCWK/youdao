import { ITranslate, ITranslateOptions } from "comment-translate-manager";
import { createHash } from "node:crypto";
import HttpUtils from "./HttpUtils";

type Result = {
  type: string;
  errorCode: number;
  elapsedTime: number;
  translateResult: { src: string; tgt: string }[][];
};

export default class YoudaoTranslate implements ITranslate {
  maxLen: number = 3000;

  transformLanguage(origin: string) {
    switch (origin) {
      case "en": // 英语
      case "ja": // 日语
      case "ko": // 韩语
      case "fr": // 法语
      case "de": // 德语
      case "ru": // 俄语
      case "es": // 西班牙语
      case "pt": // 葡萄牙语
      case "it": // 意大利
      case "vi": // 越南语
      case "id": // 印尼语
      case "ar": // 阿拉伯语
      case "nl": // 荷兰语
      case "th": // 泰语
        return origin;
      case "zh-CN": // 简体中文
        return "zh-CHS";
      default:
        return undefined;
    }
  }

  translate(content: string, options: ITranslateOptions): Promise<string> {
    return new Promise(async (resolve, reject) => {
      console.log(options.from, options.to);

      let from = options.from ? this.transformLanguage(options.from) : "AUTO";
      let to = options.to ? this.transformLanguage(options.to) : undefined;

      if (to == undefined) {
        return reject("未支持此语言");
      }

      let ua =
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36 Edg/105.0.1343.27";

      let i = content;

      let lts = String(Date.now());

      let salt = lts + Math.floor(10 * Math.random());

      let signMd5 = createHash("md5");
      let sign = signMd5.update("fanyideskweb" + i + salt + "Ygy_4c=r#e#4EX^NUGUc5").digest("hex");

      let bvMd5 = createHash("md5");
      let bv = bvMd5.update(ua.substring(ua.indexOf("/") + 1)).digest("hex");

      let body =
        `i=${i}` +
        `&` +
        `from=${from}` +
        `&` +
        `to=${to}` +
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

      HttpUtils.post("http://fanyi.youdao.com/translate_o?smartresult=dict&smartresult=rule", body, headers).then(
        (v) => {
          let result = JSON.parse(v.toString("utf-8"));
          if (result.errorCode == 0) {
            let tgt = "";
            for (let i = 0; i < result.translateResult.length; i++) {
              let translateRowResult = result.translateResult[i];

              for (const translateResult of translateRowResult) tgt += translateResult.tgt;

              if (i !== result.translateResult.length - 1) tgt += "\n";
            }

            resolve(tgt);
          }
        }
      );
    });
  }
  link(content: string, options: ITranslateOptions): string {
    return `[有道](https://fanyi.youdao.com/)`;
  }
}
