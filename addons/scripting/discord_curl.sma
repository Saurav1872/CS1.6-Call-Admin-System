
#include <amxmodx>
#include <json>
#include <curl>
#include <discord>

#pragma compress 1

#pragma semicolon 1


new bottoken[] = "OTE1MjM3NDM5NzUxMjAwODE5.YaYrSQ.pPEZmqeWUfRxenE__mDv0Z3dE2g";


static const params[][] = 
{
    "username",
    "avatar_url",
    "content",
    "color",
    "title_url",
    "title",
    "author_name",
    "author_avatar",
    "author_url",
    "fields",
    "timestamp",
    "footer_text",
    "footer_image",
    "embed_thumb",
    "embed_image",
    "components"
};

// #define MAX_DATA_LEN	255


new g_iMessageForward;
new g_iMessageSentResult;
new Trie:webHooks,
    Trie:message;

new messageid;

new CURL:g_cURLHandle, curl_slist:g_cURLHeaders;
public plugin_init()
{
    register_plugin("[Discord] Core", "3.5", "NIGHT HOWLER");

    new SMCParser:parser = SMC_CreateParser();

    if (parser == Invalid_SMCParser)
        set_fail_state("Error creating parser descriptor");

    SMC_SetParseStart(parser, "OnParseStart");
    SMC_SetReaders(parser, "OnKeyValue");
    SMC_SetParseEnd(parser, "OnParseEnd");

    new path[PLATFORM_MAX_PATH];
    get_localinfo("amxx_configsdir", path, PLATFORM_MAX_PATH);
    add(path, PLATFORM_MAX_PATH, "/discord.cfg");

    if(!file_exists(path))
        set_fail_state("File(%s) not found", path);

    SMC_ParseFile(parser, path);

    SMC_DestroyParser(parser);
    
    g_iMessageForward = CreateMultiForward("Discord_MessageSent_Post", ET_STOP, FP_CELL, FP_STRING, FP_STRING);
    
    
}

public plugin_natives()
{
    register_native("Discord_StartMessage", "Native_StartMessage");
    register_native("Discord_CancelMessage", "Native_CancelMessage");
    register_native("Discord_SendMessage", "Native_SendMessage");
    register_native("Discord_EditMessage", "Native_EditMessage");

    register_native("Discord_SetStringParam", "Native_SetStringParam");
    register_native("Discord_SetCellParam", "Native_SetCellParam");
    register_native("Discord_AddField", "Native_AddField");
    register_native("Discord_AddLinkButton", "Native_AddLinkButton");

    register_native("Discord_WebHookExists", "Native_WebHookExists");
}

public OnParseStart(SMCParser:handle, any:data)
{
    if (webHooks == Invalid_Trie)
        webHooks = TrieCreate();
}

public SMCResult:OnKeyValue(SMCParser:handle, const key[], const value[], any:data)
{
    if (webHooks != Invalid_Trie)
    {
        TrieSetString(webHooks, key, value);

        return SMCParse_Continue;
    }

    return SMCParse_HaltFail;
}

public OnParseEnd(SMCParser:handle, bool:halted, bool:failed, any:data)
{
    if (webHooks == Invalid_Trie || failed)
        set_fail_state("Error during config parsing");
}

bool:ValidMessage()
{
    if (message != Invalid_Trie)
        return true;

    log_amx("No one message in prepare progress");

    return false;
}

CancelMessage()
{
    if (message != Invalid_Trie)
        TrieDestroy(message);
}

public OnNextTick(data)
{
    CancelMessage();
}

BuildMap(param, param_string[] = "", param_string2[] = "", short = false, param_num = 0, param_num2 = 0)
{  
    switch(param)
    {
        case USERNAME: TrieSetString(message, params[USERNAME], param_string);
        case AVATAR_URL: TrieSetString(message, params[AVATAR_URL], param_string);
        case CONTENT: TrieSetString(message, params[CONTENT], param_string);
        case COLOR: TrieSetCell(message, params[COLOR], param_num);
        case TITLE_URL: TrieSetString(message, params[TITLE_URL], param_string);
        case TITLE: TrieSetString(message, params[TITLE], param_string);
        case AUTHOR_NAME: TrieSetString(message, params[AUTHOR_NAME], param_string);
        case AUTHOR_AVATAR: TrieSetString(message, params[AUTHOR_AVATAR], param_string);
        case AUTHOR_URL: TrieSetString(message, params[AUTHOR_URL], param_string);
        case TIMESTAMP: TrieSetCell(message, params[TIMESTAMP], param_num);
        case FOOTER_TEXT: TrieSetString(message, params[FOOTER_TEXT], param_string);
        case FOOTER_IMAGE: TrieSetString(message, params[FOOTER_IMAGE], param_string);
        case EMBED_THUMB: TrieSetString(message, params[EMBED_THUMB], param_string);
        case EMBED_IMAGE: TrieSetString(message, params[EMBED_IMAGE], param_string);
    }

    if (param == FIELDS)
    {
        new Trie:collection = TrieCreate();
        new Array:array;

        if (!TrieGetCell(message, params[FIELDS], array))
            array = ArrayCreate();

        TrieSetString(collection, "title", param_string);
        TrieSetString(collection, "text", param_string2);
        TrieSetCell(collection, "short", short);

        ArrayPushCell(array, collection);
        TrieSetCell(message, params[FIELDS], array);
    }
   // BuildMap(COMPONENTS, title, text, _, 2, 5, url);
    
    if (param == COMPONENTS)
    {
        new Trie:collection = TrieCreate();
        new Array:array;

        if (!TrieGetCell(message, params[COMPONENTS], array))
            array = ArrayCreate();

        TrieSetCell(collection, "type", param_num);
        TrieSetCell(collection, "style", param_num2);
        TrieSetString(collection, "label", param_string);
        TrieSetString(collection, "url", param_string2);

        ArrayPushCell(array, collection);
        TrieSetCell(message, params[COMPONENTS], array);
    }
    
}

SendMessage(webhook[], const data[])
{
    new JSON:collection = json_init_object();

    new buffer[1024], number, JSON:tempObject, bool:mark;

    if (TrieGetString(message, "username", buffer, sizeof buffer))
    {
        json_object_set_string(collection, "username", buffer);
    }

    if (TrieGetString(message, "avatar_url", buffer, sizeof buffer))
    {
        json_object_set_string(collection, "avatar_url", buffer);
    }

    if (TrieGetString(message, "content", buffer, sizeof buffer))
    {
        json_object_set_string(collection, "content", buffer);
    }

    new JSON:arrayEmbeds = json_init_array();
    new JSON:objectEmbeds = json_init_object();

    if (TrieGetCell(message, "color", number))
    {
        json_object_set_number(objectEmbeds, "color", number);
    }

    if (TrieGetString(message, "title_url", buffer, sizeof buffer))
    {
        json_object_set_string(objectEmbeds, "title_url", buffer);
    }

    if (TrieGetString(message, "title", buffer, sizeof buffer))
    {
        json_object_set_string(objectEmbeds, "title", buffer);
    }

    if (TrieGetCell(message, "timestamp", number))
    {
        format_time(buffer, sizeof buffer, "%Y-%m-%dT%H:%M:%SZ", number);
        json_object_set_string(objectEmbeds, "timestamp", buffer);
    }

    if (TrieGetString(message, "embed_thumb", buffer, sizeof buffer))
    {
        tempObject = json_init_object();
        json_object_set_string(tempObject, "url", buffer);
        json_object_set_value(objectEmbeds, "thumbnail", tempObject);
        json_free(tempObject);
    }

    if (TrieGetString(message, "embed_image", buffer, sizeof buffer))
    {
        tempObject = json_init_object();
        json_object_set_string(tempObject, "url", buffer);
        json_object_set_value(objectEmbeds, "image", tempObject);
        json_free(tempObject);
    }

    tempObject = json_init_object();

    if (TrieGetString(message, "author_name", buffer, sizeof buffer))
    {
        json_object_set_string(tempObject, "name", buffer);
        mark = true;
    }

    if (TrieGetString(message, "author_avatar", buffer, sizeof buffer))
    {
        json_object_set_string(tempObject, "icon_url", buffer);
        mark = true;
    }

    if (TrieGetString(message, "author_url", buffer, sizeof buffer))
    {
        json_object_set_string(tempObject, "url", buffer);
        mark = true;
    }

    if (mark)
    {
        json_object_set_value(objectEmbeds, "author", tempObject);
        mark = false;
    }

    json_free(tempObject);

    tempObject = json_init_object();

    if (TrieGetString(message, "footer_text", buffer, sizeof buffer))
    {
        json_object_set_string(tempObject, "text", buffer);
        mark = true;
    }

    if (TrieGetString(message, "footer_image", buffer, sizeof buffer))
    {
        json_object_set_string(tempObject, "icon_url", buffer);
        mark = true;
    }

    if (mark)
    {
        json_object_set_value(objectEmbeds, "footer", tempObject);
        mark = false;
    }

    json_free(tempObject);
    
    new Array:array;

    if (TrieGetCell(message, "fields", array))
    {
        new JSON:fields = json_init_array();
        new Trie:map;

        for (new i; i < ArraySize(array); i++)
        {
            map = ArrayGetCell(array, i);
            tempObject = json_init_object();

            if (TrieGetString(map, "title", buffer, sizeof buffer))
            {
                json_object_set_string(tempObject, "name", buffer);
            }

            if (TrieGetString(map, "text", buffer, sizeof buffer))
            {
                json_object_set_string(tempObject, "value", buffer);
            }

            if (TrieGetCell(map, "short", mark))
            {
                json_object_set_bool(tempObject, "inline", mark);
            }

            json_array_append_value(fields, tempObject);
            json_free(tempObject);
            TrieDestroy(map);
        }

        ArrayDestroy(array);

        json_object_set_value(objectEmbeds, "fields", fields);
        json_free(fields);    
    }

    json_array_append_value(arrayEmbeds, objectEmbeds);
    json_object_set_value(collection, "embeds", arrayEmbeds);
    
    ////////////////////
    
    new Array:arrayc;
    
    if (TrieGetCell(message, "components", arrayc))
    {
        
        new JSON:arrayComponents = json_init_array();
        new JSON:objectComponents = json_init_object();
        json_object_set_number(objectComponents, "type", 1);
        
        new JSON:components = json_init_array();
        new Trie:bmap;
        
        for (new i; i < ArraySize(arrayc); i++)
        {
            bmap = ArrayGetCell(arrayc, i);
            tempObject = json_init_object();

            if(TrieGetCell(bmap, "type", number))
            {
                json_object_set_number(tempObject, "type", number);
            }
	    
	    if(TrieGetCell(bmap, "style", number))
            {
                json_object_set_number(tempObject, "style", number);
            }

            if(TrieGetString(bmap, "label", buffer, sizeof buffer))
            {
                json_object_set_string(tempObject, "label", buffer);
            }

            if(TrieGetString(bmap, "url", buffer, sizeof buffer))
            {
                json_object_set_string(tempObject, "url", buffer);
            }

            json_array_append_value(components, tempObject);
            json_free(tempObject);
            TrieDestroy(bmap);
        }

        ArrayDestroy(arrayc);

        json_object_set_value(objectComponents, "components", components);
        json_free(components);  
        
        json_array_append_value(arrayComponents, objectComponents);
        json_object_set_value(collection, "components", arrayComponents);
    }
    
    
    new ctime[64];
    get_time("%m%d%Y%H%M%S", ctime, charsmax(ctime));
    
    new file[256];
    formatex(file, charsmax(file), "datacalladmin.txt");
    //json_serial_to_file( collection, file, true );
    static sPostdata[3024];
    json_serial_to_string(collection, sPostdata, charsmax(sPostdata));
    write_file(file, sPostdata);

    if(TrieGetString(webHooks, webhook, buffer, sizeof buffer))
    {
    	
	postJSON(buffer, JSON:collection, data);
	
    }

    json_free(objectEmbeds);
    json_free(arrayEmbeds);
    json_free(collection);
}

#define CURL_BUFFER_SIZE 512


postJSON(const link[], JSON:jObject, const datamsg[])
{
	
	static szPostdata[3024];
	json_serial_to_string(jObject, szPostdata, charsmax(szPostdata));
	replace_string(szPostdata, charsmax(szPostdata), "\n", "n", true);
	
	
	
	new data[MAX_DATA_LEN + 5];
	if (!g_cURLHandle)
	{
		if (!(g_cURLHandle = curl_easy_init()))
		{
			log_amx("[Fatal Error] Cannot Init cURL Handle.");
			pause("d");
			return;
		}
		if (!g_cURLHeaders)
		{
			new szText[555];
			formatex(szText, charsmax(szText), "Authorization: Bot %s", bottoken);
			g_cURLHeaders = curl_slist_append(g_cURLHeaders, szText);
			curl_slist_append(g_cURLHeaders, "Content-Type: application/json");
			
		}

		
		
	}
	
	// Static Options
	curl_easy_setopt(g_cURLHandle, CURLOPT_SSL_VERIFYPEER, 0);
	curl_easy_setopt(g_cURLHandle, CURLOPT_SSL_VERIFYHOST, 0);
	curl_easy_setopt(g_cURLHandle, CURLOPT_SSLVERSION, CURL_SSLVERSION_TLSv1);
	curl_easy_setopt(g_cURLHandle, CURLOPT_FAILONERROR, 0);
	curl_easy_setopt(g_cURLHandle, CURLOPT_FOLLOWLOCATION, 0);
	curl_easy_setopt(g_cURLHandle, CURLOPT_FORBID_REUSE, 0);
	curl_easy_setopt(g_cURLHandle, CURLOPT_FRESH_CONNECT, 1);
	curl_easy_setopt(g_cURLHandle, CURLOPT_CONNECTTIMEOUT, 10);
	curl_easy_setopt(g_cURLHandle, CURLOPT_TIMEOUT, 10);
	curl_easy_setopt(g_cURLHandle, CURLOPT_HTTPHEADER, g_cURLHeaders);
	
	if(file_exists("addons/amxmodx/discord_webhook_data.txt"))
	{
		delete_file("addons/amxmodx/discord_webhook_data.txt");
	}
	formatex(data, charsmax(data), "11%s", datamsg);
	data[0] = fopen("addons/amxmodx/discord_webhook_data.txt", "wb");
	data[1] = messageid;
	
	curl_easy_setopt(g_cURLHandle, CURLOPT_CUSTOMREQUEST, "POST");
	curl_easy_setopt(g_cURLHandle, CURLOPT_BUFFERSIZE, CURL_BUFFER_SIZE);
	curl_easy_setopt(g_cURLHandle, CURLOPT_WRITEDATA, data[0]);
	curl_easy_setopt(g_cURLHandle, CURLOPT_WRITEFUNCTION, "write");
	//curl_easy_setopt(g_cURLHandle, CURLOPT_POST, 1);
	curl_easy_setopt(g_cURLHandle, CURLOPT_URL, link);
	curl_easy_setopt(g_cURLHandle, CURLOPT_COPYPOSTFIELDS, szPostdata);
	
	curl_easy_perform(g_cURLHandle, "postJSON_done", data, sizeof(data));

	
}


public write(data[], size, nmemb, file)
{
	new actual_size = size * nmemb;
   
	fwrite_blocks(file, data, actual_size, BLOCK_CHAR);
   
	return actual_size;
}


public postJSON_done(CURL:curl, CURLcode:code, data[])
{
	if (code == CURLE_OK)
	{
		static statusCode;
		curl_easy_getinfo(curl, CURLINFO_RESPONSE_CODE, statusCode);
		if (statusCode >= 400)
		{
			log_amx("[Discord] HTTP Error: %d", statusCode);
			//client_print(0, print_chat, "[Error] HTTP Error: %d", statusCode);
			
		}
		curl_easy_cleanup(g_cURLHandle);
		g_cURLHandle = CURL:0;
	}
	else
	{
		log_amx("[Discord] cURL Error: %d", code);
		//client_print(0, print_chat, "[Error] cURL Error: %d", code);
		curl_easy_cleanup(g_cURLHandle);
		//g_cURLHandle = CURL:0;
		g_cURLHandle = CURL:0;
	}
	fclose(data[0]);
	readJsonReceipt(data);
	
} 

public readJsonReceipt(data[])
{
	new messageidstr[32];
	
	new JSON:object = json_parse("addons/amxmodx/discord_webhook_data.txt", true);
	new JSON:value;
	
	if(json_is_object(object))
	{
		new count = json_object_get_count(object);
		new key[20]; //stores key name
		for (new i = 0; i < count; i++)
		{
			json_object_get_name(object, i, key, charsmax(key));
			
			
			if(equal(key, "id"))
			{
				json_object_get_string(object, key, messageidstr, charsmax(messageidstr), false);
			}
			
			value = json_object_get_value_at(object, i);
			//Get type of value and do something
			//...
			//Free at the end
			json_free(value);
		}
		//Free object
		
		new msgid = data[1];
		new msgdaat[MAX_DATA_LEN];
		formatex(msgdaat, charsmax(msgdaat), "%s", data[2]);
		
		ExecuteForward(g_iMessageForward, g_iMessageSentResult, msgid, messageidstr, msgdaat);
	}
	else
	{
		server_print("[CALL ADMIN] SOMETHING WENT WRONG WHILE PARSING");
	}
	json_free(object);	
	
}



EditMessage(webhook[], messageID[], data[])
{
    new JSON:collection = json_init_object();

    new buffer[1024], number, JSON:tempObject, bool:mark;

    if (TrieGetString(message, "username", buffer, sizeof buffer))
    {
        json_object_set_string(collection, "username", buffer);
    }

    if (TrieGetString(message, "avatar_url", buffer, sizeof buffer))
    {
        json_object_set_string(collection, "avatar_url", buffer);
    }

    if (TrieGetString(message, "content", buffer, sizeof buffer))
    {
        json_object_set_string(collection, "content", buffer);
    }

    new JSON:arrayEmbeds = json_init_array();
    new JSON:objectEmbeds = json_init_object();

    if (TrieGetCell(message, "color", number))
    {
        json_object_set_number(objectEmbeds, "color", number);
    }

    if (TrieGetString(message, "title_url", buffer, sizeof buffer))
    {
        json_object_set_string(objectEmbeds, "title_url", buffer);
    }

    if (TrieGetString(message, "title", buffer, sizeof buffer))
    {
        json_object_set_string(objectEmbeds, "title", buffer);
    }

    if (TrieGetCell(message, "timestamp", number))
    {
        format_time(buffer, sizeof buffer, "%Y-%m-%dT%H:%M:%SZ", number);
        json_object_set_string(objectEmbeds, "timestamp", buffer);
    }

    if (TrieGetString(message, "embed_thumb", buffer, sizeof buffer))
    {
        tempObject = json_init_object();
        json_object_set_string(tempObject, "url", buffer);
        json_object_set_value(objectEmbeds, "thumbnail", tempObject);
        json_free(tempObject);
    }

    if (TrieGetString(message, "embed_image", buffer, sizeof buffer))
    {
        tempObject = json_init_object();
        json_object_set_string(tempObject, "url", buffer);
        json_object_set_value(objectEmbeds, "image", tempObject);
        json_free(tempObject);
    }

    tempObject = json_init_object();

    if (TrieGetString(message, "author_name", buffer, sizeof buffer))
    {
        json_object_set_string(tempObject, "name", buffer);
        mark = true;
    }

    if (TrieGetString(message, "author_avatar", buffer, sizeof buffer))
    {
        json_object_set_string(tempObject, "icon_url", buffer);
        mark = true;
    }

    if (TrieGetString(message, "author_url", buffer, sizeof buffer))
    {
        json_object_set_string(tempObject, "url", buffer);
        mark = true;
    }

    if (mark)
    {
        json_object_set_value(objectEmbeds, "author", tempObject);
        mark = false;
    }

    json_free(tempObject);

    tempObject = json_init_object();

    if (TrieGetString(message, "footer_text", buffer, sizeof buffer))
    {
        json_object_set_string(tempObject, "text", buffer);
        mark = true;
    }

    if (TrieGetString(message, "footer_image", buffer, sizeof buffer))
    {
        json_object_set_string(tempObject, "icon_url", buffer);
        mark = true;
    }

    if (mark)
    {
        json_object_set_value(objectEmbeds, "footer", tempObject);
        mark = false;
    }

    json_free(tempObject);
    
    new Array:array;

    if (TrieGetCell(message, "fields", array))
    {
        new JSON:fields = json_init_array();
        new Trie:map;

        for (new i; i < ArraySize(array); i++)
        {
            map = ArrayGetCell(array, i);
            tempObject = json_init_object();

            if (TrieGetString(map, "title", buffer, sizeof buffer))
            {
                json_object_set_string(tempObject, "name", buffer);
            }

            if (TrieGetString(map, "text", buffer, sizeof buffer))
            {
                json_object_set_string(tempObject, "value", buffer);
            }

            if (TrieGetCell(map, "short", mark))
            {
                json_object_set_bool(tempObject, "inline", mark);
            }

            json_array_append_value(fields, tempObject);
            json_free(tempObject);
            TrieDestroy(map);
        }

        ArrayDestroy(array);

        json_object_set_value(objectEmbeds, "fields", fields);
        json_free(fields);    
    }

    json_array_append_value(arrayEmbeds, objectEmbeds);
    json_object_set_value(collection, "embeds", arrayEmbeds);
    
    
    
    
     ////////////////////
    
    new Array:arrayc;
    
    if (TrieGetCell(message, "components", arrayc))
    {
        
        new JSON:arrayComponents = json_init_array();
        new JSON:objectComponents = json_init_object();
        json_object_set_number(objectComponents, "type", 1);
        
        new JSON:components = json_init_array();
        new Trie:bmap;
        
        for (new i; i < ArraySize(arrayc); i++)
        {
            bmap = ArrayGetCell(arrayc, i);
            tempObject = json_init_object();

            if(TrieGetCell(bmap, "type", number))
            {
                json_object_set_number(tempObject, "type", number);
            }
	    
	    if(TrieGetCell(bmap, "style", number))
            {
                json_object_set_number(tempObject, "style", number);
            }

            if(TrieGetString(bmap, "label", buffer, sizeof buffer))
            {
                json_object_set_string(tempObject, "label", buffer);
            }

            if(TrieGetString(bmap, "url", buffer, sizeof buffer))
            {
                json_object_set_string(tempObject, "url", buffer);
            }

            json_array_append_value(components, tempObject);
            json_free(tempObject);
            TrieDestroy(bmap);
        }

        ArrayDestroy(arrayc);

        json_object_set_value(objectComponents, "components", components);
        json_free(components);  
        
        json_array_append_value(arrayComponents, objectComponents);
        json_object_set_value(collection, "components", arrayComponents);
    }
    
    //////////////////////
    
    if(TrieGetString(webHooks, webhook, buffer, sizeof buffer))
    {
    	
	postEditJSON(buffer, JSON:collection, messageID, data);
	
    }

    json_free(objectEmbeds);
    json_free(arrayEmbeds);
    json_free(collection);
}


postEditJSON(const link[], JSON:jObject, const messageID[], const datamsg[])
{
	new data[MAX_DATA_LEN + 5];
	
	if (!g_cURLHandle)
	{
		if (!(g_cURLHandle = curl_easy_init()))
		{
			log_amx("[Fatal Error] Cannot Init cURL Handle.");
			pause("d");
			return;
		}
		if (!g_cURLHeaders)
		{	
			new szText[555];
			formatex(szText, charsmax(szText), "Authorization: Bot %s", bottoken);
			g_cURLHeaders = curl_slist_append(g_cURLHeaders, szText);
			curl_slist_append(g_cURLHeaders, "Content-Type: application/json");
		}

		
		
		
	}
	
	// Static Options
	curl_easy_setopt(g_cURLHandle, CURLOPT_SSL_VERIFYPEER, 0);
	curl_easy_setopt(g_cURLHandle, CURLOPT_SSL_VERIFYHOST, 0);
	curl_easy_setopt(g_cURLHandle, CURLOPT_SSLVERSION, CURL_SSLVERSION_TLSv1);
	curl_easy_setopt(g_cURLHandle, CURLOPT_FAILONERROR, 0);
	curl_easy_setopt(g_cURLHandle, CURLOPT_FOLLOWLOCATION, 0);
	curl_easy_setopt(g_cURLHandle, CURLOPT_FORBID_REUSE, 0);
	curl_easy_setopt(g_cURLHandle, CURLOPT_FRESH_CONNECT, 1);
	curl_easy_setopt(g_cURLHandle, CURLOPT_CONNECTTIMEOUT, 10);
	curl_easy_setopt(g_cURLHandle, CURLOPT_TIMEOUT, 10);
	curl_easy_setopt(g_cURLHandle, CURLOPT_HTTPHEADER, g_cURLHeaders);
	
	if(file_exists("addons/amxmodx/discord_webhook_editdata.txt"))
	{
		delete_file("addons/amxmodx/discord_webhook_editdata.txt");
	}

	formatex(data, charsmax(data), "11%s", datamsg);
	data[0] = fopen("addons/amxmodx/discord_webhook_editdata.txt", "wb");
	data[1] = messageid;
	
	
	static szPostdata[3024];
	json_serial_to_string(jObject, szPostdata, charsmax(szPostdata));
	
	replace_string(szPostdata, charsmax(szPostdata), "\n", "n", true);
	
	new url[256];
	formatex(url, charsmax(url), "%s/%s", link, messageID);
	
	//server_print("Link: %s", url);

	curl_easy_setopt(g_cURLHandle, CURLOPT_CUSTOMREQUEST, "PATCH");
	curl_easy_setopt(g_cURLHandle, CURLOPT_BUFFERSIZE, CURL_BUFFER_SIZE);
	curl_easy_setopt(g_cURLHandle, CURLOPT_WRITEDATA, data[0]);
	curl_easy_setopt(g_cURLHandle, CURLOPT_WRITEFUNCTION, "editwrite");
	curl_easy_setopt(g_cURLHandle, CURLOPT_URL, url);
	curl_easy_setopt(g_cURLHandle, CURLOPT_COPYPOSTFIELDS, szPostdata);
	
	curl_easy_perform(g_cURLHandle, "postEditJSON_done", data, sizeof(data));
	
}


public editwrite(data[], size, nmemb, file)
{
	new actual_size = size * nmemb;
   
	fwrite_blocks(file, data, actual_size, BLOCK_CHAR);
   
	return actual_size;
}


public postEditJSON_done(CURL:curl, CURLcode:code, data[])
{
	if (code == CURLE_OK)
	{
		static statusCode;
		curl_easy_getinfo(curl, CURLINFO_RESPONSE_CODE, statusCode);
		if (statusCode >= 400)
		{
			log_amx("[Error Edit] HTTP Error: %d", statusCode);
		}
	}
	else
	{
		log_amx("[Error] cURL Error: %d", code);
		curl_easy_cleanup(g_cURLHandle);
		g_cURLHandle = CURL:0;
	}
	fclose(data[0]);
	readEditJsonReceipt(data);
	
} 

public readEditJsonReceipt(data[])
{
	new messageidstr[32];
	
	new JSON:object = json_parse("addons/amxmodx/discord_webhook_editdata.txt", true);
	new JSON:value;
	
	if(json_is_object(object))
	{
		new count = json_object_get_count(object);
		new key[20]; //stores key name
		for (new i = 0; i < count; i++)
		{
			json_object_get_name(object, i, key, charsmax(key));
			
			if(equal(key, "id"))
			{
				json_object_get_string(object, key, messageidstr, charsmax(messageidstr), false);
			}
			
			value = json_object_get_value_at(object, i);
			//Get type of value and do something
			//...
			//Free at the end
			json_free(value);
		}
		//Free object
		
		new msgid = data[1], msgdata[MAX_DATA_LEN+1];
		formatex(msgdata, charsmax(msgdata), "%s", data[2]);
		
		ExecuteForward(g_iMessageForward, g_iMessageSentResult, msgid, messageidstr, msgdata);
	}
	else
	{
		server_print("[CALL ADMIN] SOMETHING WENT WRONG WHILE PARSING");
	}
	json_free(object);
	
}

public plugin_end()
{
	if (g_cURLHandle)
	{
		curl_easy_cleanup(g_cURLHandle);
		g_cURLHandle = CURL:0;
	}
	if (g_cURLHeaders)
	{
		curl_slist_free_all(g_cURLHeaders);
		g_cURLHeaders = curl_slist:0;
	}
	
}


//public HandleRequest() {}

public Native_StartMessage(plugin_id, argc)
{
    if (message != Invalid_Trie)
    {
        log_amx("Couldn't start another message: currently we processing another message.");
        return false;
    }

    message = TrieCreate();
    RequestFrame("OnNextTick");
    
    messageid++;

    return messageid;
}



public Native_CancelMessage(plugin_id, argc)
{
    CancelMessage();
}

public Native_SendMessage(plugin_id, argc)
{
    new buffer[64], data[MAX_DATA_LEN];
    get_string(1, buffer, sizeof buffer);
    get_string(2, data, MAX_DATA_LEN);
    
    

    SendMessage(buffer, data);
    CancelMessage();
}

public Native_EditMessage(plugin_id, argc)
{
    new buffer[64];
    new buffer2[64], data[MAX_DATA_LEN];
    get_string(1, buffer, sizeof buffer);
    get_string(2, buffer2, sizeof buffer2);
    get_string(3, data, MAX_DATA_LEN);

    EditMessage(buffer, buffer2, data);
    CancelMessage();
}

public Native_SetStringParam(plugin_id, argc)
{
    if (!ValidMessage()) return;

    new buffer[1024];

    if (argc == 2)
    {
        get_string(2, buffer, sizeof buffer);
    }
    else if(argc > 2)
    {
        vdformat(buffer, sizeof buffer, 2, 3);
    }

    BuildMap(get_param(1), buffer);
}

public Native_SetCellParam(plugin_id, argc)
{
    if (!ValidMessage()) return;

    BuildMap(get_param(1), _, _, _, get_param(2));
}

public Native_AddField(plugin_id, argc)
{
    if (!ValidMessage()) return;

    new title[512], text[512], inline;

    get_string(1, title, sizeof title);
    get_string(2, text, sizeof text);

    inline = get_param(3);

    BuildMap(FIELDS, title, text, inline);
}

public Native_AddLinkButton(plugin_id, argc)
{
    if (!ValidMessage()) return;

    new title[512], url[512];

    get_string(1, title, sizeof title);
    get_string(2, url, sizeof url);

    CreateButton(title, url);
}

public CreateButton(title[], url[])
{
	BuildMap(COMPONENTS, title, url, _, 2, 5);
	
}
public Native_WebHookExists(plugin_id, argc)
{
    new buffer[256];
    get_string(1, buffer, sizeof buffer);

    return TrieKeyExists(message, buffer);
}
