import { ITranslate, ITranslateOptions } from "comment-translate-manager";
import HttpUtils from "./HttpUtils";

type Result = {
  type: string;
  errorCode: number;
  elapsedTime: number;
  translateResult: { src: string; tgt: string }[][];
};

export default class YoudaoTranslate implements ITranslate {
  maxLen: number = 3000;
  translate(content: string, options: ITranslateOptions): Promise<string> {
    return new Promise(async (resolve, reject) => {
      let body = `doctype=json&type=AUTO&i=${content}`;
      let headers = { "Content-Type": "application/x-www-form-urlencoded" };
      let data = await HttpUtils.post("http://fanyi.youdao.com/translate", body, headers);
      let resultJson: Result = JSON.parse(data.toString("utf8"));

      let str = content;
      for (const _ of resultJson.translateResult) {
        for (const __ of _) {
          str = str.replace(__.src, __.tgt);
        }
      }
      resolve(str);
    });
  }
  link(content: string, options: ITranslateOptions): string {
    return `[有道](https://fanyi.youdao.com/)`;
  }
}
