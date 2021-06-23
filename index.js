const { spawn } = require("child_process");
const Path = require("path");

class NotifierLauncher
{
    constructor(m)
    {
        this.m = m;
        this.globalMod().setNetworkMod(this);
        this.installHooks();
        
        this.m.clientInterface.once("ready", () =>
        {
            const gbdPath = Path.join(__dirname, "/lib/GuildBAMNotifier.dll");
            this.m.log("Starting Detector...");
            this.gbd = spawn('dotnet', [gbdPath], {stdio: ['pipe', 'pipe', 'pipe']});
            this.gbd.on("exit", () => this.m.log("GBD Exited dunno why"));
            this.gbd.stdout.on('data', (data) => this.m.log(data.toString()))
            this.gbd.stdin.write("1003\n", 'utf-8')
        });
    }

    globalMod()
    {
        return this.m.globalMod;
    }

    installHooks()
    {
    }

    destructor(m)
    {
        this.gbd.kill('SIGINT')
    }
}
exports.NetworkMod = NotifierLauncher;