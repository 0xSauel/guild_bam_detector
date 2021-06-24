const { spawn } = require("child_process");
const Path = require("path");

class NotifierLauncher
{
    constructor(mod)
    {
        this.mod = mod;
        this.exEvent = 0;
        this.mod.log("FFS, first line of code is ok")
        this.installHooks();

        const gbdPath = Path.join(__dirname, "/lib/GuildBAMNotifier.dll");
        this.mod.log("Starting Detector...");
        this.gbd = spawn('dotnet', [gbdPath], {stdio: ['pipe', 'pipe', 'pipe']});
        this.gbd.on("exit", () => this.mod.log("GBD Exited dunno why"));

        this.mod.hook("S_NOTIFY_GUILD_QUEST_URGENT", 1, ev =>
        {
            switch (ev.type) {
                case 0:
                    this.exEvent = 10080;
                    this.mod.log(`Event type: ${ev.type}, msg: ${ev.quest}`);
                    break;
                case 1:
                    this.exEvent = 10081;
                    this.mod.log(`Event type: ${ev.type}, msg: ${ev.quest}`);
                    break;
                case 3:
                    this.exEvent = 10083;
                    this.mod.log(`Event type: ${ev.type}, msg: ${ev.quest}`);
                    break;
                default:
                    this.mod.log(`Event type: ${ev.type}, msg: ${ev.quest}`);
            }
            this.gbd.stdin.write(`${this.exEvent}\\n`, 'utf-8')
        });

    }

    globalMod()
    {
        return this.mod.globalMod;
    }

    installHooks()
    {
    }

    debug(msg)
    {
        if (!this.mod.settings.debug) return;
        // this.mod.command.message(`<font color="#fff1b5">${msg}</font>`);
        this.mod.log(`${msg}`);
    }

    destructor(m)
    {
        this.gbd.kill('SIGINT')
    }
}
exports.NetworkMod = NotifierLauncher;