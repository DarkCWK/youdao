import * as http from "node:http";

export default class HttpUtils {
  static post(url: string, body: string = "", headers: http.OutgoingHttpHeaders = {}): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      let request = http
        .request(url, { method: "POST", headers }, (response) => {
          response.on("data", resolve);
        })
        .on("error", reject);
      request.write(body);
      request.end();
    });
  }
}
