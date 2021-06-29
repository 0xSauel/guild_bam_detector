const { spawn } = require("child_process");
const Path = require("path");


class GuildBamDetector
{
    constructor(mod)
    {
        this.mod = mod;
        const gbdPath = Path.join(__dirname, "/lib/GuildBAMNotifier.dll");
        this.mod.log("Starting Detector...");
        this.gbd = spawn('dotnet', [gbdPath], {stdio: ['pipe', 'pipe', 'pipe']});
        this.gbd.on("exit", () => this.mod.log(`GBD Exited`));
        this.installHooks();
    }

    installHooks()
    {
        this.mod.hook("S_NOTIFY_GUILD_QUEST_URGENT", 1, ev =>
        {
            this.mod.log(`Event type: 108${ev.type}, msg: ${ev.quest}`);
            this.gbd.stdin.write(`108${this.mod.game.me.serverId}${ev.type}\n`, 'utf-8')
        });
    }

    destructor(mod)
    {
        this.gbd.kill('SIGINT')
    }
}
exports.NetworkMod = GuildBamDetector;