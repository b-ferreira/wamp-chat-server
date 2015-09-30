///////////////////////////////////////////////////////////////////////////////
//
//  Copyright (C) 2015, Bruno Ferreira. All rights reserved.
//
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//  1. Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//
//  2. Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//
//  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
//  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
//  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
//  ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
//  LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
//  CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
//  SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
//  INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
//  CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
//  ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
//  POSSIBILITY OF SUCH DAMAGE.
//
///////////////////////////////////////////////////////////////////////////////

// external modules
var autobahn = require('autobahn');

// internal modules
var _chatEvents = require('./events/chatEvents.js');
var _errorEvents = require('./events/errorEvents.js');

// Creates a new WAMP realm on localhost.
var connection = new autobahn.Connection({
   url: 'ws://127.0.0.1:9000/ws',
   realm: 'realm1'
});

connection.onopen = function (session) {

	// Participants capabilities.
	var _partipants = require('./participants/participants.js')(session);

	/*
	 * Remote Procedure Calls capabilities
	 */
	// REGISTER login procedure;
	function performLogin(args) {

		var participant = {
			username: args[0],
			guid: args[1]
		}
		
		console.log("Login called...", participant.username);

		if (_partipants.login(participant)) {
			//Publish that a new user has logged in.
			session.publish(_chatEvents.newParticipant, [participant]);

			// Returns an instance of user which has logged in.
			return {
				status: "OK",
				data: participant
			};
		} else throw new autobahn.Error(_errorEvents.userAlreadyExists, [], {code:"001"});
	}
	session.register(_chatEvents.login, performLogin).then(
		function (reg) {
			console.log("procedure login() registered");
		},
		function (err) {
			console.log("failed to register procedure login(): " + err);
		}
	);

	// REGISTER logout procedure;
	session.register(_chatEvents.logout, _partipants.logout).then(
		function (reg) {
			console.log("procedure logout() registered");
		},
		function (err) {
			console.log("failed to register procedure logout(): " + err);
		}
	);

	// REGISTER get participants' list
	session.register(_chatEvents.getParticipants, _partipants.getParticipants).then(
		function (reg) {
			console.log("procedure getparticipants() registered");
		},
		function (err) {
			console.log("failed to register procedure getparticipants(): " + err);
		}
	);
}

connection.open();