import { useEffect, useState } from 'react';
import { getAuth, User } from 'firebase/auth';
import { addDoc, collection, getDocs, onSnapshot, orderBy, query, Timestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { auth, db } from '../firebaseConfig'; // Firestore instance
import DashboardSideNav from './DashboardClientSideNav';
import Image from 'next/image';
import Link from 'next/link';
import CreateProjectPopup from './CreateProjectPopup';

interface Conversation {
    id: string;
    isPinned: boolean;
    title: string;
    timestamp: any; // Firestore Timestamp type
    lastMessage: string;
    unreadMessagesCount: number;
    lastSeen: string;
}

interface Props {
    conversations: Conversation[];
    selectedChat: string;
    handleChatSelect: (conversationId: string) => void;
    formatTimestamp: (timestamp: any) => string; // Assuming this function formats Firestore Timestamp
}

interface Message {
    id: string;
    text: string;
    sender: string;
    timestamp: Timestamp;
}

const DASHBOARDClientMessages = () => {
    const router = useRouter();
    const [conversations, setConversations] = useState<Conversation[]>([]); // List of conversations
    const [messages, setMessages] = useState<Message[]>([]); // Messages in the currently selected conversation
    const [selectedChat, setSelectedChat] = useState<string>('Lucidify'); // Initially set to 'Lucidify'
    const [newMessage, setNewMessage] = useState<string>('');

    const authInstance = getAuth();

    useEffect(() => {
        // Fetch all conversations on component mount
        const fetchConversations = async () => {
            const userId = authInstance.currentUser?.uid; // Get the current user ID
            if (!userId) return;

            const conversationsRef = collection(db, 'users', userId, 'conversations');
            const conversationsSnapshot = await getDocs(conversationsRef);

            const convos: Conversation[] = conversationsSnapshot.docs.map(doc => {
                const data = doc.data() as { title: string; isPinned?: boolean; timestamp?: Timestamp; lastMessage?: string; unreadMessagesCount?: number; lastSeen: string };

                return {
                    id: doc.id,
                    title: data.title || 'Untitled Chat', // Default value if title is missing
                    isPinned: data.isPinned ?? false, // Default to false if isPinned is missing
                    timestamp: data.timestamp ?? Timestamp.fromDate(new Date()), // Default to current timestamp if missing
                    lastMessage: data.lastMessage || '', // Default to empty string if lastMessage is missing
                    unreadMessagesCount: data.unreadMessagesCount ?? 0, // Default to 0 if unreadMessagesCount is missing
                    lastSeen: data.lastSeen,
                };
            });
            setConversations(convos);

            // Set selected chat to 'Lucidify' if it exists
            const lucidifyChat = convos.find(convo => convo.title === 'Lucidify');
            if (lucidifyChat) {
                setSelectedChat(lucidifyChat.id); // Ensure 'Lucidify' is the selected chat
                fetchMessages(lucidifyChat.id); // Fetch messages for 'Lucidify'
            }
        };


        fetchConversations();
    }, []);

    // Fetch messages for the selected conversation
    const fetchMessages = async (conversationName: string) => {
        const userId = authInstance.currentUser?.uid;
        if (!userId) return;

        const messagesRef = collection(db, 'users', userId, 'conversations', conversationName, 'messages');
        const q = query(messagesRef, orderBy("timestamp", "asc"));
        const messagesSnapshot = await getDocs(q);

        const fetchedMessages: Message[] = messagesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() as { text: string; sender: string; timestamp: Timestamp }
        }));
        setMessages(fetchedMessages);
    };

    // Fetch messages for the selected conversation
    useEffect(() => {
        if (selectedChat) {
            const fetchMessages = async (conversationName: string) => {
                const userId = authInstance.currentUser?.uid;
                if (!userId) return;

                const messagesRef = collection(db, 'users', userId, 'conversations', conversationName, 'messages');
                const q = query(messagesRef, orderBy("timestamp", "asc"));

                const unsubscribe = onSnapshot(q, (snapshot) => {
                    const messagesList: Message[] = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data() as { text: string; sender: string; timestamp: Timestamp }
                    }));
                    setMessages(messagesList);
                });

                return () => unsubscribe(); // Clean up listener on unmount
            };

            fetchMessages(selectedChat);
        }
    }, [selectedChat, authInstance]);

    // Update messages when a new chat is selected
    const handleChatSelect = (conversation: string) => {
        setSelectedChat(conversation); // Set the conversation to the selected one
        fetchMessages(conversation); // Call fetchMessages with the selected conversation
    };

    // Send new message
    const sendMessage = async () => {
        if (newMessage.trim() === '') return;

        const user = authInstance.currentUser;
        if (user) {
            const messageData = {
                text: newMessage,
                sender: user.uid,
                timestamp: new Date(),
            };

            await addDoc(collection(db, "users", user.uid, "conversations", selectedChat, "messages"), messageData);
            setNewMessage('');
        }
    };

    const chunkMessagesBySender = (messages: Message[]) => {
        const groupedMessages: Message[][] = [];
        let currentGroup: Message[] = [];

        messages.forEach((message, index) => {
            if (index === 0 || message.sender !== messages[index - 1].sender) {
                if (currentGroup.length > 0) {
                    groupedMessages.push(currentGroup);
                }
                currentGroup = [message];
            } else {
                currentGroup.push(message);
            }
        });

        if (currentGroup.length > 0) {
            groupedMessages.push(currentGroup);
        }

        return groupedMessages;
    };

    const groupedMessages = chunkMessagesBySender(messages);

    // Helper function to format the Firestore timestamp
    const formatTimestamp = (timestamp: Timestamp) => {
        if (timestamp instanceof Timestamp) {
            const date = timestamp.toDate(); // Converts Firestore Timestamp to JS Date
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Format the time as HH:MM
        }
        return '1:08'; // Fallback time if there's no valid timestamp
    };

    const selectedConversation = conversations.find(convo => convo.id === selectedChat);

    return (
        <div className="flex h-screen DashboardBackgroundGradient">
            {/* Left Sidebar */}
            <DashboardSideNav highlight="messages" />

            {/* Right Side (Main Content) */}
            <div className="flex-1 flex flex-col"> {/* Takes up remaining space */}
                <div className="absolute BottomGradientBorder left-0 top-[103px] w-full" />
                <div className="flex min-w-min items-center justify-between px-[50px] py-6">
                    <div className="inline-flex items-center gap-[5px]">
                        <div className="inline-flex items-center gap-[5px] opacity-40">
                            <div className="w-[15px]">
                                <Image
                                    src="/Home Icon.png"
                                    alt="Home Icon"
                                    layout="responsive"
                                    width={0}
                                    height={0}
                                />
                            </div>
                            <div className="font-light text-sm">
                                Home
                            </div>
                        </div>
                        <div className="inline-flex items-center gap-[5px]">
                            <div className=" font-light text-sm">
                                / Messages
                            </div>
                        </div>
                    </div>
                    <div className="inline-flex items-center gap-5">
                        <div className="flex w-[55px] h-[55px] items-center justify-center gap-2.5 relative rounded-[100px] BlackGradient ContentCardShadow hover:cursor-pointer">
                            <div className="flex flex-col w-5 h-5 items-center justify-center gap-2.5 px-[3px] py-0 absolute -top-[5px] -left-[4px] bg-[#6265f0] rounded-md">
                                <div className=" font-normal text-xs">
                                    2
                                </div>
                            </div>
                            <div className=" w-[25px]">
                                <Image
                                    src="/Notification Bell Icon.png"
                                    alt="Bell Icon"
                                    layout="responsive"
                                    width={0}
                                    height={0}
                                />
                            </div>
                        </div>
                        <Link
                            href="/settings"
                            className="flex w-[129px] h-[55px] items-center justify-center gap-2.5 px-0 py-[15px]  rounded-[15px] BlackGradient ContentCardShadow">
                            <div className=" font-light text-sm">
                                Settings
                            </div>
                            <div className=" w-[30px]">
                                <Image
                                    src="/Settings Icon.png"
                                    alt="Settings Icon"
                                    layout="responsive"
                                    width={0}
                                    height={0}
                                />
                            </div>
                        </Link>
                    </div>
                </div>

                {/* START OF MESSAGES */}
                <div className="flex w-full justify-center h-full">
                    <div className="flex w-full mx-[50px] my-[30px] p-[1px] ContentCardShadow rounded-[35px]">

                        {/* Left: Conversations List */}
                        <div className="flex flex-col w-[467px] bg-gradient-to-br from-[#1A1A1A] to-[#101010] rounded-l-[35px]">
                            <div className="flex justify-between mx-[50px] mt-[25px] items-center">
                                <h1 className="text-[30px] font-semibold mb-[2px]">Messages</h1>
                                <div className="hover:cursor-pointer flex items-center gap-[6px] px-[16px] py-[8px] rounded-[10px] PopupAttentionGradient PopupAttentionShadow">
                                    <div className="w-[15px]">
                                        <Image
                                            src="/Plus Icon.png"
                                            alt="Plus Icon"
                                            layout="responsive"
                                            width={0}
                                            height={0}
                                        />
                                    </div>
                                    <h3 className="text-[14px] font-light">New</h3>
                                </div>
                            </div>
                            <div className="relative my-[50px] mx-[50px]">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="w-full px-[15px] py-[15px] rounded-lg BlackWithLightGradient ContentCardShadow text-[14px] focus:outline-none"
                                />
                            </div>
                            <div className="flex flex-col gap-[30px]">
                                {/* Pinned Messages */}
                                <div className="flex flex-col gap-[10px]">
                                    <h3 className="px-[50px] opacity-70 font-light text-[14px]">Pinned</h3>
                                    <div className="flex flex-col">
                                        {conversations.filter(conversation => conversation.isPinned).length > 0 ? (
                                            conversations
                                                .filter(conversation => conversation.isPinned)
                                                .map(conversation => (
                                                    <div
                                                        key={conversation.id}
                                                        className={`px-[50px] py-[22px] border-t-[0.5px] border-solid border-white ${selectedChat === conversation.id ? 'MessagesHighlightGradient border-opacity-50' : 'border-opacity-25'} text-white cursor-pointer flex gap-[15px]`}
                                                        onClick={() => handleChatSelect(conversation.id)}
                                                    >
                                                        <div className="rounded-[5px] BlackGradient ContentCardShadow flex justify-center items-center">
                                                            <div className="w-[30px] mx-[8px] my-[8px]">
                                                                <Image
                                                                    src="/Lucidify Umbrella.png"
                                                                    alt="Lucidify Logo"
                                                                    layout="responsive"
                                                                    width={0}
                                                                    height={0}
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Main Content Section */}
                                                        <div className="flex flex-col h-full flex-grow">
                                                            {/* First Row: Title and Timestamp */}
                                                            <div className="flex justify-between w-full">
                                                                <h4 className="text-[16px] flex-grow">{conversation.title || 'Untitled Chat'}</h4>
                                                                <h4 className="text-[12px] opacity-60">{formatTimestamp(conversation.timestamp)}</h4>
                                                            </div>

                                                            {/* Second Row: Last Message and Unread Count */}
                                                            <div className="flex justify-between w-full">
                                                                <div className="flex-grow">
                                                                    <p className="text-[14px] opacity-40 whitespace-nowrap overflow-hidden text-ellipsis" style={{ maxWidth: '250px' }}>
                                                                        {conversation.lastMessage}
                                                                    </p>
                                                                </div>

                                                                {conversation.unreadMessagesCount > 0 ? (
                                                                    <div className="flex justify-center items-center w-[20px] h-[20px] bg-[#6265F0] rounded-full">
                                                                        <h4 className="px-[2px] text-[12px]">{conversation.unreadMessagesCount}</h4>
                                                                    </div>
                                                                ) : (
                                                                    <div className=""></div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                ))
                                        ) : (
                                            <p className="text-sm opacity-60 text-white">No messages</p>
                                        )}
                                    </div>
                                </div>

                                {/* All Messages */}
                                <div className="flex flex-col gap-[10px]">
                                    <h3 className="px-[50px] opacity-70 font-light text-[14px]">Pinned</h3>
                                    <div className="flex flex-col">
                                        {conversations.filter(conversation => !conversation.isPinned).length > 0 ? (
                                            conversations
                                                .filter(conversation => !conversation.isPinned)
                                                .map(conversation => (
                                                    <div
                                                        key={conversation.id}
                                                        className={`px-[50px] py-[22px] border-t-[0.5px] border-solid border-white ${selectedChat === conversation.id ? 'MessagesHighlightGradient border-opacity-50' : 'border-opacity-25'} text-white cursor-pointer flex gap-[15px]`}
                                                        onClick={() => handleChatSelect(conversation.id)}
                                                    >
                                                        <div className="rounded-[5px] BlackGradient ContentCardShadow flex justify-center items-center">
                                                            <div className="w-[30px] mx-[8px] my-[8px]">
                                                                <Image
                                                                    src="/Lucidify Umbrella.png"
                                                                    alt="Lucidify Logo"
                                                                    layout="responsive"
                                                                    width={0}
                                                                    height={0}
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Main Content Section */}
                                                        <div className="flex flex-col h-full flex-grow">
                                                            {/* First Row: Title and Timestamp */}
                                                            <div className="flex justify-between w-full">
                                                                <h4 className="text-[16px] flex-grow">{conversation.title || 'Untitled Chat'}</h4>
                                                                <h4 className="text-[12px] opacity-60">{formatTimestamp(conversation.timestamp)}</h4>
                                                            </div>

                                                            {/* Second Row: Last Message and Unread Count */}
                                                            <div className="flex justify-between w-full">
                                                                <div className="flex-grow">
                                                                    <p className="text-[14px] opacity-40 whitespace-nowrap overflow-hidden text-ellipsis" style={{ maxWidth: '250px' }}>
                                                                        {conversation.lastMessage}
                                                                    </p>
                                                                </div>

                                                                {conversation.unreadMessagesCount > 0 ? (
                                                                    <div className="flex justify-center items-center w-[20px] h-[20px] bg-[#6265F0] rounded-full">
                                                                        <h4 className="px-[2px] text-[12px]">{conversation.unreadMessagesCount}</h4>
                                                                    </div>
                                                                ) : (
                                                                    <div className=""></div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                ))
                                        ) : (
                                            <p className="text-sm opacity-60 text-white">No messages</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Chat Messages */}
                        <div className="flex-1 bg-gradient-to-br from-[#101010] to-[#1A1A1A] rounded-r-[35px] flex flex-col LeftGradientBorder">
                            <div className="BlackWithLightGradient rounded-tr-[35px] px-[60px] py-[20px] flex justify-between border-b-[0.5px] border-solid border-white border-opacity-20">
                                <div className="flex gap-[10px]">
                                    <div className="rounded-[5px] BlackGradient ContentCardShadow flex justify-center items-center">
                                        <div className="w-[30px] h-[30px] flex items-center mx-[8px] my-[8px]">
                                            <Image
                                                src="/Lucidify Umbrella.png"
                                                alt="Lucidify Logo"
                                                layout="responsive"
                                                width={0}
                                                height={0}
                                            />
                                        </div>
                                    </div>
                                    <div className="h-full flex flex-col justify-between font-semibold text-[16px]">
                                        <h3>{selectedConversation ? selectedConversation.title || 'Untitled Chat' : 'Loading...'}</h3>
                                        <h3 className="opacity-60 text-[14px] font-light">{selectedConversation ? selectedConversation.lastSeen || 'Last seen...' : 'Last seen...'}</h3>
                                    </div>
                                </div>
                                <div className="flex gap-[30px] items-center">
                                    <div className="flex gap-[15px]">
                                        <div className="rounded-[5px] BlackGradient ContentCardShadow flex justify-center items-center hover:cursor-pointer hover:scale-95">
                                            <div className="w-[20px] h-[20px] flex items-center mx-[8px] my-[8px]">
                                                <Image
                                                    src="/Phone Call Icon.png"
                                                    alt="Phone Call Icon"
                                                    layout="responsive"
                                                    width={0}
                                                    height={0}
                                                />
                                            </div>
                                        </div>
                                        <div className="rounded-[5px] BlackGradient ContentCardShadow flex justify-center items-center hover:cursor-pointer hover:scale-95">
                                            <div className="w-[20px] h-[20px] flex items-center mx-[8px] my-[8px]">
                                                <Image
                                                    src="/Video Call Icon.png"
                                                    alt="Video Call Icon"
                                                    layout="responsive"
                                                    width={0}
                                                    height={0}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-[4px] hover:cursor-pointer hover:opacity-50">
                                        <div className="bg-white rounded-full w-[4px] h-[4px]" />
                                        <div className="bg-white rounded-full w-[4px] h-[4px]" />
                                        <div className="bg-white rounded-full w-[4px] h-[4px]" />
                                    </div>
                                </div>
                            </div>


                            <div className="flex flex-col overflow-y-auto gap-[15px] max-h-[578px]">
                                {groupedMessages.map((group, index) => (
                                    <div key={index} className={`${group[0].sender === authInstance.currentUser?.uid ? 'text-right' : 'text-left'}`}>
                                        <div className="inline-flex flex-col gap-[5px]">
                                            <div className="">hi</div>
                                            {group.map(message => (
                                                <div key={message.id} className="flex flex-col gap-[50px]">
                                                    <div className={`border-b border-white border-solid ${group[0].sender === authInstance.currentUser?.uid ? 'bg-[#5840F0]' : 'bg-[#333741]'} `}>
                                                        {message.text}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>


                            <div className="mt-4 flex">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="w-full p-2 rounded-lg bg-[#333741] text-white focus:outline-none"
                                />
                                <button
                                    onClick={sendMessage}
                                    className="ml-2 p-2 rounded-lg bg-[#5840F0] text-white"
                                >
                                    Send
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default DASHBOARDClientMessages;
