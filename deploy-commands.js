const { REST, Routes } = require("discord.js");
const clientId = "991590117036806234";
const guildId1 = "1093830109783412756"; //テストサーバー
const guildId2 = "961573520855425074"; //本サーバー
const token = process.env.DISCORD_BOT_TOKEN;
const fs = require("fs");
const path = require("path");

const commands = [];
const commands_tesuryo = [];
// Grab all the command folders from the commands directory you created earlier
const commandsPath_utils = path.join(__dirname, "commands/utils");
const commandsPath_admin = path.join(__dirname, "commands/admin");

const commandFiles_utils = fs
  .readdirSync(commandsPath_utils)
  .filter((file) => file.endsWith(".js"));
// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles_utils) {
  const filePath = path.join(commandsPath_utils, file);
  const command = require(filePath);
  if ("data" in command && "execute" in command) {
    commands.push(command.data.toJSON());
    commands_tesuryo.push(command.data.toJSON());
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
    );
  }
}
const commandFiles_admin = fs
  .readdirSync(commandsPath_admin)
  .filter((file) => file.endsWith(".js"));
// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles_admin) {
  const filePath = path.join(commandsPath_admin, file);
  const command = require(filePath);
  if ("data" in command && "execute" in command) {
    commands.push(command.data.toJSON());
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
    );
  }
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// and deploy your commands!
(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId1),
      { body: commands }
    );

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
    const data2 = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId2),
      { body: commands_tesuryo }
    );

    console.log(
      `Successfully reloaded ${data2.length} application (/) commands.`
    );
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();
