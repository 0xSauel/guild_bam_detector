const { spawn } = require("child_process");
const Message = require('../tera-message');
const Path = require("path");


class GuildBamDetector
{
    constructor(mod)
    {
        this.mod = mod;
        this.MSG = new Message(this.mod)

        const gbdPath = Path.join(__dirname, "/lib/GuildBAMNotifier.dll");
        this.mod.log("Starting Detector...");

        this.gbd = spawn('dotnet', [gbdPath], {stdio: ['pipe', 'pipe', 'pipe']});
        this.gbd.stdout.on('data', (data) => this.mod.log(data.toString()))
        this.gbd.on("exit", () => this.mod.log(`GBD Exited`));

        this.gbd.stdin.write("1003\n", "utf-8");
        this.commands()
        this.installHooks();
    }

    commands()
    {
        this.mod.command.add(["gbd"], (arg) => {
            if (!arg) {
                // this.mod.settings.enabled = !this.mod.settings.enabled
                // this.MSG.chat("Guild BAM Detector: " + (this.mod.settings.enabled ? this.MSG.BLU("On") : this.MSG.YEL("Off")))
                this.MSG.chat(this.MSG.RED("Тут нихуя нет, потому что нихуя не работает, заебало"))
            } else {
                switch (arg) {
                    case "debug":
                        this.gbd.stdin.write("1003\n", 'utf-8')
                        this.MSG.chat(this.MSG.BLU("Ok"))

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
        this.mod.hook("S_NOTIFY_GUILD_QUEST_URGENT", 1, ev =>
        {
            this.mod.log(`Event type: 1008${ev.type}, msg: ${ev.quest}`);
            this.gbd.stdin.write(`1008${ev.type}\n`, 'utf-8')
        });
    }

    destructor(mod)
    {
        this.gbd.kill('SIGINT')
    }
}
exports.NetworkMod = GuildBamDetector;