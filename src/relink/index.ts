import { join } from "path";
import { homedir } from "os";
import { exec } from "shelljs";
import { appendFileSync } from "fs";
import { pwd } from "./config.json";

const logDir = join(homedir(), "./log/relink");
exec(`mkdir -p ${logDir}`);

const resultLog = join(homedir(), "./log/relink/result.log");
const errorLog = join(homedir(), "./log/relink/error.log");

function format(str: string) {
  return new Date() + " --- " + str + "\n";
}

(() => {
  let r = exec("ifconfig");

  if (r.code !== 0) {
    // ifconfig 命令出错
    appendFileSync(errorLog, format("ifconfig 出错：" + r.stderr));
    return;
  }

  if (r.stdout.indexOf("192.168") !== -1) {
    // 网络正常
    appendFileSync(resultLog, format("ok"));
    return;
  }

  r = exec(`echo ${pwd} | sudo -S systemctl restart network-manager`);

  if (r.code !== 0) {
    //  重启出错
    appendFileSync(errorLog, format("重启出错：" + r.stderr));
    return;
  }

  // 重启成功
  appendFileSync(resultLog, "重启成功");
})();
