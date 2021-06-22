const { spawn } = require("child_process");
const Path = require("path");

class NotifierLauncher
{
    constructor(m)
    {

        m.clientInterface.once("ready", () =>
        {
            const gbdPath = Path.join(__dirname, "/lib/GuildBAMNotifier.dll");
            m.log("Starting Detector...");
            this.gbd = spawn('dotnet', [gbdPath], {stdio: ['pipe', 'pipe', 'pipe']});            this.gbd.on("exit", () => m.log("GBD Exited dunno why"));
            this.gbd.stdout.on('data', (data) => m.log(data.toString()))
            this.gbd.stdin.write("1003\n", 'utf-8')
        });
    }

    destructor(m)
    {
        this.gbd.kill('SIGINT')
    }
}
exports.NetworkMod = NotifierLauncher;