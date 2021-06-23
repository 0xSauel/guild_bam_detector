const { spawn } = require("child_process");
const Path = require("path");

class NotifierLauncher
{
    constructor(mod)
    {
        this.mod = mod;
        this.mod.log("FFS, first line of code is ok")
        this.installHooks();

        const gbdPath = Path.join(__dirname, "/lib/GuildBAMNotifier.dll");
        this.mod.log("Starting Detector...");
        this.gbd = spawn('dotnet', [gbdPath], {stdio: ['pipe', 'pipe', 'pipe']});
        this.gbd.on("exit", () => this.mod.log("GBD Exited dunno why"));
        this.gbd.stdout.on('data', (data) => this.mod.log(data.toString()))
        this.gbd.stdin.write("1003\n", 'utf-8')
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