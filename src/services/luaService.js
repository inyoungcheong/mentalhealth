import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';

export const initUserIfNeeded = httpsCallable(functions, 'initUserIfNeeded');
export const consumeLuaAndCreateSession = httpsCallable(functions, 'consumeLuaAndCreateSession');

// Admin
export const adminGetUsers = httpsCallable(functions, 'adminGetUsers');
export const adminAdjustLua = httpsCallable(functions, 'adminAdjustLua');
export const adminGetUserSessions = httpsCallable(functions, 'adminGetUserSessions');
export const adminGetMessages = httpsCallable(functions, 'adminGetMessages');
export const adminReplyMessage = httpsCallable(functions, 'adminReplyMessage');
