import * as vscode from "vscode";
import { ITranslate, ITranslateOptions, ITranslateRegistry } from "comment-translate-manager";
import YoudaoTranslate from "./YoudaoTranslate";

type Result = {
  type: string;
  errorCode: number;
  elapsedTime: number;
  translateResult: { src: string; tgt: string }[][];
};

export function activate(context: vscode.ExtensionContext) {
  return {
    extendTranslate: function (registry: ITranslateRegistry) {
      registry("youdao", YoudaoTranslate);
    },
  };
}

export function deactivate() {}
