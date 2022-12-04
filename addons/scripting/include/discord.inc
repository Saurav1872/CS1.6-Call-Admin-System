#if defined _discord_included
	#endinput
#endif
#define _discord_included



#define MAX_DATA_LEN	255

enum 
{
    USERNAME,
    AVATAR_URL,
    CONTENT,
    COLOR, // Discord_SetCellParam
    TITLE_URL,
    TITLE,
    AUTHOR_NAME,
    AUTHOR_AVATAR,
    AUTHOR_URL,
    FIELDS, // Discord_AddField
    TIMESTAMP, // Discord_SetCellParam
    FOOTER_TEXT,
    FOOTER_IMAGE,
    EMBED_THUMB,
    EMBED_IMAGE,
    COMPONENTS
}

/**
 * Starts a new message for webhook.
 * WARNING! If you don't call EndMessage() in one tick with StartMessage(), message automatically has been cancelled!
 *
 * @return  bool
 */
native bool:Discord_StartMessage();

/**
 * Cancels a current Discord Message.
 *
 * @return  void
 */
native Discord_CancelMessage();

/**
 * Ends a message, sending into Discord WebHook.
 *
 * @param   webHook   WebHook name from configuration file.
 *
 * @return  void
 */
native Discord_SendMessage(const webHook[], const data[] = {});

/**
 * Ends a message, sending into Discord WebHook.
 *
 * @param   webHook   WebHook name from configuration file.
 * @param   messageID   messageID of the msg from BOT
 *
 * @return  void
 */
native Discord_EditMessage(const webHook[], const messageID[], const data[] = {});

/**
 * Setting string parameters
 *
 * @param   param   Parameter Number (enum)
 * @param   text    Formatted text content
 *
 * @return  void
 */
native Discord_SetStringParam(const param, const text[], ...);

/**
 * Setting numeric parameters
 *
 * @param   param   Parameter Number (enum)
 * @param   value   Numerical value
 *
 * @return  void
 */
native Discord_SetCellParam(const param, const value);

/**
 * Adds a field to an array
 *
 * @param   title   Name
 * @param   value   Text
 * @param   inline if true, fields will be displayed in same line, but there can only be 3 max in same line or 2 max if you used thumbnail
 *
 * @return  void
 */
native Discord_AddField(const title[], const value[], bool:inline = false);


/**
 * Adds a field to an array
 *
 * @param   title   Name
 * @param   value   URL
 *
 * @return  void
 */
native Discord_AddLinkButton(const title[], const url[]);

/**
 * Checks for a webhook in the configuration file.
 *
 * @param   webHook   Webhook title
 *
 * @return  bool
 */
native bool:Discord_WebHookExists(const webHook[]);

/**
 * Returns an extra item's ID.
 *
 * @param MsgHandle	Message Index
 * @param messageID	Message ID of discord message sent
 * @return		Internal extra item ID, or -1 if not found.
 */
forward Discord_MessageSent_Post(MsgHandle, const messageID[], const data[]);
/* AMXX-Studio Notes - DO NOT MODIFY BELOW HERE
*{\\ rtf1\\ ansi\\ deff0{\\ fonttbl{\\ f0\\ fnil Tahoma;}}\n\\ viewkind4\\ uc1\\ pard\\ lang1033\\ f0\\ fs16 \n\\ par }
*/
