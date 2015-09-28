/*
 *	Application's event to perform RPC and/or Publish/Subscribe
 */
module.exports = {
	// RPC Events
	login: "com.chat.login",
	logout: "com.chat.logout",
	getParticipants: "com.chat.getparticipants",

	// PubSub Events
	newMessage: "com.chat.newmessage",
	newParticipant: "com.chat.newparticipant",
	participantLoggedOut: "com.chat.participantloggedout"
	participantTypping: "com.chat.participanttypping"
};