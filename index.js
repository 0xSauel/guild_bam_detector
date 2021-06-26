const { spawn } = require("child_process");
const Message = require('../tera-message');
const Notifier = require('../tera-notifier');
const Path = require("path");


class NotifierLauncher
{
    constructor(mod)
    {
        this.mod = mod;
        // this.notifier = this.mod.require ? this.mod.require.notifier : require('tera-notifier')(this.mod)
        this.notifier = new Notifier(this.mod)
        this.MSG = new Message(this.mod)


        this.exEvent = 0;
        this.mod.log("FFS, first line of code is ok")
        this.installHooks(this.mod);

        const gbdPath = Path.join(__dirname, "/lib/GuildBAMNotifier.dll");
        this.mod.log("Starting Detector...");
        this.notification("Starting Detector...")
        this.commands(this.mod, MSG, notifier)
        this.gbd = spawn('dotnet', [gbdPath], {stdio: ['pipe', 'pipe', 'pipe']});
        this.gbd.on("exit", e => this.mod.log(`GBD Exited\n, ${e.toString()}`));

        this.mod.hook("S_NOTIFY_GUILD_QUEST_URGENT", 1, ev =>
        {
            switch (ev.type) {
                case 0:
                    this.exEvent = 10080;
                    this.mod.log(`Event type: ${ev.type}, msg: ${ev.quest}`);
                    this.notification("Guild BAM spawn soon")
                    break;
                case 1:
                    this.exEvent = 10081;
                    this.mod.log(`Event type: ${ev.type}, msg: ${ev.quest}`);
                    this.notification("Guild BAM spawned")
                    break;
                case 3:
                    this.exEvent = 10083;
                    this.mod.log(`Event type: ${ev.type}, msg: ${ev.quest}`);
                    this.notification("Guild BAM dead")
                    break;
                default:
                    this.mod.log(`Event type: ${ev.type}, msg: ${ev.quest}`);
            }
            this.gbd.stdin.write(`${this.exEvent}\\n`, 'utf-8')
        });

    }

    commands()
    {
        this.mod.command.add(["gbd"], (arg) => {
            if (!arg) {
                this.mod.settings.enabled = !this.mod.settings.enabled
                this.MSG.chat("Guild BAM Detector: " + (this.mod.settings.enabled ? this.MSG.BLU("On") : this.MSG.YEL("Off")))
            } else {
                switch (arg) {
                    case "alert":
                        this.mod.settings.alerted = !this.mod.settings.alerted
                        this.MSG.chat("alert " + (this.mod.settings.alerted ? this.MSG.BLU("on") : this.MSG.YEL("off")))
                        break
                    case "notice":
                        this.mod.settings.notice = !this.mod.settings.notice
                        this.MSG.chat("notice " + (this.mod.settings.notice ? this.MSG.BLU("on") : this.MSG.YEL("off")))
                        break
                    case "message":
                        this.mod.settings.messager = !this.mod.settings.messager
                        this.MSG.chat("message " + (this.mod.settings.messager ? this.MSG.BLU("on") : this.MSG.YEL("off")))
                        break
                    case "status":
                        this.MSG.chat("Guild BAM Detector: " + (this.mod.settings.enabled ? this.MSG.BLU("On") : this.MSG.YEL("Off")))
                        this.MSG.chat("alert " + (this.mod.settings.alerted ? this.MSG.BLU("on") : this.MSG.YEL("off")))
                        this.MSG.chat("message " + (this.mod.settings.messager ? this.MSG.BLU("on") : this.MSG.YEL("off")))
                        this.MSG.chat("notice " + (this.mod.settings.notice ? this.MSG.BLU("on") : this.MSG.YEL("off")))
                        break
                    case "debug":
                        this.gbd.stdin.write(`1003\\n`, 'utf-8')
                        break
                    default:
                        this.MSG.chat("Detector: " + this.MSG.RED("wrong parameter!"))
                        break
                }
            }
        })
    }

    installHooks()
    {
    }


    notification(msg, timeout) { // timeout in milsec

        this.notifier.notify({
            title: 'NekOWO-Notification',
            message: msg,
            wait: false,
            sound: 'Notification.IM',
        }, timeout)
    }

    destructor(m)
    {
        this.gbd.kill('SIGINT')
    }
}
exports.NetworkMod = NotifierLauncher;