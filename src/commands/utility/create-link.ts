import { DiscordClient } from "../../bot.js";
import { CommandInterface } from "../../typings/index";
import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} from "discord.js";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

import fetch from "node-fetch";

function CheckRealURL(url) {
  // Use a regular expression to validate the URL format
  const urlPattern =
    /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;

  if (urlPattern.test(url)) {
    return true;
  } else {
    return false;
  }
}

const command: CommandInterface = {
  data: new SlashCommandBuilder()
    .setName("create-link")
    .setDescription("Create a link")
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName("long-url")
        .setDescription("The long url")
        .setRequired(true)
    ),

  execute: async (
    interaction: ChatInputCommandInteraction,
    client: DiscordClient
  ) => {
    var isCreated = false;
    var InstantlyRedirect = false;
    var OneTimeUse1 = false;
    var HidePoweredBy1 = false;
    var BlockIOSUseragents1 = false;
    var BlockAndroidUseragents1 = false;
    var BlockWindowsUseragents1 = false;
    const userdc = await prisma.discordUser.findUnique({
      where: { discordId: interaction.user.id },
    });

    const main = async () => {
      const { options } = interaction;
      const LongLink = options.getString("long-url") ?? "";

      setTimeout(() => {
        if (isCreated == false) {
          interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setColor(client.config.colors.red)
                .setDescription(
                  `${client.config.emojis.error} Interaction ended.`
                ),
            ],
            components: [],
          });
          return;
        }
      }, 60000);

      const initialReply = await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.colors.green)
            .setDescription(`<:logo:1156278650367385641> Loading...`),
        ],
        ephemeral: false,
        fetchReply: true,
      });

      if (!CheckRealURL(LongLink)) {
        interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.config.colors.red)
              .setDescription(
                `${client.config.emojis.error} The link is not a valid URL.`
              ),
          ],
        });
        return;
      }

      const confirm = new ButtonBuilder()
        .setCustomId("confirm")
        .setLabel("Create Link")
        .setStyle(ButtonStyle.Success);

      const InstantRedirect = new ButtonBuilder()
        .setCustomId("enable-instant-redirect")
        .setLabel("Instant Redirect")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(InstantlyRedirect);

      const OneTimeUse = new ButtonBuilder()
        .setCustomId("enable-one-time")
        .setLabel("One Time Use")
        .setDisabled(OneTimeUse1)
        .setStyle(ButtonStyle.Secondary);

      const HidePoweredBy = new ButtonBuilder()
        .setCustomId("hide-branding")
        .setLabel("Hide Powered By Urlcut")
        .setDisabled(HidePoweredBy1)
        .setStyle(ButtonStyle.Secondary);

      const BlockIOSUseragents = new ButtonBuilder()
        .setCustomId("block-ios-useragents")
        .setLabel("Block iOS Useragents")
        .setDisabled(BlockIOSUseragents1)
        .setStyle(ButtonStyle.Danger);

      const BlockAndroidUseragents = new ButtonBuilder()
        .setCustomId("block-android-useragents")
        .setLabel("Block Android Useragents")
        .setDisabled(BlockAndroidUseragents1)
        .setStyle(ButtonStyle.Danger);

      const BlockWindowsUseragents = new ButtonBuilder()
        .setCustomId("block-pc-useragents")
        .setLabel("Block PC Useragents")
        .setDisabled(BlockWindowsUseragents1)
        .setStyle(ButtonStyle.Danger);

      const row1 = new ActionRowBuilder<ButtonBuilder>().addComponents(
        confirm,
        InstantRedirect,
        OneTimeUse,
        HidePoweredBy
      );

      const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
        BlockIOSUseragents,
        BlockAndroidUseragents,
        BlockWindowsUseragents
      );

      const upgrade1 = new ButtonBuilder()

        .setLabel("Upgrade")
        .setStyle(ButtonStyle.Link)
        .setURL(`https://urlcut.app/bot/upgrade?user=${userdc?.UniqueID}`);

      const upgrade = new ActionRowBuilder<ButtonBuilder>().addComponents(
        upgrade1
      );

      const confirmEmbed = new EmbedBuilder()
        .setColor(client.config.colors.green)
        .setTitle(`Hey ${userdc?.username}!`)
        .setDescription(
          `<:logo:1156278650367385641> Please click any other optional buttons you want to enable, then/or click the **Create Link** button to create your link.`
        );

      interaction.editReply({
        embeds: [confirmEmbed],
        components: [row1, row2],
      });

      const collector = initialReply.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 60000,
      });

      collector.on("collect", (i) => {
        if (i.user.id === interaction.user.id) {
          if (i.customId === "enable-instant-redirect") {
            if (userdc?.premium === true) {
              InstantlyRedirect = true;
              i.deferUpdate();
              const confirmEmbed = new EmbedBuilder()
                .setColor(client.config.colors.green)
                .setTitle(`Hey ${userdc?.username}!`)
                .setDescription(
                  `<:logo:1156278650367385641> Please click any other optional buttons you want to enable, then/or click the **Create Link** button to create your link.`
                );

              const confirm = new ButtonBuilder()
                .setCustomId("confirm")
                .setLabel("Create Link")
                .setStyle(ButtonStyle.Success);

              const InstantRedirect = new ButtonBuilder()
                .setCustomId("enable-instant-redirect")
                .setLabel("Instant Redirect")
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(InstantlyRedirect);

              const OneTimeUse = new ButtonBuilder()
                .setCustomId("enable-one-time")
                .setLabel("One Time Use")
                .setDisabled(OneTimeUse1)
                .setStyle(ButtonStyle.Secondary);

              const HidePoweredBy = new ButtonBuilder()
                .setCustomId("hide-branding")
                .setLabel("Hide Powered By Urlcut")
                .setDisabled(HidePoweredBy1)
                .setStyle(ButtonStyle.Secondary);

              const BlockIOSUseragents = new ButtonBuilder()
                .setCustomId("block-ios-useragents")
                .setLabel("Block iOS Useragents")
                .setDisabled(BlockIOSUseragents1)
                .setStyle(ButtonStyle.Danger);

              const BlockAndroidUseragents = new ButtonBuilder()
                .setCustomId("block-android-useragents")
                .setLabel("Block Android Useragents")
                .setDisabled(BlockAndroidUseragents1)
                .setStyle(ButtonStyle.Danger);

              const BlockWindowsUseragents = new ButtonBuilder()
                .setCustomId("block-pc-useragents")
                .setLabel("Block PC Useragents")
                .setDisabled(BlockWindowsUseragents1)
                .setStyle(ButtonStyle.Danger);

              const row1 = new ActionRowBuilder<ButtonBuilder>().addComponents(
                confirm,
                InstantRedirect,
                OneTimeUse,
                HidePoweredBy
              );

              const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
                BlockIOSUseragents,
                BlockAndroidUseragents,
                BlockWindowsUseragents
              );

              interaction.editReply({
                embeds: [confirmEmbed],
                components: [row1, row2],
              });
            } else {
              i.reply({
                embeds: [
                  new EmbedBuilder()
                    .setColor(client.config.colors.red)
                    .setDescription(
                      `${client.config.emojis.error} You need premium to use this feature.`
                    ),
                ],
                components: [upgrade],

                ephemeral: true,
              });
            }
          }

          if (i.customId === "enable-one-time") {
            if (userdc?.premium === true) {
              OneTimeUse1 = true;
              i.deferUpdate();
              const confirmEmbed = new EmbedBuilder()
                .setColor(client.config.colors.green)
                .setTitle(`Hey ${userdc?.username}!`)
                .setDescription(
                  `<:logo:1156278650367385641> Please click any other optional buttons you want to enable, then/or click the **Create Link** button to create your link.`
                );

              const confirm = new ButtonBuilder()
                .setCustomId("confirm")
                .setLabel("Create Link")
                .setStyle(ButtonStyle.Success);

              const InstantRedirect = new ButtonBuilder()
                .setCustomId("enable-instant-redirect")
                .setLabel("Instant Redirect")
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(InstantlyRedirect);

              const OneTimeUse = new ButtonBuilder()
                .setCustomId("enable-one-time")
                .setLabel("One Time Use")
                .setDisabled(OneTimeUse1)
                .setStyle(ButtonStyle.Secondary);

              const HidePoweredBy = new ButtonBuilder()
                .setCustomId("hide-branding")
                .setLabel("Hide Powered By Urlcut")
                .setDisabled(HidePoweredBy1)
                .setStyle(ButtonStyle.Secondary);

              const BlockIOSUseragents = new ButtonBuilder()
                .setCustomId("block-ios-useragents")
                .setLabel("Block iOS Useragents")
                .setDisabled(BlockIOSUseragents1)
                .setStyle(ButtonStyle.Danger);

              const BlockAndroidUseragents = new ButtonBuilder()
                .setCustomId("block-android-useragents")
                .setLabel("Block Android Useragents")
                .setDisabled(BlockAndroidUseragents1)
                .setStyle(ButtonStyle.Danger);

              const BlockWindowsUseragents = new ButtonBuilder()
                .setCustomId("block-pc-useragents")
                .setLabel("Block PC Useragents")
                .setDisabled(BlockWindowsUseragents1)
                .setStyle(ButtonStyle.Danger);

              const row1 = new ActionRowBuilder<ButtonBuilder>().addComponents(
                confirm,
                InstantRedirect,
                OneTimeUse,
                HidePoweredBy
              );

              const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
                BlockIOSUseragents,
                BlockAndroidUseragents,
                BlockWindowsUseragents
              );

              interaction.editReply({
                embeds: [confirmEmbed],
                components: [row1, row2],
              });
            } else {
              i.reply({
                embeds: [
                  new EmbedBuilder()
                    .setColor(client.config.colors.red)
                    .setDescription(
                      `${client.config.emojis.error} You need premium to use this feature.`
                    ),
                ],
                components: [upgrade],

                ephemeral: true,
              });
            }
          }

          if (i.customId === "hide-branding") {
            if (userdc?.premium === true) {
              HidePoweredBy1 = true;
              i.deferUpdate();
              const confirmEmbed = new EmbedBuilder()
                .setColor(client.config.colors.green)
                .setTitle(`Hey ${userdc?.username}!`)
                .setDescription(
                  `<:logo:1156278650367385641> Please click any other optional buttons you want to enable, then/or click the **Create Link** button to create your link.`
                );

              const confirm = new ButtonBuilder()
                .setCustomId("confirm")
                .setLabel("Create Link")
                .setStyle(ButtonStyle.Success);

              const InstantRedirect = new ButtonBuilder()
                .setCustomId("enable-instant-redirect")
                .setLabel("Instant Redirect")
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(InstantlyRedirect);

              const OneTimeUse = new ButtonBuilder()
                .setCustomId("enable-one-time")
                .setLabel("One Time Use")
                .setDisabled(OneTimeUse1)
                .setStyle(ButtonStyle.Secondary);

              const HidePoweredBy = new ButtonBuilder()
                .setCustomId("hide-branding")
                .setLabel("Hide Powered By Urlcut")
                .setDisabled(HidePoweredBy1)
                .setStyle(ButtonStyle.Secondary);

              const BlockIOSUseragents = new ButtonBuilder()
                .setCustomId("block-ios-useragents")
                .setLabel("Block iOS Useragents")
                .setDisabled(BlockIOSUseragents1)
                .setStyle(ButtonStyle.Danger);

              const BlockAndroidUseragents = new ButtonBuilder()
                .setCustomId("block-android-useragents")
                .setLabel("Block Android Useragents")
                .setDisabled(BlockAndroidUseragents1)
                .setStyle(ButtonStyle.Danger);

              const BlockWindowsUseragents = new ButtonBuilder()
                .setCustomId("block-pc-useragents")
                .setLabel("Block PC Useragents")
                .setDisabled(BlockWindowsUseragents1)
                .setStyle(ButtonStyle.Danger);

              const row1 = new ActionRowBuilder<ButtonBuilder>().addComponents(
                confirm,
                InstantRedirect,
                OneTimeUse,
                HidePoweredBy
              );

              const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
                BlockIOSUseragents,
                BlockAndroidUseragents,
                BlockWindowsUseragents
              );

              interaction.editReply({
                embeds: [confirmEmbed],
                components: [row1, row2],
              });
            } else {
              i.reply({
                embeds: [
                  new EmbedBuilder()
                    .setColor(client.config.colors.red)
                    .setDescription(
                      `${client.config.emojis.error} You need premium to use this feature.`
                    ),
                ],
                components: [upgrade],

                ephemeral: true,
              });
            }
          }

          if (i.customId === "block-ios-useragents") {
            if (BlockAndroidUseragents1 && BlockWindowsUseragents1) {
              i.reply({
                embeds: [
                  new EmbedBuilder()
                    .setColor(client.config.colors.red)
                    .setDescription(
                      `${client.config.emojis.error} You can't block both Android and iOS  and PC useragents.`
                    ),
                ],
                components: [upgrade],

                ephemeral: true,
              });
            } else {
              BlockIOSUseragents1 = true;
              i.deferUpdate();
              const confirmEmbed = new EmbedBuilder()
                .setColor(client.config.colors.green)
                .setTitle(`Hey ${userdc?.username}!`)
                .setDescription(
                  `<:logo:1156278650367385641> Please click any other optional buttons you want to enable, then/or click the **Create Link** button to create your link.`
                );

              const confirm = new ButtonBuilder()
                .setCustomId("confirm")
                .setLabel("Create Link")
                .setStyle(ButtonStyle.Success);

              const InstantRedirect = new ButtonBuilder()
                .setCustomId("enable-instant-redirect")
                .setLabel("Instant Redirect")
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(InstantlyRedirect);

              const OneTimeUse = new ButtonBuilder()
                .setCustomId("enable-one-time")
                .setLabel("One Time Use")
                .setDisabled(OneTimeUse1)
                .setStyle(ButtonStyle.Secondary);

              const HidePoweredBy = new ButtonBuilder()
                .setCustomId("hide-branding")
                .setLabel("Hide Powered By Urlcut")
                .setDisabled(HidePoweredBy1)
                .setStyle(ButtonStyle.Secondary);

              const BlockIOSUseragents = new ButtonBuilder()
                .setCustomId("block-ios-useragents")
                .setLabel("Block iOS Useragents")
                .setDisabled(BlockIOSUseragents1)
                .setStyle(ButtonStyle.Danger);

              const BlockAndroidUseragents = new ButtonBuilder()
                .setCustomId("block-android-useragents")
                .setLabel("Block Android Useragents")
                .setDisabled(BlockAndroidUseragents1)
                .setStyle(ButtonStyle.Danger);

              const BlockWindowsUseragents = new ButtonBuilder()
                .setCustomId("block-pc-useragents")
                .setLabel("Block PC Useragents")
                .setDisabled(BlockWindowsUseragents1)
                .setStyle(ButtonStyle.Danger);

              const row1 = new ActionRowBuilder<ButtonBuilder>().addComponents(
                confirm,
                InstantRedirect,
                OneTimeUse,
                HidePoweredBy
              );

              const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
                BlockIOSUseragents,
                BlockAndroidUseragents,
                BlockWindowsUseragents
              );

              interaction.editReply({
                embeds: [confirmEmbed],
                components: [row1, row2],
              });
            }
          }

          if (i.customId === "block-android-useragents") {
            if (BlockIOSUseragents1 && BlockWindowsUseragents1) {
              i.reply({
                embeds: [
                  new EmbedBuilder()
                    .setColor(client.config.colors.red)
                    .setDescription(
                      `${client.config.emojis.error} You can't block both Android and iOS  and PC useragents.`
                    ),
                ],
                components: [upgrade],

                ephemeral: true,
              });
            } else {
              BlockAndroidUseragents1 = true;
              i.deferUpdate();
              const confirmEmbed = new EmbedBuilder()
                .setColor(client.config.colors.green)
                .setTitle(`Hey ${userdc?.username}!`)
                .setDescription(
                  `<:logo:1156278650367385641> Please click any other optional buttons you want to enable, then/or click the **Create Link** button to create your link.`
                );

              const confirm = new ButtonBuilder()
                .setCustomId("confirm")
                .setLabel("Create Link")
                .setStyle(ButtonStyle.Success);

              const InstantRedirect = new ButtonBuilder()
                .setCustomId("enable-instant-redirect")
                .setLabel("Instant Redirect")
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(InstantlyRedirect);

              const OneTimeUse = new ButtonBuilder()
                .setCustomId("enable-one-time")
                .setLabel("One Time Use")
                .setDisabled(OneTimeUse1)
                .setStyle(ButtonStyle.Secondary);

              const HidePoweredBy = new ButtonBuilder()
                .setCustomId("hide-branding")
                .setLabel("Hide Powered By Urlcut")
                .setDisabled(HidePoweredBy1)
                .setStyle(ButtonStyle.Secondary);

              const BlockIOSUseragents = new ButtonBuilder()
                .setCustomId("block-ios-useragents")
                .setLabel("Block iOS Useragents")
                .setDisabled(BlockIOSUseragents1)
                .setStyle(ButtonStyle.Danger);

              const BlockAndroidUseragents = new ButtonBuilder()
                .setCustomId("block-android-useragents")
                .setLabel("Block Android Useragents")
                .setDisabled(BlockAndroidUseragents1)
                .setStyle(ButtonStyle.Danger);

              const BlockWindowsUseragents = new ButtonBuilder()
                .setCustomId("block-pc-useragents")
                .setLabel("Block PC Useragents")
                .setDisabled(BlockWindowsUseragents1)
                .setStyle(ButtonStyle.Danger);

              const row1 = new ActionRowBuilder<ButtonBuilder>().addComponents(
                confirm,
                InstantRedirect,
                OneTimeUse,
                HidePoweredBy
              );

              const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
                BlockIOSUseragents,
                BlockAndroidUseragents,
                BlockWindowsUseragents
              );

              interaction.editReply({
                embeds: [confirmEmbed],
                components: [row1, row2],
              });
            }
          }

          if (i.customId === "block-pc-useragents") {
            if (BlockAndroidUseragents1 && BlockIOSUseragents1) {
              i.reply({
                embeds: [
                  new EmbedBuilder()
                    .setColor(client.config.colors.red)
                    .setDescription(
                      `${client.config.emojis.error} You can't block both Android and iOS  and PC useragents.`
                    ),
                ],
                components: [upgrade],

                ephemeral: true,
              });
            } else {
              BlockWindowsUseragents1 = true;
              i.deferUpdate();
              const confirmEmbed = new EmbedBuilder()
                .setColor(client.config.colors.green)
                .setTitle(`Hey ${userdc?.username}!`)
                .setDescription(
                  `<:logo:1156278650367385641> Please click any other optional buttons you want to enable, then/or click the **Create Link** button to create your link.`
                );

              const confirm = new ButtonBuilder()
                .setCustomId("confirm")
                .setLabel("Create Link")
                .setStyle(ButtonStyle.Success);

              const InstantRedirect = new ButtonBuilder()
                .setCustomId("enable-instant-redirect")
                .setLabel("Instant Redirect")
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(InstantlyRedirect);

              const OneTimeUse = new ButtonBuilder()
                .setCustomId("enable-one-time")
                .setLabel("One Time Use")
                .setDisabled(OneTimeUse1)
                .setStyle(ButtonStyle.Secondary);

              const HidePoweredBy = new ButtonBuilder()
                .setCustomId("hide-branding")
                .setLabel("Hide Powered By Urlcut")
                .setDisabled(HidePoweredBy1)
                .setStyle(ButtonStyle.Secondary);

              const BlockIOSUseragents = new ButtonBuilder()
                .setCustomId("block-ios-useragents")
                .setLabel("Block iOS Useragents")
                .setDisabled(BlockIOSUseragents1)
                .setStyle(ButtonStyle.Danger);

              const BlockAndroidUseragents = new ButtonBuilder()
                .setCustomId("block-android-useragents")
                .setLabel("Block Android Useragents")
                .setDisabled(BlockAndroidUseragents1)
                .setStyle(ButtonStyle.Danger);

              const BlockWindowsUseragents = new ButtonBuilder()
                .setCustomId("block-pc-useragents")
                .setLabel("Block PC Useragents")
                .setDisabled(BlockWindowsUseragents1)
                .setStyle(ButtonStyle.Danger);

              const row1 = new ActionRowBuilder<ButtonBuilder>().addComponents(
                confirm,
                InstantRedirect,
                OneTimeUse,
                HidePoweredBy
              );

              const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
                BlockIOSUseragents,
                BlockAndroidUseragents,
                BlockWindowsUseragents
              );

              interaction.editReply({
                embeds: [confirmEmbed],
                components: [row1, row2],
              });
            }
          }

          if (i.customId === "confirm") {
            const creatingLink = new EmbedBuilder()
              .setColor(client.config.colors.green)
              .setDescription(
                `<:logo:1156278650367385641> Creating your link...`
              );

            interaction.editReply({
              embeds: [creatingLink],
              components: [],
            });

            const apiUrl = "https://api.urlcut.dev/api/links/create";
            const postData = {
              longUrl: LongLink,
              InstantRedirect: InstantlyRedirect,
              OneTimeUse: OneTimeUse1,
              HidePoweredBy: HidePoweredBy1,
              BlockIosUserAgents: BlockIOSUseragents1,
              BlockAndroidUserAgents: BlockAndroidUseragents1,
              BlockPCUserAgents: BlockWindowsUseragents1,
            };

            fetch(apiUrl, {
              method: "POST",
              body: JSON.stringify(postData),
              headers: {
                "Content-Type": "application/json",
                "x-api-key": "1QZO-7ENV-WGME-HSCG-SYBW",
              },
            })
              .then((response) => response.json())
              .then(async (data) => {
                if (data.success == true) {
                  const goto = new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setURL(data.shortUrl)
                    .setLabel("Go to link");

                  const row3 =
                    new ActionRowBuilder<ButtonBuilder>().addComponents(goto);

                  interaction.editReply({
                    embeds: [
                      new EmbedBuilder()
                        .setColor(client.config.colors.green)
                        .setDescription(
                          `${client.config.emojis.success} Your link has been created.`
                        )
                        .addFields(
                          { name: "Long URL", value: LongLink },
                          {
                            name: "Short URL",
                            value: data.shortUrl,
                            inline: true,
                          }
                        )
                        .setFooter({ text: "Powered by urlcut.dev" }),
                    ],
                    components: [row3],
                  });

                  isCreated = true;
                  const linkID = data.LinkID;

                  const user = await prisma.discordUser.findUnique({
                    where: { discordId: interaction.user.id },
                  });

                  if (user) {
                    const updatedLinks = [...user.links, linkID]; // Assuming links is an array of integers
                    const updateuser = await prisma.discordUser.update({
                      where: { discordId: interaction.user.id },
                      data: {
                        links: updatedLinks,
                      },
                    });
                  }
                }

                if (data.success == false) {
                  interaction.editReply({
                    embeds: [
                      new EmbedBuilder()
                        .setColor(client.config.colors.red)
                        .setDescription(
                          `${client.config.emojis.error} Failed to update/create the data.`
                        ),
                    ],
                  });
                }
              })
              .catch((error) => {
                console.log(error);
                interaction.editReply({
                  embeds: [
                    new EmbedBuilder()
                      .setColor(client.config.colors.red)
                      .setDescription(
                        `${client.config.emojis.error} Failed to update/create the data.`
                      ),
                  ],
                });
              });
          }
        } else {
          i.reply({
            content: `These buttons aren't for you!`,
            ephemeral: true,
          });
        }
      });

      collector.on("end", (collected) => {
        console.log(`Collected ${collected.size} interactions.`);
      });
    };
    if (!userdc) {
      const user = await prisma.discordUser.create({
        data: {
          discordId: interaction.user.id,
          username: interaction.user.username,
          pfp: interaction.user.avatarURL(),
        },
      });
      main();
    } else {
      main();
    }
  },
};

export default command;
