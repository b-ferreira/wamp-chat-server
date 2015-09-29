// Internal modules
var _chatEvents = require('../events/chatEvents.js');

/*
 * Local vars
 */
// Participants' list
var participantsList = [];

/*
 * This module'll be used to keep any behavior related to chat participants. 
 * The current Autobahn's session need to be passed as parameter for this module.
 */
module.exports = function(session) {
	var module = {};

	// Checks if the username already exists in user's list. 
	// If it doesn't exists in the list, append the username to the list and notify user that login was successfully done.
	// If it exists in the list, return an error on callback.
	module.login = function(participant) {
		if (participantsList.filter(function(elm) {
				return elm.username == participant.username;
			}).length == 0) {
			participantsList.push(participant);
			return true;
		} else return false;
	}

	// Removes the username from participant's List and just return a message for logout.
	module.logout = function(args) {
		var username = args[0];
		var userIdx = 0;
		var participant = {};

		for (userIdx; userIdx < participantsList.length; userIdx++) {
			if (participantsList[userIdx].username == username) {
				participant = participantsList[userIdx];
				participantsList.splice(userIdx, 1);
				break;
			}
		};

		// publish that a user has logged out.
		session.publish(_chatEvents.participantLoggedOut, [participant]);

		return "Logged out!";
	}

	// Returns the participants' list.
	module.getParticipants = function() {
		return participantsList;
	}

	return module;
};