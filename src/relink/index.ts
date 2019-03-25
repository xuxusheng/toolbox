import { exec } from "shelljs";
import { appendFileSync } from "fs";
import { pwd, time } from "./config.json";

const resultLog = "~/log/relink/result.log";
const errorLog = "~/log/relink/error.log";

function format(str: string) {
  return new Date() + " --- " + str;
}

setInterval(() => {
  let r = exec("ifconfig");

  if (r.code !== 0) {
    // ifconfig 命令出错
    appendFileSync(errorLog, format(r.stderr));
    return;
  }

  if (r.stdout.indexOf("192.168")) {
    // 网络正常
    appendFileSync(resultLog, format("ok"));
    return;
  }

  r = exec(`echo ${pwd} | sudo -S systemctl restart network-manager`);

  if (r.code !== 0) {
    //  重启出错
    appendFileSync(errorLog, format(r.stderr));
    return;
  }

  // 重启成功
  appendFileSync(resultLog, "重启成功");
}, 1000 * time);
