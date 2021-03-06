var Dota2 = require("../index"),
    merge = require("merge")
    fs = require("fs"),
    util = require("util"),
    Schema = require('protobuf').Schema,
    base_gcmessages = new Schema(fs.readFileSync(__dirname + "/../generated/base_gcmessages.desc")),
    gcsdk_gcmessages = new Schema(fs.readFileSync(__dirname + "/../generated/gcsdk_gcmessages.desc")),
    dota_gcmessages_client = new Schema(fs.readFileSync(__dirname + "/../generated/dota_gcmessages_client.desc")),
    protoMask = 0x80000000;

// Methods

Dota2.Dota2Client.prototype.findSourceTVGames = function(filterOptions) {
    // callback = callback || null;
    /* Sends a message to the Game Coordinator requesting `accountId`'s profile data.  Listen for `profileData` event for Game Coordinator's response. */
    if (!this._gcReady) {
        if (this.debug) util.log("GC not ready, please listen for the 'ready' event.");
        return null;
    }

    if (this.debug) util.log("Sending find SourceTV games request");

    /* Using default params and merging with filterOptions, note: numGames is ignored from GC and > 6 causes no response at all */
    var payload = dota_gcmessages_client.CMsgClientToGCFindTopSourceTVGames.serialize(merge({
        searchKey: '',
        leagueId: 0,
        heroId: 0,
        startGame: 0,
        gameListIndex: 0,
        lobbyIds: []
    },filterOptions));

    this._client.toGC(this._appid, (Dota2.EDOTAGCMsg.k_EMsgClientToGCFindTopSourceTVGames | protoMask), payload);
};

// Handlers

var handlers = Dota2.Dota2Client.prototype._handlers;

handlers[Dota2.EDOTAGCMsg.k_EMsgGCToClientFindTopSourceTVGamesResponse] = function onSourceTVGamesResponse(message) {
    // callback = callback || null;
    var sourceTVGamesResponse = dota_gcmessages_client.CMsgGCToClientFindTopSourceTVGamesResponse.parse(message);

    // if (typeof sourceTVGamesResponse.gameList !== "undefined" && sourceTVGamesResponse.gameList.length > 0) {
        if (this.debug) util.log("Received SourceTV games data");
          this.emit("sourceTVGamesResponse", sourceTVGamesResponse);

        // if (callback) callback(sourceTVGamesResponse);
    // }
    // else {
        // if (this.debug) util.log("Received a bad SourceTV games response");
        // if (callback) callback(sourceTVGamesResponse.result, sourceTVGamesResponse);
    // }
};