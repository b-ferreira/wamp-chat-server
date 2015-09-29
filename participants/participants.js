// Internal modules
var _chatEvents = require('../events/chatEvents.js');

// Local vars
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
	module.login = function(username) {
		if (participantsList.indexOf(username) == -1) {
			participantsList.push(username);
			return true;
		} else return false;
	}

	// Removes the username from participant's List and just return a message for logout.
	module.logout = function(username) {		
		var userIdx = participantsList.indexOf(username);
		if (userIdx > -1) {
			participantsList.splice(userIdx, 1);			
		}

		// publish that a user has logged out.
		session.publish(_chatEvents.participantLoggedOut, [username]);

		return "Logged out!";
	}

	// Returns the participants' list.
	module.getParticipants = function() {
		return participantsList;
	}

	module.onMessage = function() {
		
	}

	return module;
};